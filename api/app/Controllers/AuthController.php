<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\AuthService;

class AuthController extends Controller
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login(Request $request): void
    {
        $this->validate($request->getBody(), [
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        $data = $this->authService->login(
            (string) $request->input('email'),
            (string) $request->input('password')
        );

        Response::success($data, 'Connexion réussie.');
    }
}
