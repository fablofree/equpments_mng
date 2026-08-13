<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

interface EquipmentRepositoryInterface
{
    public function findAll(int $limit, int $offset, ?string $etat = null): array;
    public function count(?string $etat = null): int;
    public function findById(int $id): ?array;
    public function findByReference(string $reference): ?array;
    public function create(array $data): int;
    public function update(int $id, array $data): bool;
    public function updateEtat(int $id, string $etat): bool;
    public function delete(int $id): bool;
    public function search(string $q, int $limit, int $offset): array;
    public function countSearch(string $q): int;
}
