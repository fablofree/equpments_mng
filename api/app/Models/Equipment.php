<?php

declare(strict_types=1);

namespace App\Models;

class Equipment
{
    public const ETAT_DISPONIBLE   = 'disponible';
    public const ETAT_AFFECTE      = 'affecte';
    public const ETAT_MAINTENANCE  = 'maintenance';
    public const ETAT_HORS_SERVICE = 'hors_service';

    public const ETATS_VALIDES = [
        self::ETAT_DISPONIBLE,
        self::ETAT_AFFECTE,
        self::ETAT_MAINTENANCE,
        self::ETAT_HORS_SERVICE,
    ];

    public int    $id;
    public string $reference;
    public string $nom;
    public string $categorie;
    public string $marque;
    public string $date_achat;
    public string $etat;

    public static function fromArray(array $row): self
    {
        $eq             = new self();
        $eq->id         = (int) $row['id'];
        $eq->reference  = $row['reference'];
        $eq->nom        = $row['nom'];
        $eq->categorie  = $row['categorie'];
        $eq->marque     = $row['marque'];
        $eq->date_achat = $row['date_achat'];
        $eq->etat       = $row['etat'];
        return $eq;
    }

    public function toArray(): array
    {
        return [
            'id'         => $this->id,
            'reference'  => $this->reference,
            'nom'        => $this->nom,
            'categorie'  => $this->categorie,
            'marque'     => $this->marque,
            'date_achat' => $this->date_achat,
            'etat'       => $this->etat,
        ];
    }
}
