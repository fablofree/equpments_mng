<?php

declare(strict_types=1);

namespace App\Core;

class Response
{
    public static function success(mixed $data = null, string $message = 'Opération effectuée avec succès', int $status = 200): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    public static function created(mixed $data = null, string $message = 'Ressource créée avec succès'): void
    {
        self::success($data, $message, 201);
    }

    public static function noContent(): void
    {
        http_response_code(204);
        header('Content-Type: application/json; charset=UTF-8');
        exit;
    }

    public static function paginated(
        array  $data,
        int    $page,
        int    $limit,
        int    $total,
        string $message = 'Opération effectuée avec succès'
    ): void {
        $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 0;
        self::json([
            'success'    => true,
            'message'    => $message,
            'data'       => $data,
            'pagination' => [
                'page'       => $page,
                'limit'      => $limit,
                'total'      => $total,
                'totalPages' => $totalPages,
            ],
        ], 200);
    }

    public static function error(string $message, int $status = 400, array $extras = []): void
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];
        if (!empty($extras)) {
            $payload = array_merge($payload, $extras);
        }
        self::json($payload, $status);
    }

    public static function validationError(array $errors, string $message = 'Erreur de validation des données.'): void
    {
        self::json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], 422);
    }

    public static function unauthorized(string $message = 'Non authentifié.'): void
    {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Accès interdit.'): void
    {
        self::error($message, 403);
    }

    public static function notFound(string $message = 'Ressource introuvable.'): void
    {
        self::error($message, 404);
    }

    public static function serverError(string $message = 'Erreur interne du serveur.'): void
    {
        self::error($message, 500);
    }

    private static function json(array $payload, int $status): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
