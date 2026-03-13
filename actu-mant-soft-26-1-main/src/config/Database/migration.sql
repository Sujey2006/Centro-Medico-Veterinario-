CREATE TABLE Owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    phone VARCHAR(10),
    email VARCHAR(50)
);

CREATE TABLE Pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    species VARCHAR(20),
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Owners(id)
);

CREATE TABLE Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    reason VARCHAR(1000),
    pet_id INT NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES Pets(id)
);

-- Migración de datos (Rex y Luna)
-- Dueño 
INSERT INTO Owners (name, phone, email)
VALUES ('Pablo Henao', '3106445502', 'juanvalencia0126@email.com');

-- Mascotas 
INSERT INTO Pets (name, species, owner_id)
VALUES ('Rex', 'Perro', 1),
       ('Luna', 'Gato', 1);
