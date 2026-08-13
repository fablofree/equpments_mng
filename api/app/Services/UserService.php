<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;
use RuntimeException;

class UserService
{
    private UserRepository $userRepository;

    public function __construct()
    {
        $this->userRepository = new UserRepository();
    }

    public function getAll(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $users  = $this->userRepository->findAll($limit, $offset);
        $total  = $this->userRepository->count();

        return compact('users', 'total');
    }

    public function getById(int $id): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            throw new RuntimeException("Utilisateur #$id introuvable.", 404);
        }
        return $user;
    }

    public function create(array $data): array
    {
        $existing = $this->userRepository->findByEmail($data['email']);
        if ($existing) {
            throw new RuntimeException("L'adresse e-mail est déjà utilisée.", 422);
        }

        $data['mot_de_passe'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $id = $this->userRepository->create($data);

        return $this->userRepository->findById($id);
    }

    public function update(int $id, array $data): array
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            throw new RuntimeException("Utilisateur #$id introuvable.", 404);
        }

        if (isset($data['email']) && $data['email'] !== $user['email']) {
            $existing = $this->userRepository->findByEmail($data['email']);
            if ($existing) {
                throw new RuntimeException("L'adresse e-mail est déjà utilisée.", 422);
            }
        }

        if (isset($data['password'])) {
            $data['mot_de_passe'] = password_hash($data['password'], PASSWORD_BCRYPT);
            unset($data['password']);
        }

        $this->userRepository->update($id, $data);

        return $this->userRepository->findById($id);
    }

    public function delete(int $id): void
    {
        $user = $this->userRepository->findById($id);
        if (!$user) {
            throw new RuntimeException("Utilisateur #$id introuvable.", 404);
        }
        $this->userRepository->delete($id);
    }

    public function search(string $q, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $users  = $this->userRepository->search($q, $limit, $offset);
        $total  = $this->userRepository->countSearch($q);

        return compact('users', 'total');
    }
}
