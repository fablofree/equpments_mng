<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use PDO;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll(int $limit, int $offset): array
    {
        $stmt = $this->db->prepare(
            'SELECT id, nom, prenom, service, telephone, email
             FROM employees ORDER BY nom, prenom LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(): int
    {
        return (int) $this->db->query('SELECT COUNT(*) FROM employees')->fetchColumn();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, nom, prenom, service, telephone, email FROM employees WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM employees WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO employees (nom, prenom, service, telephone, email)
             VALUES (:nom, :prenom, :service, :telephone, :email)'
        );
        $stmt->execute([
            ':nom'       => $data['nom'],
            ':prenom'    => $data['prenom'],
            ':service'   => $data['service'],
            ':telephone' => $data['telephone'],
            ':email'     => $data['email'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        foreach (['nom', 'prenom', 'service', 'telephone', 'email'] as $field) {
            if (isset($data[$field])) {
                $fields[]          = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $stmt = $this->db->prepare('UPDATE employees SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM employees WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function search(string $q, int $limit, int $offset): array
    {
        $like = '%' . $q . '%';
        $stmt = $this->db->prepare(
            'SELECT id, nom, prenom, service, telephone, email FROM employees
             WHERE nom LIKE :q OR prenom LIKE :q OR email LIKE :q OR service LIKE :q
             ORDER BY nom, prenom LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':q',      $like,   PDO::PARAM_STR);
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countSearch(string $q): int
    {
        $like = '%' . $q . '%';
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM employees
             WHERE nom LIKE :q OR prenom LIKE :q OR email LIKE :q OR service LIKE :q'
        );
        $stmt->bindValue(':q', $like);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }
}
