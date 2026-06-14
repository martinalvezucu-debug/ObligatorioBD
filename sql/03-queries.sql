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
WHERE i.estado = 'confirmada'
GROUP BY a.id, a.nombre
ORDER BY cantidad DESC
LIMIT 5;

# Actividades con cupos disponibles
SELECT a.nombre,
       a.cupo_maximo,
       COUNT(i.id) AS confirmados,
       a.cupo_maximo - COUNT(i.id) AS cupos_disponibles
FROM actividades a
LEFT JOIN inscripciones i ON a.id = i.id_actividad AND i.estado = 'confirmada'
GROUP BY a.id, a.nombre, a.cupo_maximo
HAVING cupos_disponibles > 0;

# Cantidad de inscriptos por disciplina deportiva
SELECT d.nombre, count(i.id) as cantidad_inscriptos
FROM disciplinas d
JOIN actividades a ON a.id_disciplina = d.id
JOIN inscripciones i ON i.id_actividad = a.id
WHERE i.estado = 'confirmada'
GROUP BY d.id, d.nombre
ORDER BY Cantidad_inscriptos DESC;

#Cantidad de inscriptos por carrera o facultad.
SELECT e.facultad, count(i.id) as cantidad_inscriptos
FROM estudiantes e
JOIN inscripciones i ON i.id_estudiante = e.id
WHERE i.estado = 'confirmada'
GROUP BY e.facultad
ORDER BY cantidad_inscriptos DESC;

#Porcentaje de ocupación de cada actividad.
SELECT a.nombre, ROUND(COUNT(i.id) * 100.0 /a.cupo_maximo,2) AS porcentaje_ocupacion
FROM actividades a
LEFT JOIN inscripciones i
       ON a.id = i.id_actividad
      AND i.estado = 'confirmada'
GROUP BY a.id,
         a.nombre,
         a.cupo_maximo
ORDER BY porcentaje_ocupacion desc;

#Porcentaje de asistencia por actividad.
SELECT a.nombre,
       ROUND(
           SUM(CASE WHEN asi.asistencia = TRUE THEN 1 ELSE 0 END) * 100.0 /COUNT(asi.id),
           2
       ) AS porcentaje_asistencia
FROM actividades a
JOIN inscripciones i ON a.id = i.id_actividad
JOIN asistencias asi ON i.id = asi.id_inscripcion
GROUP BY a.id, a.nombre;

# Estudiantes con tres o más inasistencias registradas.
SELECT e.id, e.nombre, e.apellido, COUNT(*) AS cantidad_inasistencias
FROM estudiantes e
JOIN inscripciones i ON e.id = i.id_estudiante
JOIN asistencias a ON i.id = a.id_inscripcion
WHERE a.asistencia = FALSE
GROUP BY e.id,
         e.nombre,
         e.apellido
HAVING COUNT(*) >= 3;

# Tres consultas adicionales propuestas por el equipo.

# Listado de estudiantes confirmados con actividad
SELECT e.nombre, e.apellido,a.nombre AS actividad
FROM inscripciones i
JOIN estudiantes e
    ON i.id_estudiante = e.id
JOIN actividades a
    ON i.id_actividad = a.id
WHERE i.estado = 'confirmada';

# Actividades sin inscriptos
SELECT a.nombre
FROM actividades a
LEFT JOIN inscripciones i
    ON a.id = i.id_actividad
WHERE i.id IS NULL;

# Estudiantes con mayor asistencia
SELECT e.id, e.nombre,e.apellido,ROUND(SUM(CASE WHEN a.asistencia = TRUE THEN 1 ELSE 0 END)* 100.0 /COUNT(a.id),2) AS porcentaje_asistencia
FROM estudiantes e
JOIN inscripciones i ON e.id = i.id_estudiante
JOIN asistencias a ON i.id = a.id_inscripcion
GROUP BY e.id,e.nombre,e.apellido
ORDER BY porcentaje_asistencia DESC
LIMIT 5;
