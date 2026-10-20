<?php
declare(strict_types=1);

// Deploy this directory outside public_html as /home/houseofcreat/.perfectbuy-notifications.
// The caller MUST hold the order's exclusive .lock until this function returns.
// A true PHP mail() result records local mail-server acceptance, not inbox delivery.

function perfectBuyNotificationWrite(string $path, array $data): bool {
    $mask = umask(0077);
    $temporary = $path . '.' . bin2hex(random_bytes(8)) . '.tmp';
    $encoded = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    $saved = is_string($encoded) && @file_put_contents($temporary, $encoded, LOCK_EX) !== false && @rename($temporary, $path);
    if (!$saved) @unlink($temporary);
    umask($mask);
    return $saved;
}

function perfectBuyEmailText(mixed $value, int $limit = 300): string {
    if (!is_string($value) && !is_int($value)) return '';
    $value = preg_replace('/[\x00-\x20\x7F]+/', ' ', (string)$value) ?? '';
    return trim(substr($value, 0, $limit));
}

function perfectBuyEmailMoney(int $cents): string {
    return 'R' . number_format($cents / 100, 2, '.', ' ');
}

function perfectBuyOwnerEmailSettings(array $config): ?array {
    $to = $config['owner_email_to'] ?? 'orders@perfect-buy.co.za';
    $from = $config['owner_email_from'] ?? 'orders@perfectbuy.co.za';
    foreach ([$to, $from] as $address) {
        if (!is_string($address) || strlen($address) > 254 || strpbrk($address, "\r\n\0") !== false ||
            !filter_var($address, FILTER_VALIDATE_EMAIL)) return null;
    }
    // Allow the website domain or the existing authenticated cPanel system account.
    // Never send from a customer's address or an arbitrary external domain.
    if (!preg_match('/^[A-Za-z0-9._+-]+@perfectbuy\.co\.za$/D', $from) &&
        $from !== 'houseofcreat@houseofcreativess.co.za') return null;
    if (($config['owner_email_transport'] ?? 'mail') !== 'mail') return null;
    return ['to' => $to, 'from' => $from];
}

function perfectBuyOwnerEmailBody(array $order, bool $test = false): string {
    $customer = is_array($order['customer'] ?? null) ? $order['customer'] : [];
    $locker = is_array($order['collectionLocker'] ?? null) ? $order['collectionLocker'] : [];
    $shipping = (int)($order['shippingFeeCents'] ?? 10000);
    $total = (int)($order['amountCents'] ?? 0);
    $lines = [
        $test ? 'TEST ONLY - NO ORDER / NO PAYMENT / DO NOT FULFIL' : 'NEW PAID PERFECT BUY ORDER',
        '',
        'Order reference: ' . perfectBuyEmailText($order['reference'] ?? ''),
        $test ? 'Payment: SAMPLE ONLY. No payment has been made.' : 'Payment: confirmed by the signed live Yoco payment notification.',
        'Paid at (UTC): ' . perfectBuyEmailText($order['paidAt'] ?? ''),
        '',
        'CUSTOMER',
        'Name: ' . perfectBuyEmailText($customer['name'] ?? ''),
        'Email: ' . perfectBuyEmailText($customer['email'] ?? ''),
        'Phone: ' . perfectBuyEmailText($customer['phone'] ?? ''),
        '',
        'ITEMS',
    ];
    foreach (array_slice(is_array($order['items'] ?? null) ? $order['items'] : [], 0, 50) as $item) {
        if (!is_array($item)) continue;
        $quantity = (int)($item['quantity'] ?? 0);
        $price = (int)($item['unitPriceCents'] ?? 0);
        $lines[] = $quantity . ' x ' . perfectBuyEmailText($item['name'] ?? '') . ' | ' . perfectBuyEmailMoney($price) . ' each | ' . perfectBuyEmailMoney($quantity * $price);
        foreach (['size' => 'Size (SA/UK for sneakers)', 'color' => 'Colour'] as $key => $label) {
            $option = perfectBuyEmailText($item[$key] ?? '');
            if ($option !== '') $lines[] = '  ' . $label . ': ' . $option;
        }
    }
    array_push($lines,
        '',
        'Items subtotal: ' . perfectBuyEmailMoney($total - $shipping),
        'Shipping - PUDO locker to locker: ' . perfectBuyEmailMoney($shipping),
        'TOTAL: ' . perfectBuyEmailMoney($total),
        '',
        'CUSTOMER COLLECTION / SHIPPING ADDRESS',
        'PUDO locker: ' . perfectBuyEmailText($locker['name'] ?? ''),
        'Locker ID: ' . perfectBuyEmailText($locker['id'] ?? ''),
        'Address: ' . perfectBuyEmailText($locker['address'] ?? '', 600),
        '',
        'Parcel preset: Large (V4-L), 60 x 41 x 41 cm, 15 kg.',
        'Courier booking: NOT created automatically. Arrange the shipment separately.',
        '',
        'Website: https://perfectbuy.co.za',
        'Keep customer details private. This message is for the shop owner only.'
    );
    return implode("\n", $lines) . "\n";
}

/**
 * Durable send state. The surrounding order/test lock must remain held.
 * Explicit mail rejection is retried. An interrupted/ambiguous send needs review,
 * because retrying it automatically could send the owner a duplicate message.
 */
function perfectBuyEmailAttempt(array &$state, array $message, callable $save, ?callable $transport, int $now): string {
    $status = $state['status'] ?? 'pending';
    if ($status === 'sent' || $status === 'needs_review') return $status;
    if ($status === 'sending') {
        $state['status'] = 'needs_review';
        $state['lastErrorCode'] = 'previous_send_outcome_unknown';
        return $save() ? 'needs_review' : 'persistence_failed';
    }
    if ($status === 'retry' && (int)($state['nextAttemptAt'] ?? 0) > $now) return 'retry';
    $previous = $state;
    $state['status'] = 'sending';
    $state['attempts'] = (int)($state['attempts'] ?? 0) + 1;
    $state['messageId'] = $message['messageId'];
    $state['lastAttemptAt'] = gmdate('c', $now);
    unset($state['nextAttemptAt'], $state['lastErrorCode']);
    if (!$save()) {
        $state = $previous;
        return 'persistence_failed';
    }
    try {
        $accepted = $transport !== null ? $transport($message) === true : @mail(
            $message['to'], $message['subject'], $message['body'],
            $message['headers'], '-f' . $message['from']
        );
        if ($accepted) {
            $state['status'] = 'sent';
            $state['acceptedAt'] = gmdate('c', $now);
            $state['deliveryStatus'] = 'accepted_by_local_mail_server';
        } else {
            $state['status'] = $state['attempts'] >= 12 ? 'needs_review' : 'retry';
            $state['lastErrorCode'] = 'mail_server_rejected';
            $state['nextAttemptAt'] = $now + min(3600, 60 * (2 ** min(6, $state['attempts'] - 1)));
        }
    } catch (Throwable $error) {
        // Never put a raw exception, SMTP response or customer information in state/logs.
        $state['status'] = 'needs_review';
        $state['lastErrorCode'] = 'send_outcome_unknown';
    }
    return $save() ? $state['status'] : 'persistence_failed_after_send';
}

function perfectBuyEmailMessage(array $order, array $settings, bool $test = false): array {
    $reference = $order['reference'];
    $senderDomain = substr($settings['from'], strrpos($settings['from'], '@') + 1);
    $messageId = '<perfectbuy-' . ($test ? 'email-test' : strtolower($reference)) . '@' . $senderDomain . '>';
    return [
        'to' => $settings['to'], 'from' => $settings['from'], 'messageId' => $messageId,
        'subject' => $test ? 'Perfect Buy EMAIL TEST - NO ORDER / NO PAYMENT' : 'Perfect Buy paid order ' . $reference,
        'body' => perfectBuyOwnerEmailBody($order, $test),
        'headers' => implode("\r\n", [
            'From: Perfect Buy Orders <' . $settings['from'] . '>',
            'Reply-To: ' . $settings['to'],
            'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit', 'Message-ID: ' . $messageId,
            'Auto-Submitted: auto-generated',
        ]),
    ];
}

function perfectBuyNotifyOwnerEmail(array &$order, string $orderPath, array $config, ?callable $transport = null, ?int $now = null): string {
    if (($order['status'] ?? '') !== 'paid' || ($order['paymentMode'] ?? '') !== 'live' ||
        !is_string($order['paymentId'] ?? null) || $order['paymentId'] === '' ||
        !is_string($order['paymentEventId'] ?? null) || $order['paymentEventId'] === '' ||
        !is_string($order['reference'] ?? null) ||
        !preg_match('/^PB-[A-F0-9]{16}$/D', $order['reference'])) return 'ineligible';
    if (!isset($order['notifications']) || !is_array($order['notifications'])) $order['notifications'] = [];
    if (!isset($order['notifications']['ownerEmail']) || !is_array($order['notifications']['ownerEmail'])) {
        $order['notifications']['ownerEmail'] = ['status' => 'pending', 'attempts' => 0];
    }
    $state =& $order['notifications']['ownerEmail'];
    $save = static function () use (&$order, &$state, $orderPath): bool {
        $order['ownerNotificationStatus'] = $state['status'];
        return perfectBuyNotificationWrite($orderPath, $order);
    };
    if (($state['status'] ?? '') === 'sent') return 'sent';
    if (in_array($state['status'] ?? '', ['sending', 'needs_review'], true)) {
        $state['status'] = 'needs_review';
        $state['lastErrorCode'] = $state['lastErrorCode'] ?? 'previous_send_outcome_unknown';
        return $save() ? 'needs_review' : 'persistence_failed';
    }
    $settings = perfectBuyOwnerEmailSettings($config);
    if (($config['owner_email_enabled'] ?? false) !== true || $settings === null) {
        $state['status'] = 'pending_configuration';
        $state['lastErrorCode'] = $settings === null ? 'invalid_email_configuration' : 'email_disabled';
        return $save() ? 'pending_configuration' : 'persistence_failed';
    }
    return perfectBuyEmailAttempt($state, perfectBuyEmailMessage($order, $settings), $save, $transport, $now ?? time());
}

function perfectBuySendOwnerEmailTest(string $privateDirectory, array $config, ?callable $transport = null, ?int $now = null): string {
    $settings = perfectBuyOwnerEmailSettings($config);
    if (($config['owner_email_enabled'] ?? false) !== true || $settings === null) return 'pending_configuration';
    $path = $privateDirectory . '/email-test-state.json';
    $state = is_file($path) ? json_decode((string)file_get_contents($path), true) : [];
    if (!is_array($state)) return 'needs_review';
    $save = static function () use (&$state, $path): bool { return perfectBuyNotificationWrite($path, $state); };
    $sample = [
        'reference' => 'PB-0000000000000000', 'paidAt' => 'TEST ONLY',
        'customer' => ['name' => 'TEST CUSTOMER', 'email' => 'sample@example.invalid', 'phone' => 'TEST ONLY'],
        'items' => [['name' => 'Example sneakers (sample only)', 'quantity' => 1, 'unitPriceCents' => 39900, 'size' => '5', 'color' => 'Black']],
        'shippingFeeCents' => 10000, 'amountCents' => 49900,
        'collectionLocker' => ['name' => 'Example customer-selected PUDO locker', 'id' => 'SAMPLE ONLY', 'address' => 'Sample locker address - not a real shipment'],
    ];
    return perfectBuyEmailAttempt($state, perfectBuyEmailMessage($sample, $settings, true), $save, $transport, $now ?? time());
}
