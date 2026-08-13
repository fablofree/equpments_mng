<?php

declare(strict_types=1);

namespace App\Core;

use Throwable;

class ExceptionHandler
{
    public static function register(): void
    {
        set_exception_handler([self::class, 'handleException']);
        set_error_handler([self::class, 'handleError']);
    }

    public static function handleException(Throwable $e): void
    {
        self::log($e);

        $code   = (int) $e->getCode();
        $status = in_array($code, [400, 401, 403, 404, 422, 500], true) ? $code : 500;

        if (APP_DEBUG) {
            Response::error($e->getMessage(), $status, [
                'exception' => get_class($e),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
            ]);
        }

        $message = $status === 500
            ? 'Erreur interne du serveur.'
            : $e->getMessage();

        Response::error($message, $status);
    }

    public static function handleError(int $errno, string $errstr, string $errfile, int $errline): bool
    {
        if (!(error_reporting() & $errno)) {
            return false;
        }
        self::handleException(new \ErrorException($errstr, 500, $errno, $errfile, $errline));
        return true;
    }

    private static function log(Throwable $e): void
    {
        $logDir  = ROOT_PATH . '/storage/logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        $logFile = $logDir . '/app-' . date('Y-m-d') . '.log';
        $line    = sprintf(
            "[%s] %s(%d): %s in %s:%d\n",
            date('Y-m-d H:i:s'),
            get_class($e),
            $e->getCode(),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine()
        );
        file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
    }
}
