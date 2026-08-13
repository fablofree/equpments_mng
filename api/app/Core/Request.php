<?php

declare(strict_types=1);

namespace App\Core;

class Request
{
    private string $method;
    private string $uri;
    private array  $routeParams = [];
    private array  $query       = [];
    private array  $body        = [];
    private array  $headers     = [];
    private ?array $authPayload = null;

    public function __construct()
    {
        $this->method  = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->uri     = $this->parseUri();
        $this->query   = $_GET;
        $this->headers = $this->parseHeaders();
        $this->body    = $this->parseBody();
    }

    private function parseUri(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $pos = strpos($uri, '?');
        if ($pos !== false) {
            $uri = substr($uri, 0, $pos);
        }
        return '/' . trim($uri, '/');
    }

    private function parseHeaders(): array
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name           = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = $_SERVER['CONTENT_TYPE'];
        }
        return $headers;
    }

    private function parseBody(): array
    {
        $contentType = $this->headers['content-type'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $raw  = file_get_contents('php://input');
            $data = json_decode($raw ?: '{}', true);
            return is_array($data) ? $data : [];
        }
        return $_POST;
    }

    // --- Getters ---

    public function getMethod(): string  { return $this->method; }
    public function getUri(): string     { return $this->uri; }
    public function getQuery(): array    { return $this->query; }
    public function getBody(): array     { return $this->body; }
    public function getHeaders(): array  { return $this->headers; }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function header(string $key, ?string $default = null): ?string
    {
        return $this->headers[strtolower($key)] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    // --- Route params ---

    public function setRouteParams(array $params): void
    {
        $this->routeParams = $params;
    }

    public function param(string $key, mixed $default = null): mixed
    {
        return $this->routeParams[$key] ?? $default;
    }

    public function getRouteParams(): array { return $this->routeParams; }

    // --- Auth ---

    public function setAuth(array $payload): void
    {
        $this->authPayload = $payload;
    }

    public function getAuth(): array
    {
        return $this->authPayload ?? [];
    }

    public function getAuthId(): ?int
    {
        return isset($this->authPayload['sub']) ? (int) $this->authPayload['sub'] : null;
    }

    public function getAuthorizationToken(): ?string
    {
        $header = getallheaders()['authorization'] ?? getallheaders()['Authorization'] ?? null;
        if ($header && preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }

    // --- Pagination helpers ---

    public function getPage(): int
    {
        $page = (int) ($this->query['page'] ?? 1);
        return max(1, $page);
    }

    public function getLimit(): int
    {
        $limit = (int) ($this->query['limit'] ?? 10);
        return max(1, min(100, $limit));
    }

    public function getOffset(): int
    {
        return ($this->getPage() - 1) * $this->getLimit();
    }
}
