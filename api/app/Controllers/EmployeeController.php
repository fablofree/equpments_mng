<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\EmployeeService;

class EmployeeController extends Controller
{
    private EmployeeService $employeeService;

    public function __construct()
    {
        $this->employeeService = new EmployeeService();
    }

    public function index(Request $request): void
    {
        $q = $request->query('q');

        if ($q !== null && $q !== '') {
            $result = $this->employeeService->search($q, $request->getPage(), $request->getLimit());
            Response::paginated(
                $result['employees'],
                $request->getPage(),
                $request->getLimit(),
                $result['total']
            );
        }

        $result = $this->employeeService->getAll($request->getPage(), $request->getLimit());
        Response::paginated(
            $result['employees'],
            $request->getPage(),
            $request->getLimit(),
            $result['total']
        );
    }

    public function show(Request $request): void
    {
        $id       = (int) $request->param('id');
        $employee = $this->employeeService->getById($id);
        Response::success($employee);
    }

    public function store(Request $request): void
    {
        $this->validate($request->getBody(), [
            'nom'       => 'required|max:100',
            'prenom'    => 'required|max:100',
            'service'   => 'required|max:100',
            'telephone' => 'required|max:20',
            'email'     => 'required|email|max:150',
        ]);

        $employee = $this->employeeService->create($request->getBody());
        Response::created($employee);
    }

    public function update(Request $request): void
    {
        $this->validate($request->getBody(), [
            'nom'       => 'max:100',
            'prenom'    => 'max:100',
            'service'   => 'max:100',
            'telephone' => 'max:20',
            'email'     => 'email|max:150',
        ]);

        $id       = (int) $request->param('id');
        $employee = $this->employeeService->update($id, $request->getBody());
        Response::success($employee, 'Employé mis à jour.');
    }

    public function destroy(Request $request): void
    {
        $id = (int) $request->param('id');
        $this->employeeService->delete($id);
        Response::noContent();
    }
}
