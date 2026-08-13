<?php

declare(strict_types=1);

use App\Controllers\AssignmentController;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\EmployeeController;
use App\Controllers\EquipmentController;
use App\Controllers\UserController;
use App\Middleware\AuthMiddleware;

// $router is injected by Application::run()

// ── Authentication (public) ──────────────────────────────────────────────────
$router->post('/api/login', [AuthController::class, 'login']);

// ── Users (protected) ────────────────────────────────────────────────────────
$router->get(   '/api/users',      [UserController::class, 'index'],   [AuthMiddleware::class]);
$router->get(   '/api/users/{id}', [UserController::class, 'show'],    [AuthMiddleware::class]);
$router->post(  '/api/users',      [UserController::class, 'store'],   [AuthMiddleware::class]);
$router->put(   '/api/users/{id}', [UserController::class, 'update'],  [AuthMiddleware::class]);
$router->delete('/api/users/{id}', [UserController::class, 'destroy'], [AuthMiddleware::class]);

// ── Employees (protected) ─────────────────────────────────────────────────────
$router->get(   '/api/employees',      [EmployeeController::class, 'index'],   [AuthMiddleware::class]);
$router->get(   '/api/employees/{id}', [EmployeeController::class, 'show'],    [AuthMiddleware::class]);
$router->post(  '/api/employees',      [EmployeeController::class, 'store'],   [AuthMiddleware::class]);
$router->put(   '/api/employees/{id}', [EmployeeController::class, 'update'],  [AuthMiddleware::class]);
$router->delete('/api/employees/{id}', [EmployeeController::class, 'destroy'], [AuthMiddleware::class]);

// ── Equipments (protected) ─────────────────────────────────────────────────────
$router->get(   '/api/equipments',      [EquipmentController::class, 'index'],   [AuthMiddleware::class]);
$router->get(   '/api/equipments/{id}', [EquipmentController::class, 'show'],    [AuthMiddleware::class]);
$router->post(  '/api/equipments',      [EquipmentController::class, 'store'],   [AuthMiddleware::class]);
$router->put(   '/api/equipments/{id}', [EquipmentController::class, 'update'],  [AuthMiddleware::class]);
$router->delete('/api/equipments/{id}', [EquipmentController::class, 'destroy'], [AuthMiddleware::class]);

// ── Assignments (protected) ──────────────────────────────────────────────────
$router->get( '/api/assignments',              [AssignmentController::class, 'index'],       [AuthMiddleware::class]);
$router->get( '/api/assignments/{id}',         [AssignmentController::class, 'show'],        [AuthMiddleware::class]);
$router->post('/api/assignments',              [AssignmentController::class, 'store'],       [AuthMiddleware::class]);
$router->post('/api/assignments/{id}/return',  [AssignmentController::class, 'return'],      [AuthMiddleware::class]);

// ── Assignments by resource (protected) ──────────────────────────────────────
$router->get('/api/employees/{id}/assignments',  [AssignmentController::class, 'byEmployee'],  [AuthMiddleware::class]);
$router->get('/api/equipments/{id}/assignments', [AssignmentController::class, 'byEquipment'], [AuthMiddleware::class]);

// ── Dashboard (protected) ─────────────────────────────────────────────────────
$router->get('/api/dashboard/statistics', [DashboardController::class, 'statistics'], [AuthMiddleware::class]);
