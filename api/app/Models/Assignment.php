<?php

declare(strict_types=1);

namespace App\Models;

class Assignment
{
    public int     $id;
    public int     $employe_id;
    public int     $equipement_id;
    public string  $date_affectation;
    public ?string $date_retour;

    // Joined fields (populated when fetching with relations)
    public ?string $employe_nom     = null;
    public ?string $employe_prenom  = null;
    public ?string $equipement_nom  = null;
    public ?string $equipement_ref  = null;

    public static function fromArray(array $row): self
    {
        $a                   = new self();
        $a->id               = (int) $row['id'];
        $a->employe_id       = (int) $row['employe_id'];
        $a->equipement_id    = (int) $row['equipement_id'];
        $a->date_affectation = $row['date_affectation'];
        $a->date_retour      = $row['date_retour'] ?? null;

        // Optional joined fields
        $a->employe_nom    = $row['employe_nom']    ?? null;
        $a->employe_prenom = $row['employe_prenom'] ?? null;
        $a->equipement_nom = $row['equipement_nom'] ?? null;
        $a->equipement_ref = $row['equipement_ref'] ?? null;

        return $a;
    }

    public function toArray(): array
    {
        $data = [
            'id'               => $this->id,
            'employe_id'       => $this->employe_id,
            'equipement_id'    => $this->equipement_id,
            'date_affectation' => $this->date_affectation,
            'date_retour'      => $this->date_retour,
            'active'           => $this->date_retour === null,
        ];

        if ($this->employe_nom !== null) {
            $data['employe'] = [
                'nom'    => $this->employe_nom,
                'prenom' => $this->employe_prenom,
            ];
        }
        if ($this->equipement_nom !== null) {
            $data['equipement'] = [
                'nom'       => $this->equipement_nom,
                'reference' => $this->equipement_ref,
            ];
        }

        return $data;
    }
}
