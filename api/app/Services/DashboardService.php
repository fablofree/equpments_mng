<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Equipment;
use App\Repositories\AssignmentRepository;
use App\Repositories\EmployeeRepository;
use App\Repositories\EquipmentRepository;

class DashboardService
{
    private EquipmentRepository  $equipmentRepository;
    private EmployeeRepository   $employeeRepository;
    private AssignmentRepository $assignmentRepository;

    public function __construct()
    {
        $this->equipmentRepository  = new EquipmentRepository();
        $this->employeeRepository   = new EmployeeRepository();
        $this->assignmentRepository = new AssignmentRepository();
    }

    public function getStatistics(): array
    {
        $totalEquipments     = $this->equipmentRepository->count();
        $availableEquipments = $this->equipmentRepository->count(Equipment::ETAT_DISPONIBLE);
        $assignedEquipments  = $this->equipmentRepository->count(Equipment::ETAT_AFFECTE);
        $maintenanceEq       = $this->equipmentRepository->count(Equipment::ETAT_MAINTENANCE);
        $outOfServiceEq      = $this->equipmentRepository->count(Equipment::ETAT_HORS_SERVICE);
        $totalEmployees      = $this->employeeRepository->count();
        $activeAssignments   = $this->assignmentRepository->count(true);

        return [
            'equipements' => [
                'total'        => $totalEquipments,
                'disponibles'  => $availableEquipments,
                'affectes'     => $assignedEquipments,
                'maintenance'  => $maintenanceEq,
                'hors_service' => $outOfServiceEq,
            ],
            'employes' => [
                'total' => $totalEmployees,
            ],
            'affectations' => [
                'actives' => $activeAssignments,
            ],
        ];
    }
}
