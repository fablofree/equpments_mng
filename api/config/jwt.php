<?php

declare(strict_types=1);

return [
    'secret'     => $_ENV['JWT_SECRET']     ?? 'change_this_secret_key_min_32_chars!!',
    'expiration' => (int) ($_ENV['JWT_EXPIRATION'] ?? 86400),
    'algorithm'  => 'HS256',
];
