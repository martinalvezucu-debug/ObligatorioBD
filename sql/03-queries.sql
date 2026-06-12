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
SELECT d.nombre, count(*) as 'Cantidad_inscriptos' FROM disciplinas d
JOIN actividades a ON a.id_disciplina = d.id
JOIN inscripciones i ON i.id_actividad = a.id
GROUP BY d.nombre
ORDER BY Cantidad_inscriptos desc

#Cantidad de inscriptos por carrera o facultad.

SELECT e.facultad, count(*) as 'Cantidad de inscriptos' FROM estudiantes e
JOIN inscripciones i ON i.id_estudiante = e.id
GROUP BY e.facultad

#Porcentaje de ocupación de cada actividad.

SELECT a.nombre, ROUND(COUNT(i.id) * 100.0 /a.cupo_maximo,2) AS porcentaje_ocupacion
FROM actividades a
LEFT JOIN inscripciones i
       ON a.id = i.id_actividad
      AND i.estado = 'confirmada'
GROUP BY a.id,
         a.nombre,
         a.cupo_maximo
ORDER BY porcentaje_ocupacion desc

#Porcentaje de asistencia por actividad.

SELECT a.nombre,ROUND(SUM(CASE WHEN asi.asistencia = TRUE THEN 1 ELSE 0 END) * 100.0 /COUNT(asi.id),2) AS porcentaje_asistencia
FROM actividades a
JOIN inscripciones i ON a.id = i.id_actividad
JOIN asistencias asi ON i.id = asi.id_inscripcion
GROUP BY a.id, a.nombre;

#Estudiantes con tres o más inasistencias registradas.

SELECT e.id, e.nombre, e.apellido, COUNT(*) AS cantidad_inasistencias
FROM estudiantes e
JOIN inscripciones i ON e.id = i.id_estudiante
JOIN asistencias a ON i.id = a.id_inscripcion
WHERE a.asistencia = FALSE
GROUP BY e.id,
         e.nombre,
         e.apellido
HAVING COUNT(*) >= 3;

#Tres consultas adicionales propuestas por el equipo.

