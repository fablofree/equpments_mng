<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Core\Response;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    private DashboardService $dashboardService;

    public function __construct()
    {
        $this->dashboardService = new DashboardService();
    }

    public function statistics(Request $request): void
    {
        $stats = $this->dashboardService->getStatistics();
        Response::success($stats, 'Statistiques récupérées.');
    }
}
