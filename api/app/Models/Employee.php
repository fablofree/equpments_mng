<?php

declare(strict_types=1);

namespace App\Models;

class Employee
{
    public int    $id;
    public string $nom;
    public string $prenom;
    public string $service;
    public string $telephone;
    public string $email;

    public static function fromArray(array $row): self
    {
        $emp            = new self();
        $emp->id        = (int) $row['id'];
        $emp->nom       = $row['nom'];
        $emp->prenom    = $row['prenom'];
        $emp->service   = $row['service'];
        $emp->telephone = $row['telephone'];
        $emp->email     = $row['email'];
        return $emp;
    }

    public function toArray(): array
    {
        return [
            'id'        => $this->id,
            'nom'       => $this->nom,
            'prenom'    => $this->prenom,
            'service'   => $this->service,
            'telephone' => $this->telephone,
            'email'     => $this->email,
        ];
    }
}
