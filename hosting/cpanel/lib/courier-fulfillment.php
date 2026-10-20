<?php
declare(strict_types=1);

// PRIVATE LIBRARY: deploy beside owner-notifications.php, outside public_html.
// The caller MUST hold this order's exclusive .lock for this entire call.
// API contract: https://www.shiplogic.com/postman-collections/tcg.postman_collection.json
// Locker details: https://thecourierguy.co.za/wp-content/uploads/2025/08/The-Courier-Guy-Locker-API-docs.pdf
// customer_reference is correlation, NOT an API idempotency key. Once a create
// might have reached TCG, only GET reconciliation is permitted automatically.

function perfectBuyCourierWrite(string $path, array $order): bool {
    $mask = umask(0077);
    $temporary = $path . '.' . bin2hex(random_bytes(8)) . '.tmp';
    $json = json_encode($order, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    $saved = is_string($json) && @file_put_contents($temporary, $json, LOCK_EX) !== false && @rename($temporary, $path);
    if (!$saved) @unlink($temporary);
    umask($mask);
    return $saved;
}

function perfectBuyCourierContact(mixed $value): ?array {
    if (!is_array($value)) return null;
    $name = $value['name'] ?? null;
    $email = $value['email'] ?? null;
    $phone = $value['mobile_number'] ?? $value['phone'] ?? null;
    if (!is_string($name) || strlen(trim($name)) < 2 || strlen($name) > 100 ||
        preg_match('/[\x00-\x1F\x7F]/', $name) || !is_string($email) || strlen($email) > 200 ||
        !filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($phone)) return null;
    $phone = preg_replace('/[ ()-]/', '', $phone);
    if (!is_string($phone) || !preg_match('/^(?:0[1-9][0-9]{8}|\+27[1-9][0-9]{8})$/D', $phone)) return null;
    if ($phone[0] === '0') $phone = '+27' . substr($phone, 1);
    return ['name' => trim($name), 'email' => $email, 'mobile_number' => $phone];
}

function perfectBuyCourierHttp(array $config, string $method, string $path, ?array $payload = null): array {
    $base = rtrim($config['api_base_url'] ?? 'https://api.portal.thecourierguy.co.za', '/');
    if (!in_array($base, ['https://api.portal.thecourierguy.co.za', 'https://api.portal.thecourierguy.co.za/v2'], true) ||
        !is_string($config['api_key'] ?? null) || $config['api_key'] === '' || !function_exists('curl_init')) {
        return ['status' => 0, 'data' => null];
    }
    $curl = curl_init($base . $path);
    $body = '';
    curl_setopt_array($curl, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $config['api_key'], 'Accept: application/json', 'Content-Type: application/json'],
        CURLOPT_WRITEFUNCTION => static function ($curl, string $chunk) use (&$body): int {
            // The live pickup-point directory is ~3.7 MB (3183 points).
            if (strlen($body) + strlen($chunk) > 8388608) return 0;
            $body .= $chunk;
            return strlen($chunk);
        },
    ]);
    if ($payload !== null) curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($payload));
    $ok = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    return ['status' => $ok === false ? 0 : $status, 'data' => json_decode($body, true)];
}

function perfectBuyCourierRequest(array $config, ?callable $transport, string $method, string $path, ?array $payload = null): array {
    try {
        $response = $transport !== null ? $transport($method, $path, $payload) : perfectBuyCourierHttp($config, $method, $path, $payload);
        return is_array($response) ? $response : ['status' => 0, 'data' => null];
    } catch (Throwable $error) {
        // Raw carrier errors can contain contact details or credentials; never persist them.
        return ['status' => 0, 'data' => null];
    }
}

function perfectBuyCourierDestination(array $order, array $points): ?array {
    $id = $order['collectionLocker']['id'] ?? null;
    if (!is_string($id) || !preg_match('/^([0-9]+):([A-Za-z0-9_-]{1,60})$/D', $id, $match)) return null;
    foreach ($points as $point) {
        if (!is_array($point) || (string)($point['provider_id'] ?? '') !== $match[1] ||
            ($point['pickup_point_id'] ?? '') !== $match[2]) continue;
        if (($point['type'] ?? '') !== 'locker' || ($point['pickup_point_provider'] ?? '') !== 'tcg-locker' ||
            ($point['status'] ?? '') !== 'online' || !empty($point['is_hidden']) ||
            !in_array('V4-L', $point['available_compartment_sizes'] ?? [], true)) return null;
        return ['id' => $id, 'pickupPointId' => $match[2], 'provider' => 'tcg-locker'];
    }
    return null;
}

function perfectBuyCourierParcel(): array {
    // One merchant-selected Large parcel for every product/quantity, as requested.
    return ['parcel_description' => 'Perfect Buy Large parcel', 'submitted_length_cm' => 60,
        'submitted_width_cm' => 41, 'submitted_height_cm' => 41, 'submitted_weight_kg' => 15];
}

function perfectBuyCourierSameShipment(array $shipment, array $request): bool {
    if (($shipment['customer_reference'] ?? '') !== $request['customer_reference'] ||
        ($shipment['collection_pickup_point_provider'] ?? '') !== 'tcg-locker' ||
        ($shipment['collection_pickup_point_id'] ?? '') !== 'CG0000' ||
        ($shipment['delivery_pickup_point_provider'] ?? '') !== 'tcg-locker' ||
        ($shipment['delivery_pickup_point_id'] ?? '') !== $request['delivery_pickup_point_id'] ||
        count($shipment['parcels'] ?? []) !== 1) return false;
    foreach (['submitted_length_cm', 'submitted_width_cm', 'submitted_height_cm', 'submitted_weight_kg'] as $key) {
        if (!is_numeric($shipment['parcels'][0][$key] ?? null) ||
            (float)$shipment['parcels'][0][$key] !== (float)$request['parcels'][0][$key]) return false;
    }
    foreach (['collection_contact', 'delivery_contact'] as $key) {
        $actual = perfectBuyCourierContact($shipment[$key] ?? null);
        if ($actual === null || $actual !== $request[$key]) return false;
    }
    return true;
}

function perfectBuyCourierRecordShipment(array &$state, array $shipment, int $now): bool {
    $id = $shipment['id'] ?? null;
    $tracking = $shipment['short_tracking_reference'] ?? null;
    if ((!is_int($id) && !is_string($id)) || !preg_match('/^[1-9][0-9]*$/D', (string)$id) ||
        !is_string($tracking) || !preg_match('/^[A-Za-z0-9-]{1,80}$/D', $tracking)) return false;
    $state['shipmentId'] = (string)$id;
    $state['trackingReference'] = $tracking;
    $state['carrierStatus'] = is_string($shipment['status'] ?? null) ? substr($shipment['status'], 0, 60) : 'unknown';
    $state['lastCheckedAt'] = gmdate('c', $now);
    // Do not mistake proof_of_delivery_pin for a sender drop-off PIN. Carrier
    // emails the sender using collection_contact; no undocumented PIN is exposed.
    $state['dropoffCodeDelivery'] = 'carrier_email';
    $accepted = ['awaiting-dropoff', 'collected', 'at-hub', 'in-transit', 'at-destination-hub',
        'in-locker', 'ready-for-pickup', 'delivered'];
    if (in_array($state['carrierStatus'], $accepted, true)) {
        $state['status'] = 'booked';
        $state['bookedAt'] = $state['bookedAt'] ?? gmdate('c', $now);
        unset($state['lastErrorCode'], $state['nextAttemptAt']);
    } elseif ($state['carrierStatus'] === 'submitted') {
        $state['status'] = 'processing';
        $state['nextAttemptAt'] = $now + 60;
    } else {
        $state['status'] = 'needs_review';
        $state['lastErrorCode'] = 'carrier_booking_not_ready';
    }
    return true;
}

function perfectBuyCourierFindExisting(array $request, int $start, array $config, ?callable $transport, int $now): ?array {
    $matches = [];
    // A truncated/unavailable lookup never proves absence. References are not
    // unique at TCG, so every page must be examined before accepting one match.
    for ($page = 0; $page < 5; $page++) {
        $query = http_build_query(['date_filter' => 'time_created', 'start_date' => gmdate('c', $start),
            'end_date' => gmdate('c', $now + 60), 'limit' => 100, 'offset' => $page * 100], '', '&', PHP_QUERY_RFC3986);
        $response = perfectBuyCourierRequest($config, $transport, 'GET', '/shipments?' . $query);
        $shipments = $response['data']['shipments'] ?? null;
        if (($response['status'] ?? 0) !== 200 || !is_array($shipments)) return null;
        foreach ($shipments as $shipment) {
            if (is_array($shipment) && ($shipment['customer_reference'] ?? '') === $request['customer_reference']) $matches[] = $shipment;
        }
        if (count($shipments) < 100) return $matches;
    }
    return null;
}

/**
 * Never repeats POST after an uncertain create. A caller holding the same order
 * lock may repeatedly invoke this method; it performs only bounded GET lookups.
 */
function perfectBuyCourierReconcile(array &$state, array $config, ?callable $transport, int $now): void {
    if ((int)($state['nextAttemptAt'] ?? 0) > $now) return;
    $state['status'] = 'needs_review';
    $state['lastErrorCode'] = 'booking_outcome_unknown';
    $state['nextAttemptAt'] = $now + 300;
    $state['lastReconciliationAt'] = gmdate('c', $now);
    if (isset($state['shipmentId'])) {
        $response = perfectBuyCourierRequest($config, $transport, 'GET', '/shipments?id=' . rawurlencode((string)$state['shipmentId']));
        $shipments = $response['data']['shipments'] ?? null;
        if (($response['status'] ?? 0) === 200 && is_array($shipments) && count($shipments) === 1 &&
            is_array($shipments[0]) && (string)($shipments[0]['id'] ?? '') === (string)$state['shipmentId'] &&
            is_array($state['request'] ?? null) && perfectBuyCourierSameShipment($shipments[0], $state['request'])) {
            perfectBuyCourierRecordShipment($state, $shipments[0], $now);
        }
        return;
    }
    $request = $state['request'] ?? null;
    $intentAt = strtotime($state['intentAt'] ?? '');
    if (!is_array($request) || $intentAt === false) return;
    $matches = perfectBuyCourierFindExisting($request, $intentAt - 300, $config, $transport, $now);
    if ($matches === null) return;
    if (count($matches) === 1 && perfectBuyCourierSameShipment($matches[0], $request)) {
        perfectBuyCourierRecordShipment($state, $matches[0], $now);
    } elseif (count($matches) > 0) {
        $state['lastErrorCode'] = 'existing_shipment_requires_review';
    }
}

function perfectBuyCourierRateCents(mixed $value): ?int {
    if ((!is_int($value) && !is_float($value) && !is_string($value)) || !is_numeric($value)) return null;
    $number = (float)$value;
    if (!is_finite($number) || $number <= 0 || $number > 100000) return null;
    return (int)round($number * 100);
}

function perfectBuyFulfillCourier(array &$order, string $orderPath, array $config, ?callable $transport = null, ?int $now = null): string {
    $now = $now ?? time();
    if (($order['status'] ?? '') !== 'paid' || ($order['paymentMode'] ?? '') !== 'live' ||
        !is_string($order['paymentId'] ?? null) || $order['paymentId'] === '' ||
        !is_string($order['paymentEventId'] ?? null) || $order['paymentEventId'] === '' ||
        !is_string($order['reference'] ?? null) || !preg_match('/^PB-[A-F0-9]{16}$/D', $order['reference']) ||
        !in_array($order['shippingFeeCents'] ?? null, [10000, 11000], true) ||
        !is_int($order['amountCents'] ?? null) || $order['amountCents'] <= $order['shippingFeeCents']) return 'ineligible';
    if (!isset($order['courierBooking']) || !is_array($order['courierBooking'])) $order['courierBooking'] = [];
    $state =& $order['courierBooking'];
    $save = static function () use (&$order, &$state, $orderPath): bool {
        $order['fulfillmentStatus'] = ($state['status'] ?? '') === 'booked' ? 'booked' : 'courier_' . ($state['status'] ?? 'pending_configuration');
        return perfectBuyCourierWrite($orderPath, $order);
    };
    if (($state['status'] ?? '') === 'booked') return 'booked';
    // An existing intent must never be reset by disabling/re-enabling the feature.
    if (isset($state['intentAt'])) {
        perfectBuyCourierReconcile($state, $config, $transport, $now);
        return $save() ? ($state['status'] ?? 'needs_review') : 'persistence_failed';
    }
    $enabledAt = is_string($config['bookings_enabled_after'] ?? null) ? strtotime($config['bookings_enabled_after']) : false;
    $paidAt = is_string($order['paidAt'] ?? null) ? strtotime($order['paidAt']) : false;
    $approved = is_array($config['approved_order_references'] ?? null) && in_array($order['reference'], $config['approved_order_references'], true);
    $sender = perfectBuyCourierContact($config['sender_contact'] ?? null);
    $customer = perfectBuyCourierContact($order['customer'] ?? null);
    $limit = $config['max_booking_cost_cents'] ?? 10000;
    $service = $config['service_level_code'] ?? null;
    $base = rtrim($config['api_base_url'] ?? 'https://api.portal.thecourierguy.co.za', '/');
    if (($config['bookings_enabled'] ?? false) !== true || !is_string($config['api_key'] ?? null) || $config['api_key'] === '' ||
        ($config['account_currency'] ?? '') !== 'ZAR' || !is_int($limit) || $limit < 1 || $limit > 11000 ||
        !is_string($service) || !preg_match('/^[A-Za-z0-9 _-]{1,80}$/D', $service) || $sender === null || $customer === null ||
        !in_array($base, ['https://api.portal.thecourierguy.co.za', 'https://api.portal.thecourierguy.co.za/v2'], true) ||
        (!$approved && ($enabledAt === false || $paidAt === false || $paidAt < $enabledAt))) {
        $state['status'] = 'pending_configuration';
        $state['lastErrorCode'] = 'booking_disabled_or_not_approved';
        return $save() ? 'pending_configuration' : 'persistence_failed';
    }
    if (in_array($state['status'] ?? '', ['needs_review', 'blocked'], true)) return $state['status'];
    if ((int)($state['nextAttemptAt'] ?? 0) > $now) return $state['status'] ?? 'retry';
    // A positive per-SKU allowlist is deliberately used instead of guessing from
    // product names. TCG restricts e.g. perfumes, liquids and jewellery. New or
    // unreviewed SKUs need review; an order/time approval never bypasses this.
    $allowedProducts = $config['approved_product_ids'] ?? [];
    $items = $order['items'] ?? [];
    if (!is_array($allowedProducts) || !is_array($items) || count($items) < 1 || count($items) > 50) {
        $state['status'] = 'blocked'; $state['lastErrorCode'] = 'products_require_carrier_review';
        return $save() ? 'blocked' : 'persistence_failed';
    }
    foreach ($items as $item) {
        if (!is_array($item) || !is_string($item['productId'] ?? null) ||
            !in_array($item['productId'], $allowedProducts, true)) {
            $state['status'] = 'blocked'; $state['lastErrorCode'] = 'products_require_carrier_review';
            return $save() ? 'blocked' : 'persistence_failed';
        }
    }
    $retry = static function (string $code) use (&$state, $now, $save): string {
        $state['status'] = 'retry'; $state['lastErrorCode'] = $code;
        $state['nextAttemptAt'] = $now + 300;
        return $save() ? 'retry' : 'persistence_failed';
    };
    $points = perfectBuyCourierRequest($config, $transport, 'GET', '/pickup-points');
    if (($points['status'] ?? 0) !== 200 || !is_array($points['data']['pickup_points'] ?? null)) return $retry('pickup_points_unavailable');
    $destination = perfectBuyCourierDestination($order, $points['data']['pickup_points']);
    if ($destination === null) {
        $state['status'] = 'blocked'; $state['lastErrorCode'] = 'destination_locker_unavailable';
        return $save() ? 'blocked' : 'persistence_failed';
    }
    $route = [
        'collection_pickup_point_id' => 'CG0000', 'collection_pickup_point_provider' => 'tcg-locker',
        'delivery_pickup_point_id' => $destination['pickupPointId'], 'delivery_pickup_point_provider' => 'tcg-locker',
        'parcels' => [perfectBuyCourierParcel()],
    ];
    $rates = perfectBuyCourierRequest($config, $transport, 'POST', '/rates', $route);
    if (($rates['status'] ?? 0) !== 200 || !is_array($rates['data']['rates'] ?? null)) return $retry('rates_unavailable');
    $currency = $rates['data']['currency'] ?? $config['account_currency'];
    $selected = null;
    foreach ($rates['data']['rates'] as $rate) {
        if (!is_array($rate) || ($rate['service_level']['code'] ?? '') !== $service ||
            ($rate['service_level']['group_code'] ?? '') !== 'L2L' || $service !== 'L2LL - ECO') continue;
        $cents = perfectBuyCourierRateCents($rate['rate'] ?? null);
        // The carrier rate is VAT inclusive. Require the validated account ZAR
        // currency when the quote omits currency; reject any contrary response.
        if ($currency !== 'ZAR' || ($rate['currency'] ?? 'ZAR') !== 'ZAR' || $cents === null || $cents > $limit) continue;
        $id = $rate['service_level']['id'] ?? null;
        if (!is_int($id) || $id < 1) continue;
        if ($selected !== null) { $selected = null; break; }
        $selected = ['serviceId' => $id, 'costCents' => $cents];
    }
    if ($selected === null) {
        $state['status'] = 'blocked'; $state['lastErrorCode'] = 'no_approved_rate_within_limit';
        return $save() ? 'blocked' : 'persistence_failed';
    }
    $request = $route + ['collection_contact' => $sender, 'delivery_contact' => $customer,
        'customer_reference' => $order['reference'], 'customer_reference_name' => 'Perfect Buy order',
        'service_level_id' => $selected['serviceId'], 'mute_notifications' => false];
    // A shop owner may have booked this order manually before automation ran.
    // Check the documented reference in recent shipments before spending funds.
    $existing = perfectBuyCourierFindExisting($request, ($paidAt ?: $now) - 86400, $config, $transport, $now);
    if ($existing === null) return $retry('existing_shipment_lookup_unavailable');
    if (count($existing) > 0) {
        $state = ['status' => 'needs_review', 'intentAt' => gmdate('c', $now), 'attempts' => 0,
            'request' => $request, 'requestHash' => hash('sha256', (string)json_encode($request)),
            'dropoffMode' => 'any_tcg_locker', 'destinationLockerId' => $destination['id'],
            'lastErrorCode' => 'existing_shipment_requires_review'];
        if (count($existing) === 1 && perfectBuyCourierSameShipment($existing[0], $request)) {
            perfectBuyCourierRecordShipment($state, $existing[0], $now);
        }
        return $save() ? $state['status'] : 'persistence_failed';
    }
    $state = ['status' => 'booking', 'intentAt' => gmdate('c', $now), 'attempts' => 1,
        'costCents' => $selected['costCents'], 'currency' => 'ZAR', 'serviceLevelCode' => $service,
        'requestHash' => hash('sha256', (string)json_encode($request)), 'request' => $request,
        'dropoffMode' => 'any_tcg_locker', 'destinationLockerId' => $destination['id']];
    if (!$save()) return 'persistence_failed';
    $response = perfectBuyCourierRequest($config, $transport, 'POST', '/shipments', $request);
    if (($response['status'] ?? 0) !== 200 || !is_array($response['data'] ?? null) ||
        !perfectBuyCourierRecordShipment($state, $response['data'], $now)) {
        $state['status'] = 'needs_review'; $state['lastErrorCode'] = 'booking_outcome_unknown';
        $state['nextAttemptAt'] = $now + 60;
    }
    return $save() ? $state['status'] : 'persistence_failed_after_booking';
}
