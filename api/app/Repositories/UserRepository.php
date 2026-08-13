<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Repositories\Interfaces\UserRepositoryInterface;
use PDO;

class UserRepository implements UserRepositoryInterface
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll(int $limit, int $offset): array
    {
        $stmt = $this->db->prepare(
            'SELECT id, nom, prenom, email FROM users ORDER BY nom, prenom LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(): int
    {
        return (int) $this->db->query('SELECT COUNT(*) FROM users')->fetchColumn();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT id, nom, prenom, email FROM users WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (nom, prenom, email, mot_de_passe) VALUES (:nom, :prenom, :email, :mot_de_passe)'
        );
        $stmt->execute([
            ':nom'          => $data['nom'],
            ':prenom'       => $data['prenom'],
            ':email'        => $data['email'],
            ':mot_de_passe' => $data['mot_de_passe'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        foreach (['nom', 'prenom', 'email'] as $field) {
            if (isset($data[$field])) {
                $fields[]       = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }
        if (isset($data['mot_de_passe'])) {
            $fields[]             = 'mot_de_passe = :mot_de_passe';
            $params[':mot_de_passe'] = $data['mot_de_passe'];
        }

        if (empty($fields)) {
            return false;
        }

        $stmt = $this->db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function search(string $q, int $limit, int $offset): array
    {
        $like = '%' . $q . '%';
        $stmt = $this->db->prepare(
            'SELECT id, nom, prenom, email FROM users
             WHERE nom LIKE :q OR prenom LIKE :q OR email LIKE :q
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
            'SELECT COUNT(*) FROM users WHERE nom LIKE :q OR prenom LIKE :q OR email LIKE :q'
        );
        $stmt->bindValue(':q', $like);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }
}
