<?php
declare(strict_types=1);
// Test events have a separate signing secret and order directory and cannot mark live orders paid.
define('PERFECTBUY_YOCO_TEST', true);
require __DIR__ . '/yoco-webhook.php';
