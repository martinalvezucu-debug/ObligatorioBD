DROP DATABASE IF EXISTS obligatorio;

CREATE DATABASE obligatorio DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;

USE obligatorio;

CREATE TABLE estudiantes (
    id VARCHAR(15) PRIMARY KEY, # `id` es el documento del estudiante
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(75) NOT NULL UNIQUE,
    carrera VARCHAR(100) NOT NULL,
    facultad VARCHAR(50) NOT NULL,

    CHECK (TRIM(id) <> ''),
    CHECK (TRIM(nombre) <> ''),
    CHECK (TRIM(apellido) <> ''),
    CHECK (TRIM(email) <> ''),
    CHECK (TRIM(carrera) <> ''),
    CHECK (TRIM(facultad) <> '')
);

CREATE TABLE disciplinas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,

    CHECK (TRIM(nombre) <> '')
);

CREATE TABLE espacios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,

    CHECK (TRIM(nombre) <> '')
);

CREATE TABLE actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    id_disciplina INT NOT NULL,
    id_espacio INT NOT NULL,
    cupo_maximo INT NOT NULL,
    dia VARCHAR(50) NOT NULL,
    horario TIME NOT NULL,
    estado VARCHAR(15) NOT NULL,

    CHECK (TRIM(nombre) <> ''),
    CHECK (TRIM(dia) <> ''),
    CHECK (cupo_maximo > 0),
    CHECK (estado IN ('abierta', 'cerrada', 'finalizada', 'cancelada')),

    CONSTRAINT fk_disciplina_actividad
    FOREIGN KEY (id_disciplina)
    REFERENCES disciplinas(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_espacio_actividad
    FOREIGN KEY (id_espacio)
    REFERENCES espacios(id)
    ON DELETE CASCADE
);

CREATE TABLE inscripciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_estudiante VARCHAR(15) NOT NULL,
    id_actividad INT NOT NULL,
    fecha_inscripcion DATE NOT NULL,
    estado VARCHAR(25) NOT NULL,

    CHECK (estado IN ('confirmada', 'espera', 'cancelada')),
    UNIQUE (id_estudiante, id_actividad),

    CONSTRAINT fk_estudiante_inscripcion
    FOREIGN KEY (id_estudiante)
    REFERENCES estudiantes(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_actividad_inscripcion
    FOREIGN KEY (id_actividad)
    REFERENCES actividades(id)
    ON DELETE CASCADE
);

CREATE TABLE asistencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_inscripcion INT NOT NULL,
    fecha DATE NOT NULL,
    asistencia BOOL NOT NULL,

    UNIQUE (id_inscripcion, fecha),

    CONSTRAINT fk_inscripcion_asistencia
    FOREIGN KEY (id_inscripcion)
    REFERENCES inscripciones(id)
    ON DELETE CASCADE
);
