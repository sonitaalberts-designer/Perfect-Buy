<?php
declare(strict_types=1);

// Run privately every minute, e.g. /usr/local/bin/php /home/houseofcreat/.perfectbuy-notifications/notify-owner-worker.php
// Run once with --test for a clearly labelled test email; its private marker prevents duplicate tests.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require_once __DIR__ . '/owner-notifications.php';
$home = getenv('HOME') ?: '/home/houseofcreat';
$configPath = $home . '/.perfectbuy-notifications.php';
$config = is_file($configPath) ? require $configPath : [];
if (!is_array($config)) $config = [];
$privateDirectory = $home . '/.perfectbuy-notifications';

if (in_array('--test', $argv ?? [], true)) {
    $mask = umask(0077);
    $lock = @fopen($privateDirectory . '/email-test.lock', 'c');
    umask($mask);
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) exit(1);
    $result = perfectBuySendOwnerEmailTest($privateDirectory, $config);
    flock($lock, LOCK_UN); fclose($lock);
    echo 'Owner email test: ' . $result . ". Local acceptance is not proof of inbox delivery.\n";
    exit($result === 'sent' ? 0 : 1);
}

$directory = $home . '/.perfectbuy-orders';
$counts = [];
foreach (glob($directory . '/PB-*.json') ?: [] as $path) {
    $reference = basename($path, '.json');
    if (!preg_match('/^PB-[A-F0-9]{16}$/D', $reference)) continue;
    $mask = umask(0077);
    $lock = @fopen($directory . '/' . $reference . '.lock', 'c');
    umask($mask);
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) { if ($lock) fclose($lock); continue; }
    $order = json_decode((string)@file_get_contents($path), true);
    if (is_array($order) && ($order['reference'] ?? '') === $reference) {
        $result = perfectBuyNotifyOwnerEmail($order, $path, $config);
        $counts[$result] = ($counts[$result] ?? 0) + 1;
    }
    flock($lock, LOCK_UN); fclose($lock);
}
// Operational counts only: no customer details or order references in cron mail/logs.
echo json_encode($counts) . "\n";
