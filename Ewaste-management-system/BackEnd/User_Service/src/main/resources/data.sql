INSERT INTO roles (role_name) SELECT 'User' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'User');
INSERT INTO roles (role_name) SELECT 'Admin' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Admin');
INSERT INTO roles (role_name) SELECT 'Collector' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Collector');
INSERT INTO roles (role_name) SELECT 'Recycler' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'Recycler');
