<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\UserService;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct()
    {
        $this->userService = new UserService();
    }

    public function index(Request $request): void
    {
        $q = $request->query('q');

        if ($q !== null && $q !== '') {
            $result = $this->userService->search($q, $request->getPage(), $request->getLimit());
            Response::paginated(
                $result['users'],
                $request->getPage(),
                $request->getLimit(),
                $result['total']
            );
        }

        $result = $this->userService->getAll($request->getPage(), $request->getLimit());
        Response::paginated(
            $result['users'],
            $request->getPage(),
            $request->getLimit(),
            $result['total']
        );
    }

    public function show(Request $request): void
    {
        $id   = (int) $request->param('id');
        $user = $this->userService->getById($id);
        Response::success($user);
    }

    public function store(Request $request): void
    {
        $this->validate($request->getBody(), [
            'nom'      => 'required|max:100',
            'prenom'   => 'required|max:100',
            'email'    => 'required|email|max:150',
            'password' => 'required|min:8|max:100',
        ]);

        $user = $this->userService->create($request->getBody());
        Response::created($user);
    }

    public function update(Request $request): void
    {
        $this->validate($request->getBody(), [
            'nom'      => 'max:100',
            'prenom'   => 'max:100',
            'email'    => 'email|max:150',
            'password' => 'min:8|max:100',
        ]);

        $id   = (int) $request->param('id');
        $user = $this->userService->update($id, $request->getBody());
        Response::success($user, 'Utilisateur mis à jour.');
    }

    public function destroy(Request $request): void
    {
        $id = (int) $request->param('id');
        $this->userService->delete($id);
        Response::noContent();
    }
}
