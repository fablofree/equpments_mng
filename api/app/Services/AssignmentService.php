<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Equipment;
use App\Repositories\AssignmentRepository;
use App\Repositories\EmployeeRepository;
use App\Repositories\EquipmentRepository;
use RuntimeException;

class AssignmentService
{
    private AssignmentRepository $assignmentRepository;
    private EmployeeRepository   $employeeRepository;
    private EquipmentRepository  $equipmentRepository;

    public function __construct()
    {
        $this->assignmentRepository = new AssignmentRepository();
        $this->employeeRepository   = new EmployeeRepository();
        $this->equipmentRepository  = new EquipmentRepository();
    }

    public function getAll(int $page, int $limit, bool $activeOnly = false): array
    {
        $offset      = ($page - 1) * $limit;
        $assignments = $this->assignmentRepository->findAll($limit, $offset, $activeOnly);
        $total       = $this->assignmentRepository->count($activeOnly);

        return compact('assignments', 'total');
    }

    public function getById(int $id): array
    {
        $assignment = $this->assignmentRepository->findById($id);
        if (!$assignment) {
            throw new RuntimeException("Affectation #$id introuvable.", 404);
        }
        return $assignment;
    }

    public function assign(array $data): array
    {
        // Verify employee exists
        $employee = $this->employeeRepository->findById((int) $data['employe_id']);
        if (!$employee) {
            throw new RuntimeException("Employé #{$data['employe_id']} introuvable.", 404);
        }

        // Verify equipment exists
        $equipment = $this->equipmentRepository->findById((int) $data['equipement_id']);
        if (!$equipment) {
            throw new RuntimeException("Équipement #{$data['equipement_id']} introuvable.", 404);
        }

        // Cannot assign if not available
        if ($equipment['etat'] !== Equipment::ETAT_DISPONIBLE) {
            throw new RuntimeException(
                "L'équipement est actuellement « {$equipment['etat']} » et ne peut pas être affecté.",
                422
            );
        }

        // Double-check no active assignment exists (concurrency guard)
        $active = $this->assignmentRepository->findActiveByEquipmentId((int) $data['equipement_id']);
        if ($active) {
            throw new RuntimeException("Cet équipement est déjà affecté.", 422);
        }

        $data['date_affectation'] = $data['date_affectation'] ?? date('Y-m-d');
        $id = $this->assignmentRepository->create($data);

        // Update equipment status
        $this->equipmentRepository->updateEtat((int) $data['equipement_id'], Equipment::ETAT_AFFECTE);

        return $this->assignmentRepository->findById($id);
    }

    public function returnEquipment(int $assignmentId, ?string $dateRetour = null): array
    {
        $assignment = $this->assignmentRepository->findById($assignmentId);
        if (!$assignment) {
            throw new RuntimeException("Affectation #$assignmentId introuvable.", 404);
        }
        if ($assignment['date_retour'] !== null) {
            throw new RuntimeException("L'équipement a déjà été retourné pour cette affectation.", 422);
        }

        $dateRetour = $dateRetour ?? date('Y-m-d');

        if ($dateRetour < $assignment['date_affectation']) {
            throw new RuntimeException(
                "La date de retour ne peut pas être antérieure à la date d'affectation.",
                422
            );
        }

        $this->assignmentRepository->return($assignmentId, $dateRetour);

        // Restore equipment to available
        $this->equipmentRepository->updateEtat((int) $assignment['equipement_id'], Equipment::ETAT_DISPONIBLE);

        return $this->assignmentRepository->findById($assignmentId);
    }

    public function getByEmployee(int $employeeId, int $page, int $limit): array
    {
        if (!$this->employeeRepository->findById($employeeId)) {
            throw new RuntimeException("Employé #$employeeId introuvable.", 404);
        }

        $offset      = ($page - 1) * $limit;
        $assignments = $this->assignmentRepository->findByEmployeeId($employeeId, $limit, $offset);
        $total       = $this->assignmentRepository->countByEmployeeId($employeeId);

        return compact('assignments', 'total');
    }

    public function getByEquipment(int $equipmentId, int $page, int $limit): array
    {
        if (!$this->equipmentRepository->findById($equipmentId)) {
            throw new RuntimeException("Équipement #$equipmentId introuvable.", 404);
        }

        $offset      = ($page - 1) * $limit;
        $assignments = $this->assignmentRepository->findByEquipmentId($equipmentId, $limit, $offset);
        $total       = $this->assignmentRepository->countByEquipmentId($equipmentId);

        return compact('assignments', 'total');
    }
}
