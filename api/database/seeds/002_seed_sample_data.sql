-- Seed 002 : Données de démonstration (optionnel)
-- ============================================================

-- Employés exemples
INSERT INTO employees (nom, prenom, service, telephone, email) VALUES
('Dupont',  'Jean',    'Développement',       '0612345678', 'jean.dupont@esn.com'),
('Martin',  'Sophie',  'Infrastructure',      '0623456789', 'sophie.martin@esn.com'),
('Bernard', 'Lucas',   'Support',             '0634567890', 'lucas.bernard@esn.com'),
('Durand',  'Camille', 'Ressources Humaines', '0645678901', 'camille.durand@esn.com');

-- Équipements exemples
INSERT INTO equipments (reference, nom, categorie, marque, date_achat, etat) VALUES
('PC-001', 'Laptop Dell XPS 15',       'Ordinateur portable', 'Dell',   '2023-01-15', 'disponible'),
('PC-002', 'Laptop Lenovo ThinkPad T14','Ordinateur portable', 'Lenovo', '2023-03-10', 'disponible'),
('IMP-001','Imprimante HP LaserJet',   'Imprimante',          'HP',     '2022-06-20', 'disponible'),
('ECR-001','Écran Samsung 27"',        'Écran',               'Samsung','2023-05-05', 'disponible'),
('TEL-001','Téléphone IP Cisco 7945',  'Téléphone',           'Cisco',  '2021-11-30', 'disponible'),
('PC-003', 'Laptop HP EliteBook 840',  'Ordinateur portable', 'HP',     '2022-09-14', 'maintenance');
