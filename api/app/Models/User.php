<?php

declare(strict_types=1);

namespace App\Models;

class User
{
    public int    $id;
    public string $nom;
    public string $prenom;
    public string $email;

    public static function fromArray(array $row): self
    {
        $user         = new self();
        $user->id     = (int) $row['id'];
        $user->nom    = $row['nom'];
        $user->prenom = $row['prenom'];
        $user->email  = $row['email'];
        return $user;
    }

    public function toArray(): array
    {
        return [
            'id'     => $this->id,
            'nom'    => $this->nom,
            'prenom' => $this->prenom,
            'email'  => $this->email,
        ];
    }
}
