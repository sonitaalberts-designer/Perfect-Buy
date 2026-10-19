<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function failCheckout(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    failCheckout(405, 'Please use the website checkout form.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    failCheckout(413, 'The checkout request is too large.');
}

// cPanel's HOME is independent of the domain's document root.
$home = getenv('HOME') ?: '/home/houseofcreat';
$configPath = $home . '/.perfectbuy-config.php';
$config = is_file($configPath) ? require $configPath : [];
$origin = rtrim($config['site_url'] ?? 'https://perfectbuy.co.za', '/');
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin !== '' && $requestOrigin !== $origin) {
    failCheckout(403, 'Please start checkout on the Perfect Buy website.');
}

$data = json_decode(file_get_contents('php://input', false, null, 0, 16385), true);
$customer = is_array($data) ? ($data['customer'] ?? null) : null;
$items = is_array($data) ? ($data['items'] ?? null) : null;
if (!is_array($customer) || !is_array($items) || count($items) < 1 || count($items) > 50) {
    failCheckout(400, 'Please check your cart and customer details.');
}
foreach (['name' => [2, 100], 'email' => [3, 200], 'phone' => [7, 30]] as $field => $limits) {
    if (!isset($customer[$field]) || !is_string($customer[$field])) {
        failCheckout(400, 'Please check your customer details.');
    }
    $customer[$field] = trim($customer[$field]);
    $length = strlen($customer[$field]);
    if ($length < $limits[0] || $length > $limits[1]) {
        failCheckout(400, 'Please check your customer details.');
    }
}
if (!filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
    failCheckout(400, 'Please enter a valid email address.');
}
$catalog = json_decode(file_get_contents(__DIR__ . '/catalog.json'), true);
if (!is_array($catalog)) failCheckout(503, 'Secure checkout is temporarily unavailable.');
$catalogById = array_column($catalog, null, 'id');
// Charge shipping once per order; never accept a browser-supplied shipping amount.
$shippingFeeCents = 10000;
$amount = $shippingFeeCents;
$summary = [];
foreach ($items as $item) {
    if (!is_array($item) || !isset($item['productId']) || !is_string($item['productId']) ||
        !isset($item['quantity']) || !is_int($item['quantity']) || $item['quantity'] < 1 || $item['quantity'] > 10) {
        failCheckout(400, 'Please check the products and quantities in your cart.');
    }
    $product = $catalogById[$item['productId']] ?? null;
    if (!$product || !isset($product['price']) || $product['price'] <= 0) {
        failCheckout(400, 'One of the selected products is unavailable.');
    }
    foreach (['size' => 'sizes', 'color' => 'colors'] as $field => $options) {
        if (isset($item[$field]) && (!is_string($item[$field]) || strlen($item[$field]) > 40 ||
            (isset($product[$options]) && !in_array($item[$field], $product[$options], true)))) {
            failCheckout(400, 'One of the selected product options is unavailable.');
        }
    }
    // Amounts always come from the server catalog, never from browser prices.
    $amount += (int)round($product['price'] * 100) * $item['quantity'];
    $summary[] = $item['quantity'] . 'x ' . $product['name'];
}

$secret = $config['yoco_secret_key'] ?? getenv('YOCO_SECRET_KEY');
if (!$secret || !function_exists('curl_init')) {
    failCheckout(503, 'Secure checkout is still being configured. Please try again soon.');
}
$reference = 'PB-' . strtoupper(bin2hex(random_bytes(8)));
$payload = [
    'amount' => $amount,
    'currency' => 'ZAR',
    'successUrl' => $origin . '/checkout?payment=success&order=' . rawurlencode($reference),
    'cancelUrl' => $origin . '/checkout?payment=cancelled',
    'failureUrl' => $origin . '/checkout?payment=failed',
    'metadata' => [
        'orderReference' => $reference,
        'customerName' => $customer['name'],
        'customerEmail' => $customer['email'],
        'customerPhone' => $customer['phone'],
        'items' => substr(implode(', ', $summary), 0, 500),
        'shippingFee' => number_format($shippingFeeCents / 100, 2, '.', ''),
    ],
];
$curl = curl_init('https://payments.yoco.com/api/checkouts');
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $secret, 'Content-Type: application/json', 'Idempotency-Key: ' . $reference],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);
$body = curl_exec($curl);
$status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
$result = is_string($body) ? json_decode($body, true) : null;
$redirect = is_array($result) ? ($result['redirectUrl'] ?? null) : null;
if ($status < 200 || $status >= 300 || !is_string($redirect) ||
    !filter_var($redirect, FILTER_VALIDATE_URL) || parse_url($redirect, PHP_URL_SCHEME) !== 'https') {
    failCheckout(502, "We couldn't start secure payment. Please try again.");
}
echo json_encode(['redirectUrl' => $redirect, 'checkoutId' => $result['id'] ?? null, 'orderReference' => $reference]);
