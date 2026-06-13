from fastapi import APIRouter
from backend.database import connect_db

router = APIRouter(
    prefix="/reportes",
    tags=["Reportes"]
)

@router.get("/actividades-mas-inscriptos", summary="Actividades con mayor cantidad de inscriptos confirmados")
def actividades_mas_inscriptos():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            a.nombre,
            COUNT(i.id) AS cantidad
        FROM actividades a
        JOIN inscripciones i ON a.id = i.id_actividad
        WHERE i.estado = 'confirmada'
        GROUP BY a.id, a.nombre
        ORDER BY cantidad DESC
        LIMIT 5
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/actividades-con-cupos", summary="Actividades con cupos disponibles")
def actividades_con_cupos():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            a.nombre,
            a.cupo_maximo,
            COUNT(i.id) AS confirmados,
            a.cupo_maximo - COUNT(i.id) AS cupos_disponibles
        FROM actividades a
        LEFT JOIN inscripciones i
            ON a.id = i.id_actividad
            AND i.estado = 'confirmada'
        GROUP BY a.id, a.nombre, a.cupo_maximo
        HAVING cupos_disponibles > 0
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/inscriptos-por-disciplina", summary="Cantidad de inscriptos confirmados por disciplina")
def inscriptos_por_disciplina():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            d.nombre,
            COUNT(i.id) AS cantidad_inscriptos
        FROM disciplinas d
        JOIN actividades a ON a.id_disciplina = d.id
        JOIN inscripciones i ON i.id_actividad = a.id
        WHERE i.estado = 'confirmada'
        GROUP BY d.id, d.nombre
        ORDER BY cantidad_inscriptos DESC
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/inscriptos-por-facultad", summary="Cantidad de inscriptos confirmados por facultad")
def inscriptos_por_facultad():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            e.facultad,
            COUNT(i.id) AS cantidad_inscriptos
        FROM estudiantes e
        JOIN inscripciones i ON i.id_estudiante = e.id
        WHERE i.estado = 'confirmada'
        GROUP BY e.facultad
        ORDER BY cantidad_inscriptos DESC
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/ocupacion-actividades", summary="Porcentaje de ocupacion de cada actividad")
def ocupacion_actividades():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            a.nombre,
            ROUND(COUNT(i.id) * 100.0 / a.cupo_maximo, 2) AS porcentaje_ocupacion
        FROM actividades a
        LEFT JOIN inscripciones i
            ON a.id = i.id_actividad
            AND i.estado = 'confirmada'
        GROUP BY a.id, a.nombre, a.cupo_maximo
        ORDER BY porcentaje_ocupacion DESC
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/asistencia-por-actividad", summary="Porcentaje de asistencia por actividad")
def asistencia_por_actividad():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            a.nombre,
            ROUND(
                SUM(CASE WHEN asi.asistencia = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(asi.id),
                2
            ) AS porcentaje_asistencia
        FROM actividades a
        JOIN inscripciones i ON a.id = i.id_actividad
        JOIN asistencias asi ON i.id = asi.id_inscripcion
        GROUP BY a.id, a.nombre
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/estudiantes-con-inasistencias", summary="Estudiantes con tres o mas inasistencias registradas")
def estudiantes_con_inasistencias():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            COUNT(*) AS cantidad_inasistencias
        FROM estudiantes e
        JOIN inscripciones i ON e.id = i.id_estudiante
        JOIN asistencias a ON i.id = a.id_inscripcion
        WHERE a.asistencia = FALSE
        GROUP BY e.id, e.nombre, e.apellido
        HAVING COUNT(*) >= 3
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/estudiantes-confirmados-por-actividad", summary="Listado de estudiantes confirmados con actividad")
def estudiantes_confirmados_por_actividad():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            e.nombre,
            e.apellido,
            a.nombre AS actividad
        FROM inscripciones i
        JOIN estudiantes e ON i.id_estudiante = e.id
        JOIN actividades a ON i.id_actividad = a.id
        WHERE i.estado = 'confirmada'
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/actividades-sin-inscriptos", summary="Actividades sin inscriptos")
def actividades_sin_inscriptos():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            a.nombre
        FROM actividades a
        LEFT JOIN inscripciones i ON a.id = i.id_actividad
        WHERE i.id IS NULL
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos


@router.get("/estudiantes-con-mayor-asistencia", summary="Estudiantes con mayor asistencia")
def estudiantes_con_mayor_asistencia():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            e.id,
            e.nombre,
            e.apellido,
            ROUND(
                SUM(CASE WHEN a.asistencia = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id),
                2
            ) AS porcentaje_asistencia
        FROM estudiantes e
        JOIN inscripciones i ON e.id = i.id_estudiante
        JOIN asistencias a ON i.id = a.id_inscripcion
        GROUP BY e.id, e.nombre, e.apellido
        ORDER BY porcentaje_asistencia DESC
        LIMIT 5
        """
    )

    datos = cursor.fetchall()

    cursor.close()
    cnx.close()

    return datos



