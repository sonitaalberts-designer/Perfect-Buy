<?php
// Save privately as /home/houseofcreat/.perfectbuy-courier.php, permission 0600.
// Never place credentials in public_html, browser code or Git.
return [
    'api_key' => '',
    'api_base_url' => 'https://api.portal.thecourierguy.co.za',
    'shipping_method' => 'locker_to_locker',
    'sender_locker_id' => '7:RVM00186', // River Square Mall, Three Rivers.
    // Checkout locker lookup does not enable paid shipment creation.
    // Enable only after the private worker, sender notification setting and
    // carrier product acceptance have been checked. Keep this example off.
    'bookings_enabled' => false,
    'bookings_enabled_after' => '', // ISO 8601 activation timestamp; excludes older paid orders.
    'account_currency' => 'ZAR',
    'max_booking_cost_cents' => 11000, // R110 VAT-inclusive ceiling; never a browser-supplied amount.
    'service_level_code' => 'L2LL - ECO',
    'sender_contact' => [
        'name' => 'Perfect Buy',
        'email' => 'orders@perfect-buy.co.za',
        'mobile_number' => '+27714632853',
    ],
    // Only enter catalog IDs reviewed for carrier acceptance. Perfumes,
    // liquids, jewellery and unreviewed products must not be approved by guesswork.
    'approved_product_ids' => [],
    // Optional specific historic paid orders, reviewed before adding. This
    // bypasses only the activation date, never product/rate/payment checks.
    'approved_order_references' => [],
];
