<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Repositories\Interfaces\EquipmentRepositoryInterface;
use PDO;

class EquipmentRepository implements EquipmentRepositoryInterface
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll(int $limit, int $offset, ?string $etat = null): array
    {
        if ($etat !== null) {
            $stmt = $this->db->prepare(
                'SELECT id, reference, nom, categorie, marque, date_achat, etat
                 FROM equipments WHERE etat = :etat
                 ORDER BY nom LIMIT :limit OFFSET :offset'
            );
            $stmt->bindValue(':etat',   $etat,   PDO::PARAM_STR);
            $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        } else {
            $stmt = $this->db->prepare(
                'SELECT id, reference, nom, categorie, marque, date_achat, etat
                 FROM equipments ORDER BY nom LIMIT :limit OFFSET :offset'
            );
            $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        }
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(?string $etat = null): int
    {
        if ($etat !== null) {
            $stmt = $this->db->prepare('SELECT COUNT(*) FROM equipments WHERE etat = :etat');
            $stmt->execute([':etat' => $etat]);
            return (int) $stmt->fetchColumn();
        }
        return (int) $this->db->query('SELECT COUNT(*) FROM equipments')->fetchColumn();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, reference, nom, categorie, marque, date_achat, etat FROM equipments WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByReference(string $reference): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM equipments WHERE reference = :reference');
        $stmt->execute([':reference' => $reference]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO equipments (reference, nom, categorie, marque, date_achat, etat)
             VALUES (:reference, :nom, :categorie, :marque, :date_achat, :etat)'
        );
        $stmt->execute([
            ':reference'  => $data['reference'],
            ':nom'        => $data['nom'],
            ':categorie'  => $data['categorie'],
            ':marque'     => $data['marque'],
            ':date_achat' => $data['date_achat'],
            ':etat'       => $data['etat'] ?? 'disponible',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        foreach (['reference', 'nom', 'categorie', 'marque', 'date_achat', 'etat'] as $field) {
            if (isset($data[$field])) {
                $fields[]          = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $stmt = $this->db->prepare('UPDATE equipments SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function updateEtat(int $id, string $etat): bool
    {
        $stmt = $this->db->prepare('UPDATE equipments SET etat = :etat WHERE id = :id');
        $stmt->execute([':etat' => $etat, ':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM equipments WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function search(string $q, int $limit, int $offset): array
    {
        $like = '%' . $q . '%';
        $stmt = $this->db->prepare(
            'SELECT id, reference, nom, categorie, marque, date_achat, etat FROM equipments
             WHERE nom LIKE :q OR reference LIKE :q OR marque LIKE :q OR categorie LIKE :q
             ORDER BY nom LIMIT :limit OFFSET :offset'
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
            'SELECT COUNT(*) FROM equipments
             WHERE nom LIKE :q OR reference LIKE :q OR marque LIKE :q OR categorie LIKE :q'
        );
        $stmt->bindValue(':q', $like);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }
}
