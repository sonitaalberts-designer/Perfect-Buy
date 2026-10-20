<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['error' => 'Please search for a locker on the website.']);
    exit;
}
$query = $_GET['q'] ?? '';
if (!is_string($query) || strlen($query) > 80) {
    http_response_code(400);
    echo json_encode(['error' => 'Please enter a shorter locker search.']);
    exit;
}
$query = trim($query);
if (strlen($query) < 2) { echo json_encode(['lockers' => []]); exit; }
require_once __DIR__ . '/courier.php';
require_once __DIR__ . '/locker-search.php';
try {
    echo json_encode(perfectBuySearchCollectionLockers(perfectBuyCollectionLockers(), $query));
} catch (RuntimeException $error) {
    http_response_code(503);
    echo json_encode(['error' => $error->getMessage()]);
}
