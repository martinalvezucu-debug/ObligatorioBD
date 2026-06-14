from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Inscripcion

router = APIRouter(
    prefix="/inscripciones",
    tags=["Inscripciones"]
)

@router.get("", summary="Listar inscripciones")
def listar_inscripciones():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            i.id,
            i.id_estudiante,
            CONCAT(e.nombre, ' ', e.apellido) AS estudiante,
            i.id_actividad,
            a.nombre AS actividad,
            i.fecha_inscripcion,
            i.estado
        FROM inscripciones i
        JOIN estudiantes e ON e.id = i.id_estudiante
        JOIN actividades a ON a.id = i.id_actividad
        ORDER BY i.fecha_inscripcion DESC, i.id DESC
        """
    )
    inscripciones = cursor.fetchall()

    cursor.close()
    cnx.close()

    return inscripciones


@router.post("", summary="Crear inscripción")
def crear_inscripcion(inscripcion: Inscripcion):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM estudiantes WHERE id = %s",
        (inscripcion.id_estudiante,)
    )
    estudiante = cursor.fetchone()

    if estudiante is None:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    cursor.execute(
        "SELECT estado, cupo_maximo FROM actividades WHERE id = %s",
        (inscripcion.id_actividad,)
    )
    actividad = cursor.fetchone()

    if actividad is None:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    if actividad["estado"] != "abierta":
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=400, detail="La actividad no esta abierta")

    cursor.execute(
        """
        SELECT COUNT(*) AS cantidad
        FROM inscripciones
        WHERE id_actividad = %s AND estado = 'confirmada'
        """,
        (inscripcion.id_actividad,)
    )
    cantidad = cursor.fetchone()["cantidad"]

    if cantidad < actividad["cupo_maximo"]:
        estado = "confirmada"
    else:
        estado = "espera"

    cursor.execute(
        "SELECT * FROM inscripciones WHERE id_actividad = %s and id_estudiante = %s",
        (inscripcion.id_actividad, inscripcion.id_estudiante)
    )
    posible_inscripcion = cursor.fetchone()

    if posible_inscripcion is not None:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=400,detail="Ya existe un registro de inscripción para este usuario")

    cursor = cnx.cursor()
    cursor.execute(
        """
        INSERT INTO inscripciones (id_estudiante, id_actividad, fecha_inscripcion, estado)
        VALUES (%s, %s, CURDATE(), %s)
        """,
        (
            inscripcion.id_estudiante,
            inscripcion.id_actividad,
            estado
        )
    )
    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Inscripción creada", "estado": estado}


@router.put("/{id_inscripcion}/cancelar", summary="Cancelar inscripción")
def cancelar_inscripcion(id_inscripcion: int):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        "SELECT estado FROM inscripciones WHERE id = %s",
        (id_inscripcion,)
    )
    inscripcion = cursor.fetchone()

    if inscripcion is None:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Inscripcion no encontrada")

    if inscripcion["estado"] == "cancelada":
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=400, detail="La inscripcion ya esta cancelada")

    cursor = cnx.cursor()
    cursor.execute(
        "UPDATE inscripciones SET estado = 'cancelada' WHERE id = %s",
        (id_inscripcion,)
    )
    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Inscripcion cancelada"}



