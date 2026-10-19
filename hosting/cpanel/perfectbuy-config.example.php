<?php
// Save as /home/houseofcreat/.perfectbuy-config.php, OUTSIDE public_html.
// Enter the secret directly on the hosting account. Never commit a live key.
return [
    'yoco_secret_key' => '',
    'yoco_webhook_secret' => '', // whsec_ value returned once when registering the webhook.
    'yoco_mode' => 'live', // Use 'test' with test keys and a test webhook.
    'site_url' => 'https://perfectbuy.co.za',
];
