<?php

declare(strict_types=1);

namespace App\Core;

use RuntimeException;

class JwtManager
{
    private string $secret;
    private int $expiration;

    public function __construct()
    {
        $config = require ROOT_PATH . '/config/jwt.php';
        $this->secret     = $config['secret'];
        $this->expiration = $config['expiration'];
    }

    public function generate(array $payload): string
    {
        $header  = $this->base64urlEncode((string) json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = array_merge($payload, [
            'iat' => time(),
            'exp' => time() + $this->expiration,
        ]);
        $payloadEncoded = $this->base64urlEncode((string) json_encode($payload));
        $signature      = $this->sign("$header.$payloadEncoded");

        return "$header.$payloadEncoded.$signature";
    }

    public function verify(string $token): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new RuntimeException('Format du token invalide.', 401);
        }

        [$header, $payload, $signature] = $parts;

        $expectedSignature = $this->sign("$header.$payload");
        if (!hash_equals($expectedSignature, $signature)) {
            throw new RuntimeException('Signature du token invalide.', 401);
        }

        $data = json_decode($this->base64urlDecode($payload), true);
        if (!is_array($data)) {
            throw new RuntimeException('Contenu du token invalide.', 401);
        }

        if (isset($data['exp']) && $data['exp'] < time()) {
            throw new RuntimeException('Le token a expiré.', 401);
        }

        return $data;
    }

    private function sign(string $data): string
    {
        return $this->base64urlEncode(
            hash_hmac('sha256', $data, $this->secret, true)
        );
    }

    private function base64urlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64urlDecode(string $data): string
    {
        $padding = strlen($data) % 4;
        if ($padding !== 0) {
            $data .= str_repeat('=', 4 - $padding);
        }
        return (string) base64_decode(strtr($data, '-_', '+/'));
    }
}
