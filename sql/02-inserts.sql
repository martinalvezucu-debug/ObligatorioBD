USE obligatorio;

INSERT INTO estudiantes (id, nombre, apellido, email, carrera, facultad) VALUES
('49876543', 'Lucia', 'Fernandez', 'lucia.fernandez@ucu.edu.uy', 'Ingenieria en Sistemas', 'Ingenieria y Tecnologias'),
('48765432', 'Mateo', 'Rodriguez', 'mateo.rodriguez@ucu.edu.uy', 'Licenciatura en Negocios Digitales', 'Ciencias Empresariales'),
('47654321', 'Valentina', 'Sosa', 'valentina.sosa@ucu.edu.uy', 'Medicina', 'Ciencias de la Salud'),
('46543210', 'Agustin', 'Pereira', 'agustin.pereira@ucu.edu.uy', 'Abogacia', 'Derecho'),
('45432109', 'Camila', 'Mendez', 'camila.mendez@ucu.edu.uy', 'Arquitectura', 'Ingenieria y Tecnologias'),
('44321098', 'Martin', 'Suarez', 'martin.suarez@ucu.edu.uy', 'Ingenieria Electrica', 'Ingenieria y Tecnologias'),
('43210987', 'Sofia', 'Gomez', 'sofia.gomez@ucu.edu.uy', 'Psicologia', 'Ciencias Humanas'),
('42109876', 'Joaquin', 'Torres', 'joaquin.torres@ucu.edu.uy', 'Contador Publico', 'Ciencias Empresariales'),
('41098765', 'Martina', 'Acosta', 'martina.acosta@ucu.edu.uy', 'Fisioterapia', 'Ciencias de la Salud'),
('40987654', 'Nicolas', 'Silva', 'nicolas.silva@ucu.edu.uy', 'Ingenieria Civil', 'Ingenieria y Tecnologias'),
('39876543', 'Florencia', 'Cabrera', 'florencia.cabrera@ucu.edu.uy', 'Comunicacion', 'Ciencias Humanas'),
('38765432', 'Benjamin', 'Lemos', 'benjamin.lemos@ucu.edu.uy', 'Analista en Informatica', 'Ingenieria y Tecnologias');

INSERT INTO disciplinas (nombre) VALUES
('Futbol'),
('Basquetbol'),
('Atletismo'),
('Voleibol'),
('Yoga'),
('Funcional'),
('Gimnasio');

INSERT INTO espacios (nombre) VALUES
('Cancha 1'),
('Cancha 2'),
('Pista atletica'),
('Sala multiuso'),
('Gimnasio UCU'),
('Salon bienestar');

INSERT INTO actividades (nombre, id_disciplina, id_espacio, cupo_maximo, dia, horario, estado) VALUES
('Futbol recreativo mixto', (SELECT id FROM disciplinas WHERE nombre = 'Futbol'), (SELECT id FROM espacios WHERE nombre = 'Cancha 1'), 3, 'Lunes', '19:00:00', 'abierta'),
('Basquetbol formativo', (SELECT id FROM disciplinas WHERE nombre = 'Basquetbol'), (SELECT id FROM espacios WHERE nombre = 'Cancha 2'), 2, 'Miercoles', '18:30:00', 'cerrada'),
('Atletismo inicial', (SELECT id FROM disciplinas WHERE nombre = 'Atletismo'), (SELECT id FROM espacios WHERE nombre = 'Pista atletica'), 10, 'Sabado', '09:00:00', 'finalizada'),
('Voleibol principiante', (SELECT id FROM disciplinas WHERE nombre = 'Voleibol'), (SELECT id FROM espacios WHERE nombre = 'Sala multiuso'), 8, 'Martes', '20:00:00', 'abierta'),
('Yoga al mediodia', (SELECT id FROM disciplinas WHERE nombre = 'Yoga'), (SELECT id FROM espacios WHERE nombre = 'Salon bienestar'), 6, 'Jueves', '12:30:00', 'abierta'),
('Funcional turno manana', (SELECT id FROM disciplinas WHERE nombre = 'Funcional'), (SELECT id FROM espacios WHERE nombre = 'Gimnasio UCU'), 2, 'Viernes', '08:00:00', 'cerrada'),
('Gimnasio libre asistido', (SELECT id FROM disciplinas WHERE nombre = 'Gimnasio'), (SELECT id FROM espacios WHERE nombre = 'Gimnasio UCU'), 12, 'Lunes', '07:00:00', 'cancelada'),
('Yoga restaurativo', (SELECT id FROM disciplinas WHERE nombre = 'Yoga'), (SELECT id FROM espacios WHERE nombre = 'Salon bienestar'), 5, 'Lunes', '18:00:00', 'finalizada');

INSERT INTO inscripciones (id_estudiante, id_actividad, fecha_inscripcion, estado) VALUES
('49876543', (SELECT id FROM actividades WHERE nombre = 'Futbol recreativo mixto'), '2026-05-10', 'confirmada'),
('48765432', (SELECT id FROM actividades WHERE nombre = 'Futbol recreativo mixto'), '2026-05-11', 'confirmada'),
('47654321', (SELECT id FROM actividades WHERE nombre = 'Futbol recreativo mixto'), '2026-05-12', 'confirmada'),
('46543210', (SELECT id FROM actividades WHERE nombre = 'Futbol recreativo mixto'), '2026-05-13', 'espera'),
('45432109', (SELECT id FROM actividades WHERE nombre = 'Basquetbol formativo'), '2026-05-09', 'confirmada'),
('44321098', (SELECT id FROM actividades WHERE nombre = 'Basquetbol formativo'), '2026-05-10', 'confirmada'),
('43210987', (SELECT id FROM actividades WHERE nombre = 'Basquetbol formativo'), '2026-05-11', 'espera'),
('42109876', (SELECT id FROM actividades WHERE nombre = 'Atletismo inicial'), '2026-04-20', 'confirmada'),
('41098765', (SELECT id FROM actividades WHERE nombre = 'Atletismo inicial'), '2026-04-21', 'confirmada'),
('40987654', (SELECT id FROM actividades WHERE nombre = 'Atletismo inicial'), '2026-04-22', 'confirmada'),
('39876543', (SELECT id FROM actividades WHERE nombre = 'Voleibol principiante'), '2026-05-15', 'confirmada'),
('38765432', (SELECT id FROM actividades WHERE nombre = 'Voleibol principiante'), '2026-05-16', 'confirmada'),
('49876543', (SELECT id FROM actividades WHERE nombre = 'Yoga al mediodia'), '2026-05-08', 'confirmada'),
('43210987', (SELECT id FROM actividades WHERE nombre = 'Yoga al mediodia'), '2026-05-09', 'confirmada'),
('42109876', (SELECT id FROM actividades WHERE nombre = 'Funcional turno manana'), '2026-05-07', 'confirmada'),
('45432109', (SELECT id FROM actividades WHERE nombre = 'Funcional turno manana'), '2026-05-08', 'confirmada'),
('47654321', (SELECT id FROM actividades WHERE nombre = 'Funcional turno manana'), '2026-05-09', 'espera'),
('41098765', (SELECT id FROM actividades WHERE nombre = 'Yoga restaurativo'), '2026-04-18', 'confirmada'),
('39876543', (SELECT id FROM actividades WHERE nombre = 'Yoga restaurativo'), '2026-04-19', 'confirmada'),
('38765432', (SELECT id FROM actividades WHERE nombre = 'Yoga restaurativo'), '2026-04-20', 'confirmada');

INSERT INTO asistencias (id_inscripcion, fecha, asistencia) VALUES
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '42109876' AND a.nombre = 'Atletismo inicial'), '2026-05-03', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '41098765' AND a.nombre = 'Atletismo inicial'), '2026-05-03', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '40987654' AND a.nombre = 'Atletismo inicial'), '2026-05-03', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '42109876' AND a.nombre = 'Atletismo inicial'), '2026-05-10', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '41098765' AND a.nombre = 'Atletismo inicial'), '2026-05-10', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '40987654' AND a.nombre = 'Atletismo inicial'), '2026-05-10', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '41098765' AND a.nombre = 'Yoga restaurativo'), '2026-05-05', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '39876543' AND a.nombre = 'Yoga restaurativo'), '2026-05-05', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '38765432' AND a.nombre = 'Yoga restaurativo'), '2026-05-05', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '41098765' AND a.nombre = 'Yoga restaurativo'), '2026-05-12', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '39876543' AND a.nombre = 'Yoga restaurativo'), '2026-05-12', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '38765432' AND a.nombre = 'Yoga restaurativo'), '2026-05-12', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '41098765' AND a.nombre = 'Yoga restaurativo'), '2026-05-19', FALSE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '39876543' AND a.nombre = 'Yoga restaurativo'), '2026-05-19', TRUE),
((SELECT i.id FROM inscripciones i INNER JOIN actividades a ON a.id = i.id_actividad WHERE i.id_estudiante = '38765432' AND a.nombre = 'Yoga restaurativo'), '2026-05-19', TRUE);
