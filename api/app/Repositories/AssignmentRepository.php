<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use App\Repositories\Interfaces\AssignmentRepositoryInterface;
use PDO;

class AssignmentRepository implements AssignmentRepositoryInterface
{
    private PDO $db;

    private const SELECT_WITH_JOINS =
        'SELECT a.id, a.employe_id, a.equipement_id, a.date_affectation, a.date_retour,
                e.nom AS employe_nom, e.prenom AS employe_prenom,
                eq.nom AS equipement_nom, eq.reference AS equipement_ref
         FROM assignments a
         JOIN employees  e  ON a.employe_id    = e.id
         JOIN equipments eq ON a.equipement_id = eq.id';

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findAll(int $limit, int $offset, bool $activeOnly = false): array
    {
        $where = $activeOnly ? ' WHERE a.date_retour IS NULL' : '';
        $stmt  = $this->db->prepare(
            self::SELECT_WITH_JOINS . $where .
            ' ORDER BY a.date_affectation DESC LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':limit',  $limit,  PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(bool $activeOnly = false): int
    {
        $where = $activeOnly ? ' WHERE date_retour IS NULL' : '';
        return (int) $this->db->query('SELECT COUNT(*) FROM assignments' . $where)->fetchColumn();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(self::SELECT_WITH_JOINS . ' WHERE a.id = :id');
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findActiveByEquipmentId(int $equipmentId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM assignments WHERE equipement_id = :eid AND date_retour IS NULL LIMIT 1'
        );
        $stmt->execute([':eid' => $equipmentId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByEmployeeId(int $employeeId, int $limit, int $offset): array
    {
        $stmt = $this->db->prepare(
            self::SELECT_WITH_JOINS . ' WHERE a.employe_id = :eid
             ORDER BY a.date_affectation DESC LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':eid',    $employeeId, PDO::PARAM_INT);
        $stmt->bindValue(':limit',  $limit,      PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset,     PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countByEmployeeId(int $employeeId): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM assignments WHERE employe_id = :eid');
        $stmt->execute([':eid' => $employeeId]);
        return (int) $stmt->fetchColumn();
    }

    public function findByEquipmentId(int $equipmentId, int $limit, int $offset): array
    {
        $stmt = $this->db->prepare(
            self::SELECT_WITH_JOINS . ' WHERE a.equipement_id = :eqid
             ORDER BY a.date_affectation DESC LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':eqid',   $equipmentId, PDO::PARAM_INT);
        $stmt->bindValue(':limit',  $limit,        PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset,       PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function countByEquipmentId(int $equipmentId): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM assignments WHERE equipement_id = :eqid');
        $stmt->execute([':eqid' => $equipmentId]);
        return (int) $stmt->fetchColumn();
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO assignments (employe_id, equipement_id, date_affectation)
             VALUES (:employe_id, :equipement_id, :date_affectation)'
        );
        $stmt->execute([
            ':employe_id'       => $data['employe_id'],
            ':equipement_id'    => $data['equipement_id'],
            ':date_affectation' => $data['date_affectation'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function return(int $id, string $dateRetour): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE assignments SET date_retour = :date_retour WHERE id = :id AND date_retour IS NULL'
        );
        $stmt->execute([':date_retour' => $dateRetour, ':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
