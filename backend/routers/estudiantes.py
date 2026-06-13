from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Estudiante

router = APIRouter(
    prefix="/estudiantes",
    tags=["Estudiantes"]
)


@router.get("", summary="Listar estudiantes")
def get_estudiantes():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute("SELECT * FROM estudiantes")
    estudiantes = cursor.fetchall()

    cursor.close()
    cnx.close()

    return estudiantes

@router.get("/{id_estudiante}", summary="Obtener estudiante por documento")
def obtener_estudiante(id_estudiante: str):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM estudiantes WHERE id = %s",
        (id_estudiante,)
    )

    estudiante = cursor.fetchone()

    cursor.close()
    cnx.close()

    if estudiante is None:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    return estudiante


@router.post("", summary="Crear estudiante")
def crear_estudiante(estudiante: Estudiante):
    cnx = connect_db()
    cursor = cnx.cursor()

    sql = """
        INSERT INTO estudiantes (id, nombre, apellido, email, carrera, facultad)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    valores = (
        estudiante.id,
        estudiante.nombre,
        estudiante.apellido,
        estudiante.email,
        estudiante.carrera,
        estudiante.facultad
    )

    cursor.execute(sql, valores)
    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Estudiante creado"}


@router.put("/{id_estudiante}", summary="Actualizar estudiante")
def actualizar_estudiante(id_estudiante: str, estudiante: Estudiante):
    cnx = connect_db()
    cursor = cnx.cursor()

    sql = """
        UPDATE estudiantes
        SET nombre = %s, apellido = %s, email = %s, carrera = %s, facultad = %s
        WHERE id = %s
    """

    valores = (
        estudiante.nombre,
        estudiante.apellido,
        estudiante.email,
        estudiante.carrera,
        estudiante.facultad,
        id_estudiante
    )

    cursor.execute(sql, valores)
    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    cursor.close()
    cnx.close()

    return { "mensaje": "Estudiante actualizado" }


@router.delete("/{id_estudiante}", summary="Eliminar estudiante")
def borrar_estudiante(id_estudiante: str):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "DELETE FROM estudiantes WHERE id = %s",
        (id_estudiante,)
    )
    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    cursor.close()
    cnx.close()

    return {"mensaje": "Estudiante eliminado"}

