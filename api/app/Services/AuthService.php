<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\JwtManager;
use App\Repositories\UserRepository;
use RuntimeException;

class AuthService
{
    private UserRepository $userRepository;
    private JwtManager     $jwtManager;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
        $this->jwtManager     = new JwtManager();
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !password_verify($password, $user['mot_de_passe'])) {
            throw new RuntimeException('Identifiants incorrects.', 401);
        }

        $token = $this->jwtManager->generate([
            'sub'    => $user['id'],
            'email'  => $user['email'],
            'nom'    => $user['nom'],
            'prenom' => $user['prenom'],
        ]);

        return [
            'token' => $token,
            'user'  => [
                'id'     => (int) $user['id'],
                'nom'    => $user['nom'],
                'prenom' => $user['prenom'],
                'email'  => $user['email'],
            ],
        ];
    }
}
