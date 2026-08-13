<?php

declare(strict_types=1);

namespace App\Core;

use App\Middleware\CorsMiddleware;

class Application
{
    private Router $router;

    public function __construct()
    {
        $this->router = new Router();
    }

    public function run(): void
    {
        $request = new Request();

        // Always handle CORS first (before any auth checks)
        (new CorsMiddleware())->handle($request);

        // Register all routes (receives $router by reference)
        $router = $this->router;
        require ROOT_PATH . '/routes/api.php';

        // Dispatch the request
        $this->router->dispatch($request);
    }
}
