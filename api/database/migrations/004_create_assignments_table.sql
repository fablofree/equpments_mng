-- Migration 004 : Table des affectations
-- ============================================================

CREATE TABLE IF NOT EXISTS assignments (
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employe_id        INT UNSIGNED NOT NULL,
    equipement_id     INT UNSIGNED NOT NULL,
    date_affectation  DATE         NOT NULL,
    date_retour       DATE         NULL DEFAULT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignments_employe
        FOREIGN KEY (employe_id) REFERENCES employees (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_assignments_equipement
        FOREIGN KEY (equipement_id) REFERENCES equipments (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_assignments_employe_id    ON assignments (employe_id);
CREATE INDEX idx_assignments_equipement_id ON assignments (equipement_id);
CREATE INDEX idx_assignments_date_retour   ON assignments (date_retour);

-- Partial unique index: only one active assignment (date_retour IS NULL) per equipment.
-- MySQL does not support partial indexes natively; enforced in application layer (AssignmentService).
-- To enforce at DB level, use a generated column (MySQL 5.7.6+):
ALTER TABLE assignments
    ADD COLUMN is_active TINYINT(1) GENERATED ALWAYS AS (IF(date_retour IS NULL, 1, NULL)) VIRTUAL;

CREATE UNIQUE INDEX uq_one_active_assignment_per_equipment
    ON assignments (equipement_id, is_active);
