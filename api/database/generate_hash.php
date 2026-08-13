<?php
/**
 * Utilitaire : générer un hash bcrypt pour le seed admin.
 *
 * Utilisation depuis WampServer :
 *   C:\wamp64\bin\php\phpX.X.X\php.exe database\generate_hash.php
 *
 * Ou depuis le navigateur en plaçant ce fichier dans public/ temporairement.
 */

$password = $argv[1] ?? 'Admin@1234';
$hash     = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

echo "Mot de passe : $password\n";
echo "Hash bcrypt  : $hash\n";
echo "\n";
echo "Copiez ce hash dans database/seeds/001_seed_admin_user.sql\n";
