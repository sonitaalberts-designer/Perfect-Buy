<?php
declare(strict_types=1);

// Secrets and the short-lived locker cache live outside every document root.
function perfectBuyCourierConfig(): array {
    $home = getenv('HOME') ?: '/home/houseofcreat';
    $path = $home . '/.perfectbuy-courier.php';
    return is_file($path) ? require $path : [];
}

function perfectBuyCollectionLockers(): array {
    $home = getenv('HOME') ?: '/home/houseofcreat';
    $cache = $home . '/.perfectbuy-lockers-cache.json';
    if (is_file($cache) && filemtime($cache) > time() - 300) {
        $cached = json_decode(file_get_contents($cache), true);
        if (is_array($cached) && count($cached) > 0) return $cached;
    }
    $config = perfectBuyCourierConfig();
    if (empty($config['api_key']) || !function_exists('curl_init')) {
        throw new RuntimeException('Locker selection is temporarily unavailable. Please try again soon.');
    }
    $curl = curl_init('https://api.portal.thecourierguy.co.za/pickup-points');
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $config['api_key'], 'Accept: application/json'],
    ]);
    $body = curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    $data = is_string($body) ? json_decode($body, true) : null;
    if ($status !== 200 || !is_array($data['pickup_points'] ?? null)) {
        throw new RuntimeException("We couldn't load collection lockers. Please try again.");
    }
    $lockers = [];
    foreach ($data['pickup_points'] as $point) {
        if (($point['type'] ?? '') !== 'locker' || ($point['pickup_point_provider'] ?? '') !== 'tcg-locker' ||
            ($point['status'] ?? '') !== 'online' || !empty($point['is_hidden']) ||
            !in_array('V4-L', $point['available_compartment_sizes'] ?? [], true)) continue;
        $lockers[] = [
            'id' => $point['provider_id'] . ':' . $point['pickup_point_id'],
            'name' => $point['name'],
            'address' => $point['address']['entered_address'],
            'city' => $point['address']['city'],
            'hours' => $point['trading_hours'] ?: "Check the locker's opening hours before collecting.",
        ];
    }
    if (!$lockers) throw new RuntimeException('No collection lockers are available. Please try again later.');
    // A failed cache write must not prevent a valid checkout or disclose warnings.
    $oldMask = umask(0077);
    @file_put_contents($cache, json_encode($lockers), LOCK_EX);
    umask($oldMask);
    return $lockers;
}
