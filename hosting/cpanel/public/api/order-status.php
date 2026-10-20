<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST'); http_response_code(405); echo json_encode(['error' => 'POST required.']); exit;
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 1024) {
    http_response_code(413); echo json_encode(['error' => 'Request too large.']); exit;
}
$data = json_decode(file_get_contents('php://input', false, null, 0, 1025), true);
$reference = $data['orderReference'] ?? null;
$token = $data['receiptToken'] ?? null;
if (!is_string($reference) || !preg_match('/^PB-[A-F0-9]{16}$/D', $reference) ||
    !is_string($token) || !preg_match('/^[a-f0-9]{64}$/D', $token)) {
    http_response_code(400); echo json_encode(['error' => 'Invalid receipt.']); exit;
}
$home = getenv('HOME') ?: '/home/houseofcreat';
$path = $home . '/.perfectbuy-orders/' . $reference . '.json';
$order = is_file($path) ? json_decode(file_get_contents($path), true) : null;
if (!is_array($order) || !is_string($order['receiptTokenHash'] ?? null) ||
    !hash_equals($order['receiptTokenHash'], hash('sha256', $token))) {
    http_response_code(404); echo json_encode(['error' => 'Receipt not available.']); exit;
}
// The browser return URL is never proof of payment. Only the verified live webhook sets these fields.
$paid = ($order['status'] ?? '') === 'paid' && ($order['paymentMode'] ?? '') === 'live' &&
    !empty($order['paymentId']) && !empty($order['paymentEventId']);
echo json_encode(['status' => $paid ? 'paid' : 'unconfirmed']);
