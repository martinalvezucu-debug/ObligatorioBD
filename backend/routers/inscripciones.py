from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Inscripcion

router = APIRouter(
    prefix="/inscripciones",
    tags=["Inscripciones"]
)

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




