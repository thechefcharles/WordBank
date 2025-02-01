<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

'paths' => ['api/*'],
    'allowed_methods' => ['*'],

'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:5173', // Add your frontend URL
    'http://127.0.0.1:5173', // Add this too in case you are using 127.0.0.1
    '*', // Allow all origins (for testing, remove in production)
],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
