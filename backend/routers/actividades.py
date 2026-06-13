from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Actividad

router = APIRouter(
    prefix="/actividades",
    tags=["Actividades"]
)


@router.get("", summary="Listar actividades")
def get_actividades():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            a.id,
            a.nombre,
            d.nombre AS disciplina,
            e.nombre AS espacio,
            a.cupo_maximo,
            a.dia,
            TIME_FORMAT(a.horario, '%H:%i') AS horario,
            a.estado
        FROM actividades a
        JOIN disciplinas d ON a.id_disciplina = d.id
        JOIN espacios e ON a.id_espacio = e.id
    """)

    actividades = cursor.fetchall()

    cursor.close()
    cnx.close()

    return actividades


@router.get("/{id_actividad}", summary="Obtener actividad por ID")
def obtener_actividad(id_actividad: int):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            a.id,
            a.nombre,
            d.nombre AS disciplina,
            e.nombre AS espacio,
            a.cupo_maximo,
            a.dia,
            TIME_FORMAT(a.horario, '%H:%i') AS horario,
            a.estado
        FROM actividades a
        JOIN disciplinas d ON a.id_disciplina = d.id
        JOIN espacios e ON a.id_espacio = e.id
        WHERE a.id = %s
    """, (id_actividad,))

    actividad = cursor.fetchone()

    cursor.close()
    cnx.close()

    if actividad is None:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    return actividad


@router.post("", summary="Crear actividad")
def crear_actividad(actividad: Actividad):
    cnx = connect_db()
    cursor = cnx.cursor()

    sql = """
        INSERT INTO actividades (nombre, id_disciplina, id_espacio, cupo_maximo, dia, horario, estado)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    valores = (
        actividad.nombre,
        actividad.id_disciplina,
        actividad.id_espacio,
        actividad.cupo_maximo,
        actividad.dia,
        actividad.horario,
        actividad.estado
    )

    cursor.execute(sql, valores)
    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Actividad creada"}


@router.put("/{id_actividad}", summary="Actualizar actividad")
def actualizar_actividad(id_actividad: int, actividad: Actividad):
    cnx = connect_db()
    cursor = cnx.cursor()

    sql = """
        UPDATE actividades
        SET nombre = %s,
            id_disciplina = %s,
            id_espacio = %s,
            cupo_maximo = %s,
            dia = %s,
            horario = %s,
            estado = %s
        WHERE id = %s
    """

    valores = (
        actividad.nombre,
        actividad.id_disciplina,
        actividad.id_espacio,
        actividad.cupo_maximo,
        actividad.dia,
        actividad.horario,
        actividad.estado,
        id_actividad
    )

    cursor.execute(sql, valores)
    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    cursor.close()
    cnx.close()

    return {"mensaje": "Actividad actualizada"}


@router.delete("/{id_actividad}", summary="Eliminar actividad")
def borrar_actividad(id_actividad: int):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "DELETE FROM actividades WHERE id = %s",
        (id_actividad,)
    )

    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Actividad no encontrada")

    cursor.close()
    cnx.close()

    return {"mensaje": "Actividad eliminada"}
