<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function webhookReply(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['message' => $message]);
    exit;
}

function notifyPaidOrderOwner(array &$order, string $path, string $home): void {
    $library = $home . '/.perfectbuy-notifications/owner-notifications.php';
    if (!is_file($library)) return;
    try {
        require_once $library;
        $notificationConfigPath = $home . '/.perfectbuy-notifications.php';
        $notificationConfig = is_file($notificationConfigPath) ? require $notificationConfigPath : [];
        perfectBuyNotifyOwnerEmail($order, $path, is_array($notificationConfig) ? $notificationConfig : []);
    } catch (Throwable $error) {
        // Payment is already durable. The private worker retries pending email separately.
        error_log('Perfect Buy owner email requires review.');
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    webhookReply(405, 'POST required.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) webhookReply(413, 'Request too large.');
$home = getenv('HOME') ?: '/home/houseofcreat';
$configPath = $home . (defined('PERFECTBUY_YOCO_TEST') ? '/.perfectbuy-yoco-test-config.php' : '/.perfectbuy-config.php');
$config = is_file($configPath) ? require $configPath : [];
$secret = $config['yoco_webhook_secret'] ?? '';
$mode = $config['yoco_mode'] ?? 'live';
if (!is_string($secret) || !str_starts_with($secret, 'whsec_')) webhookReply(503, 'Payment confirmation is not configured.');
$key = base64_decode(substr($secret, 6), true);
if ($key === false || strlen($key) < 16) webhookReply(503, 'Payment confirmation is not configured.');
$id = $_SERVER['HTTP_WEBHOOK_ID'] ?? '';
$timestamp = $_SERVER['HTTP_WEBHOOK_TIMESTAMP'] ?? '';
$signatures = $_SERVER['HTTP_WEBHOOK_SIGNATURE'] ?? '';
if ($id === '' || strlen($id) > 200 || !ctype_digit($timestamp) || abs(time() - (int)$timestamp) > 180) {
    webhookReply(403, 'Invalid webhook.');
}
$raw = file_get_contents('php://input', false, null, 0, 65537);
if (!is_string($raw) || strlen($raw) > 65536) webhookReply(413, 'Request too large.');
$expected = base64_encode(hash_hmac('sha256', $id . '.' . $timestamp . '.' . $raw, $key, true));
$verified = false;
foreach (explode(' ', $signatures) as $signature) {
    if (str_starts_with($signature, 'v1,') && hash_equals($expected, substr($signature, 3))) $verified = true;
}
if (!$verified) webhookReply(403, 'Invalid webhook.');
$event = json_decode($raw, true);
if (!is_array($event)) webhookReply(400, 'Invalid event.');
if (($event['type'] ?? '') !== 'payment.succeeded') webhookReply(200, 'Event ignored.');
$payment = $event['payload'] ?? [];
if (($payment['status'] ?? '') !== 'succeeded' || ($payment['mode'] ?? '') !== $mode ||
    ($payment['currency'] ?? '') !== 'ZAR' || !is_int($payment['amount'] ?? null) ||
    !is_string($payment['id'] ?? null) || !is_string($event['id'] ?? null)) {
    webhookReply(400, 'Payment details do not match.');
}
$checkoutId = $payment['metadata']['checkoutId'] ?? null;
if (!is_string($checkoutId) || $checkoutId === '' || strlen($checkoutId) > 200) webhookReply(400, 'Missing checkout reference.');
$directory = $home . (defined('PERFECTBUY_YOCO_TEST') ? '/.perfectbuy-test-orders' : '/.perfectbuy-orders');
$index = $directory . '/checkout-' . hash('sha256', $checkoutId) . '.ref';
if (!is_file($index)) webhookReply(200, 'Unrelated checkout ignored.');
$reference = trim(file_get_contents($index));
if (!preg_match('/^PB-[A-F0-9]{16}$/D', $reference)) webhookReply(500, 'Order reference unavailable.');
$path = $directory . '/' . $reference . '.json';
$oldMask = umask(0077);
$lock = @fopen($directory . '/' . $reference . '.lock', 'c');
umask($oldMask);
if (!$lock || !flock($lock, LOCK_EX)) webhookReply(503, 'Please retry payment confirmation.');
$order = is_file($path) ? json_decode(file_get_contents($path), true) : null;
if (!is_array($order) || ($order['checkoutId'] ?? '') !== $checkoutId ||
    ($order['amountCents'] ?? null) !== $payment['amount']) {
    flock($lock, LOCK_UN); fclose($lock);
    webhookReply(409, 'Payment does not match the saved order.');
}
if (($order['status'] ?? '') === 'paid') {
    $samePayment = ($order['paymentId'] ?? '') === $payment['id'];
    if ($samePayment) notifyPaidOrderOwner($order, $path, $home);
    flock($lock, LOCK_UN); fclose($lock);
    webhookReply($samePayment ? 200 : 409, $samePayment ? 'Payment already recorded.' : 'Different payment already recorded.');
}
$order['status'] = 'paid';
$order['paymentId'] = $payment['id'];
$order['paymentEventId'] = $event['id'];
$order['paymentMode'] = $mode;
$order['paidAt'] = gmdate('c');
// This durable state is the hand-off to fulfillment, never a claim that a booking or email was sent.
$order['fulfillmentStatus'] = 'pending_configuration';
$order['ownerNotificationStatus'] = 'pending_configuration';
$oldMask = umask(0077);
$temporary = $path . '.' . bin2hex(random_bytes(6)) . '.tmp';
$saved = @file_put_contents($temporary, json_encode($order), LOCK_EX) !== false && @rename($temporary, $path);
umask($oldMask);
if ($saved) notifyPaidOrderOwner($order, $path, $home);
flock($lock, LOCK_UN); fclose($lock);
if (!$saved) webhookReply(503, 'Please retry payment confirmation.');
webhookReply(200, 'Payment recorded.');
