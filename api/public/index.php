<?php

declare(strict_types=1);

define('ROOT_PATH', dirname(__DIR__));

require_once ROOT_PATH . '/config/bootstrap.php';

use App\Core\Application;
use App\Core\ExceptionHandler;

ExceptionHandler::register();

$app = new Application();
$app->run();
