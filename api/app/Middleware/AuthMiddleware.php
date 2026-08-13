<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\JwtManager;
use App\Core\Request;
use App\Core\Response;
use RuntimeException;

class AuthMiddleware
{
    public function handle(Request $request): void
    {
        $token = $request->getAuthorizationToken();

        if ($token === null) {
            Response::unauthorized("Token d'authentification manquant. Utilisez le header : Authorization: Bearer <token>");
        }

        try {
            $jwtManager = new JwtManager();
            $payload    = $jwtManager->verify($token);
            $request->setAuth($payload);
        } catch (RuntimeException $e) {
            Response::unauthorized($e->getMessage());
        }
    }
}
