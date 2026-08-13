-- Migration 002 : Table des employés
-- ============================================================

CREATE TABLE IF NOT EXISTS employees (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    prenom      VARCHAR(100) NOT NULL,
    service     VARCHAR(100) NOT NULL,
    telephone   VARCHAR(20)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_employees_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_employees_nom    ON employees (nom);
CREATE INDEX idx_employees_email  ON employees (email);
CREATE INDEX idx_employees_service ON employees (service);
