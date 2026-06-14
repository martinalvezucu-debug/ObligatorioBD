from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Asistencia

router = APIRouter(
    prefix="/asistencias",
    tags=["Asistencias"]
)

@router.post("", summary="registrar asistencia")
def registrar_asistencia(asistencia: Asistencia):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        "SELECT estado FROM inscripciones WHERE id = %s",
        (asistencia.id_inscripcion,)
    )
    inscripcion = cursor.fetchone()

    if inscripcion is None:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Inscripcion no encontrada")

    if inscripcion["estado"] != "confirmada":
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=400, detail="La inscripcion no esta confirmada")

    cursor.execute(
        "SELECT * FROM asistencias WHERE id_inscripcion = %s and fecha = %s",
        (asistencia.id_inscripcion, asistencia.fecha)
    )
    posible_asistencia = cursor.fetchone()

    if posible_asistencia is not None:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=400, detail="Ya existe un registro de asistencia para este usuario en esta actividad")

    cursor = cnx.cursor()
    cursor.execute(
        """
        INSERT INTO asistencias (id_inscripcion, fecha, asistencia)
        VALUES (%s, %s, %s)
        """,
        (
            asistencia.id_inscripcion,
            asistencia.fecha,
            asistencia.asistencia
        )
    )
    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Asistencia registrada"}


