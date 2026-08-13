<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Equipment;
use App\Repositories\EquipmentRepository;
use RuntimeException;

class EquipmentService
{
    private EquipmentRepository $equipmentRepository;

    public function __construct()
    {
        $this->equipmentRepository = new EquipmentRepository();
    }

    public function getAll(int $page, int $limit, ?string $etat = null): array
    {
        $offset     = ($page - 1) * $limit;
        $equipments = $this->equipmentRepository->findAll($limit, $offset, $etat);
        $total      = $this->equipmentRepository->count($etat);

        return compact('equipments', 'total');
    }

    public function getById(int $id): array
    {
        $equipment = $this->equipmentRepository->findById($id);
        if (!$equipment) {
            throw new RuntimeException("Équipement #$id introuvable.", 404);
        }
        return $equipment;
    }

    public function create(array $data): array
    {
        $existing = $this->equipmentRepository->findByReference($data['reference']);
        if ($existing) {
            throw new RuntimeException("La référence « {$data['reference']} » est déjà utilisée.", 422);
        }

        $data['etat'] = $data['etat'] ?? Equipment::ETAT_DISPONIBLE;
        $id = $this->equipmentRepository->create($data);

        return $this->equipmentRepository->findById($id);
    }

    public function update(int $id, array $data): array
    {
        $equipment = $this->equipmentRepository->findById($id);
        if (!$equipment) {
            throw new RuntimeException("Équipement #$id introuvable.", 404);
        }

        if (isset($data['reference']) && $data['reference'] !== $equipment['reference']) {
            $existing = $this->equipmentRepository->findByReference($data['reference']);
            if ($existing) {
                throw new RuntimeException("La référence « {$data['reference']} » est déjà utilisée.", 422);
            }
        }

        $this->equipmentRepository->update($id, $data);
        return $this->equipmentRepository->findById($id);
    }

    public function delete(int $id): void
    {
        $equipment = $this->equipmentRepository->findById($id);
        if (!$equipment) {
            throw new RuntimeException("Équipement #$id introuvable.", 404);
        }
        if ($equipment['etat'] === Equipment::ETAT_AFFECTE) {
            throw new RuntimeException("Impossible de supprimer un équipement actuellement affecté.", 422);
        }
        $this->equipmentRepository->delete($id);
    }

    public function search(string $q, int $page, int $limit): array
    {
        $offset     = ($page - 1) * $limit;
        $equipments = $this->equipmentRepository->search($q, $limit, $offset);
        $total      = $this->equipmentRepository->countSearch($q);

        return compact('equipments', 'total');
    }
}
