-- Migration 003 : Table des équipements
-- ============================================================

CREATE TABLE IF NOT EXISTS equipments (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reference   VARCHAR(100) NOT NULL,
    nom         VARCHAR(150) NOT NULL,
    categorie   VARCHAR(100) NOT NULL,
    marque      VARCHAR(100) NOT NULL,
    date_achat  DATE         NOT NULL,
    etat        ENUM('disponible','affecte','maintenance','hors_service')
                             NOT NULL DEFAULT 'disponible',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_equipments_reference UNIQUE (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_equipments_reference ON equipments (reference);
CREATE INDEX idx_equipments_etat      ON equipments (etat);
CREATE INDEX idx_equipments_categorie ON equipments (categorie);
