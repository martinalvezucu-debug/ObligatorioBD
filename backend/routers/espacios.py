from fastapi import APIRouter, HTTPException
from backend.database import connect_db
from backend.models import Espacio

router = APIRouter(
    prefix="/espacios",
    tags=["Espacios"]
)


@router.get("", summary="Listar espacios")
def get_espacios():
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute("SELECT * FROM espacios")
    espacios = cursor.fetchall()

    cursor.close()
    cnx.close()

    return espacios


@router.get("/{id_espacio}", summary="Obtener espacio por ID")
def obtener_espacio(id_espacio: int):
    cnx = connect_db()
    cursor = cnx.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM espacios WHERE id = %s",
        (id_espacio,)
    )

    espacio = cursor.fetchone()

    cursor.close()
    cnx.close()

    if espacio is None:
        raise HTTPException(status_code=404, detail="Espacio no encontrado")

    return espacio


@router.post("", summary="Crear espacio")
def crear_espacio(espacio: Espacio):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "INSERT INTO espacios (nombre) VALUES (%s)",
        (espacio.nombre,)
    )

    cnx.commit()

    cursor.close()
    cnx.close()

    return {"mensaje": "Espacio creado"}


@router.put("/{id_espacio}", summary="Actualizar espacio")
def actualizar_espacio(id_espacio: int, espacio: Espacio):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "UPDATE espacios SET nombre = %s WHERE id = %s",
        (espacio.nombre, id_espacio)
    )

    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Espacio no encontrado")

    cursor.close()
    cnx.close()

    return {"mensaje": "Espacio actualizado"}


@router.delete("/{id_espacio}", summary="Eliminar espacio")
def borrar_espacio(id_espacio: int):
    cnx = connect_db()
    cursor = cnx.cursor()

    cursor.execute(
        "DELETE FROM espacios WHERE id = %s",
        (id_espacio,)
    )

    cnx.commit()

    if cursor.rowcount == 0:
        cursor.close()
        cnx.close()
        raise HTTPException(status_code=404, detail="Espacio no encontrado")

    cursor.close()
    cnx.close()

    return {"mensaje": "Espacio eliminado"}
