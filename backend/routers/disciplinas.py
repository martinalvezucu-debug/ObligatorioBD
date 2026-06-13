from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Disciplina

router = APIRouter(
    prefix="/disciplinas",
    tags=["Disciplinas"]
)


@router.get("", summary="Listar disciplinas")
def get_disciplinas():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute("SELECT * FROM disciplinas")
    disciplinas = cursor.fetchall()

    cursor.close()
    cnx.close()

    return disciplinas

@router.get("/{id_disciplina}",summary="Obtener disciplina por ID")
def obtener_disciplina(id_disciplina: int):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM disciplinas WHERE id = %s",
        (id_disciplina,)
    )

    disciplina = cursor.fetchone()

    cursor.close()
    cnx.close()

    if disciplina is None:
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")

    return disciplina

@router.post("", summary="Crear disciplina")
def crear_disciplina(disciplina: Disciplina):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "INSERT INTO disciplinas (nombre) VALUES (%s)",
        (disciplina.nombre,)
    )
    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Disciplina creada"}

@router.put("/{id_disciplina}",summary="Actualizar disciplina")
def actualizar_disciplina(id_disciplina: int, disciplina: Disciplina):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "UPDATE disciplinas SET nombre = %s WHERE id = %s",
        (disciplina.nombre, id_disciplina)
    )

    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")

    cursor.close()
    cnx.close()

    return {"mensaje": "Disciplina actualizada"}


@router.delete(
    "/{id_disciplina}",
    summary="Eliminar disciplina"
)
def borrar_disciplina(id_disciplina: int):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "DELETE FROM disciplinas WHERE id = %s",
        (id_disciplina,)
    )

    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Disciplina no encontrada")

    cursor.close()
    cnx.close()

    return {"mensaje": "Disciplina eliminada"}
