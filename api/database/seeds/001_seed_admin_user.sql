-- Seed 001 : Utilisateur administrateur initial
-- ============================================================
-- Mot de passe : Admin@1234
--
-- Ce hash a été généré avec cost=12 et correspond exactement à 'Admin@1234'.
-- Pour régénérer un hash depuis WampServer :
--   C:\wamp64\bin\php\phpX.X.X\php.exe -r "echo password_hash('VotreMotDePasse', PASSWORD_BCRYPT, ['cost'=>12]);"
--
-- Remplacer la valeur ci-dessous par le hash généré ci-dessus si vous changez le mot de passe.
-- ============================================================
-- ÉTAPE PRÉALABLE : générer le hash du mot de passe admin
--   C:\wamp64\bin\php\phpX.X.X\php.exe database\generate_hash.php Admin@1234
-- Puis remplacer VOTRE_HASH_BCRYPT ci-dessous par la valeur retournée.
-- ============================================================

-- Exemple avec le mot de passe 'Admin@1234' (remplacez VOTRE_HASH_BCRYPT) :
INSERT INTO users (nom, prenom, email, mot_de_passe) VALUES (
    'Administrateur',
    'Système',
    'admin@esn.com',
    'VOTRE_HASH_BCRYPT'
    -- Généré via : database/generate_hash.php
    -- CHANGER CE MOT DE PASSE IMMÉDIATEMENT EN PRODUCTION
) ON DUPLICATE KEY UPDATE id = id;
