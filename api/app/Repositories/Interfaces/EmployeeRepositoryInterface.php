<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

interface EmployeeRepositoryInterface
{
    public function findAll(int $limit, int $offset): array;
    public function count(): int;
    public function findById(int $id): ?array;
    public function findByEmail(string $email): ?array;
    public function create(array $data): int;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function search(string $q, int $limit, int $offset): array;
    public function countSearch(string $q): int;
}
