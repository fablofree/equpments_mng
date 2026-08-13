<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

interface AssignmentRepositoryInterface
{
    public function findAll(int $limit, int $offset, bool $activeOnly = false): array;
    public function count(bool $activeOnly = false): int;
    public function findById(int $id): ?array;
    public function findActiveByEquipmentId(int $equipmentId): ?array;
    public function findByEmployeeId(int $employeeId, int $limit, int $offset): array;
    public function countByEmployeeId(int $employeeId): int;
    public function findByEquipmentId(int $equipmentId, int $limit, int $offset): array;
    public function countByEquipmentId(int $equipmentId): int;
    public function create(array $data): int;
    public function return(int $id, string $dateRetour): bool;
}
