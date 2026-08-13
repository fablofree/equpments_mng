<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\EmployeeRepository;
use RuntimeException;

class EmployeeService
{
    private EmployeeRepository $employeeRepository;

    public function __construct()
    {
        $this->employeeRepository = new EmployeeRepository();
    }

    public function getAll(int $page, int $limit): array
    {
        $offset    = ($page - 1) * $limit;
        $employees = $this->employeeRepository->findAll($limit, $offset);
        $total     = $this->employeeRepository->count();

        return compact('employees', 'total');
    }

    public function getById(int $id): array
    {
        $employee = $this->employeeRepository->findById($id);
        if (!$employee) {
            throw new RuntimeException("Employé #$id introuvable.", 404);
        }
        return $employee;
    }

    public function create(array $data): array
    {
        $existing = $this->employeeRepository->findByEmail($data['email']);
        if ($existing) {
            throw new RuntimeException("L'adresse e-mail est déjà utilisée par un autre employé.", 422);
        }

        $id = $this->employeeRepository->create($data);
        return $this->employeeRepository->findById($id);
    }

    public function update(int $id, array $data): array
    {
        $employee = $this->employeeRepository->findById($id);
        if (!$employee) {
            throw new RuntimeException("Employé #$id introuvable.", 404);
        }

        if (isset($data['email']) && $data['email'] !== $employee['email']) {
            $existing = $this->employeeRepository->findByEmail($data['email']);
            if ($existing) {
                throw new RuntimeException("L'adresse e-mail est déjà utilisée par un autre employé.", 422);
            }
        }

        $this->employeeRepository->update($id, $data);
        return $this->employeeRepository->findById($id);
    }

    public function delete(int $id): void
    {
        $employee = $this->employeeRepository->findById($id);
        if (!$employee) {
            throw new RuntimeException("Employé #$id introuvable.", 404);
        }
        $this->employeeRepository->delete($id);
    }

    public function search(string $q, int $page, int $limit): array
    {
        $offset    = ($page - 1) * $limit;
        $employees = $this->employeeRepository->search($q, $limit, $offset);
        $total     = $this->employeeRepository->countSearch($q);

        return compact('employees', 'total');
    }
}
