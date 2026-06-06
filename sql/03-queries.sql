USE obligatorio;

SELECT * FROM estudiantes;

SELECT * FROM disciplinas;

SELECT * FROM espacios;

SELECT * FROM actividades;

SELECT * FROM inscripciones;

SELECT * FROM asistencias;

# Actividades con mayor cantidad de inscriptos confirmados
SELECT a.nombre, COUNT(i.id) AS cantidad FROM actividades a
JOIN inscripciones i ON a.id = i.id_actividad
JOIN estudiantes e ON i.id_estudiante = e.id
WHERE i.estado = 'confirmada'
GROUP BY a.id
ORDER BY cantidad DESC
LIMIT 5;

# Actividades con cupos disponibles
SELECT a.nombre, COUNT(*) AS cupos_reservados FROM actividades a
JOIN inscripciones i ON a.id = i.id_actividad
GROUP BY a.id, a.nombre, a.cupo_maximo
HAVING a.cupo_maximo > cupos_reservados;

# Cantidad de inscriptos por disciplina deportiva
SELECT * FROM disciplinas d
JOIN inscripciones i ON d.id = i.id_actividad
JOIN actividades a ON i.id_actividad = a.id
GROUP BY d.nombre;

SELECT i.*, a.*, e.* FROM actividades a
JOIN inscripciones i ON a.id = i.id_actividad
JOIN estudiantes e ON i.id_estudiante = e.id
WHERE i.estado = 'confirmada';

