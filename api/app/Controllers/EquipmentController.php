<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Models\Equipment;
use App\Services\EquipmentService;

class EquipmentController extends Controller
{
    private EquipmentService $equipmentService;

    public function __construct()
    {
        $this->equipmentService = new EquipmentService();
    }

    public function index(Request $request): void
    {
        $q    = $request->query('q');
        $etat = $request->query('etat');

        // Validate etat filter if provided
        if ($etat !== null && !in_array($etat, Equipment::ETATS_VALIDES, true)) {
            Response::error(
                'Filtre etat invalide. Valeurs autorisées : ' . implode(', ', Equipment::ETATS_VALIDES),
                400
            );
        }

        if ($q !== null && $q !== '') {
            $result = $this->equipmentService->search($q, $request->getPage(), $request->getLimit());
            Response::paginated(
                $result['equipments'],
                $request->getPage(),
                $request->getLimit(),
                $result['total']
            );
        }

        $result = $this->equipmentService->getAll($request->getPage(), $request->getLimit(), $etat ?: null);
        Response::paginated(
            $result['equipments'],
            $request->getPage(),
            $request->getLimit(),
            $result['total']
        );
    }

    public function show(Request $request): void
    {
        $id        = (int) $request->param('id');
        $equipment = $this->equipmentService->getById($id);
        Response::success($equipment);
    }

    public function store(Request $request): void
    {
        $this->validate($request->getBody(), [
            'reference'  => 'required|max:100',
            'nom'        => 'required|max:150',
            'categorie'  => 'required|max:100',
            'marque'     => 'required|max:100',
            'date_achat' => 'required|date',
            'etat'       => 'in:' . implode(',', Equipment::ETATS_VALIDES),
        ]);

        $equipment = $this->equipmentService->create($request->getBody());
        Response::created($equipment);
    }

    public function update(Request $request): void
    {
        $this->validate($request->getBody(), [
            'reference'  => 'max:100',
            'nom'        => 'max:150',
            'categorie'  => 'max:100',
            'marque'     => 'max:100',
            'date_achat' => 'date',
            'etat'       => 'in:' . implode(',', Equipment::ETATS_VALIDES),
        ]);

        $id        = (int) $request->param('id');
        $equipment = $this->equipmentService->update($id, $request->getBody());
        Response::success($equipment, 'Équipement mis à jour.');
    }

    public function destroy(Request $request): void
    {
        $id = (int) $request->param('id');
        $this->equipmentService->delete($id);
        Response::noContent();
    }
}
