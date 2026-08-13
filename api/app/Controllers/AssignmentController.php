<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\AssignmentService;

class AssignmentController extends Controller
{
    private AssignmentService $assignmentService;

    public function __construct()
    {
        $this->assignmentService = new AssignmentService();
    }

    public function index(Request $request): void
    {
        $activeOnly = filter_var($request->query('active'), FILTER_VALIDATE_BOOLEAN);
        $result     = $this->assignmentService->getAll($request->getPage(), $request->getLimit(), $activeOnly);

        Response::paginated(
            $result['assignments'],
            $request->getPage(),
            $request->getLimit(),
            $result['total']
        );
    }

    public function show(Request $request): void
    {
        $id         = (int) $request->param('id');
        $assignment = $this->assignmentService->getById($id);
        Response::success($assignment);
    }

    public function store(Request $request): void
    {
        $this->validate($request->getBody(), [
            'employe_id'       => 'required|integer',
            'equipement_id'    => 'required|integer',
            'date_affectation' => 'date',
        ]);

        $assignment = $this->assignmentService->assign($request->getBody());
        Response::created($assignment, 'Équipement affecté avec succès.');
    }

    public function return(Request $request): void
    {
        $id          = (int) $request->param('id');
        $dateRetour  = $request->input('date_retour');

        if ($dateRetour !== null && $dateRetour !== '') {
            $this->validate(['date_retour' => $dateRetour], ['date_retour' => 'date']);
        }

        $assignment = $this->assignmentService->returnEquipment($id, $dateRetour ?: null);
        Response::success($assignment, 'Équipement retourné avec succès.');
    }

    public function byEmployee(Request $request): void
    {
        $employeeId = (int) $request->param('id');
        $result     = $this->assignmentService->getByEmployee(
            $employeeId,
            $request->getPage(),
            $request->getLimit()
        );

        Response::paginated(
            $result['assignments'],
            $request->getPage(),
            $request->getLimit(),
            $result['total']
        );
    }

    public function byEquipment(Request $request): void
    {
        $equipmentId = (int) $request->param('id');
        $result      = $this->assignmentService->getByEquipment(
            $equipmentId,
            $request->getPage(),
            $request->getLimit()
        );

        Response::paginated(
            $result['assignments'],
            $request->getPage(),
            $request->getLimit(),
            $result['total']
        );
    }
}
