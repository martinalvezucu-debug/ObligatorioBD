from datetime import date
from typing import Literal
from pydantic import BaseModel, Field

class Estudiante(BaseModel):
    id: str = Field(min_length=1, max_length=15)
    nombre: str = Field(min_length=1, max_length=50)
    apellido: str = Field(min_length=1, max_length=50)
    email: str = Field(min_length=1, max_length=75, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    carrera: str = Field(min_length=1, max_length=100)
    facultad: str = Field(min_length=1, max_length=50)


class Disciplina(BaseModel):
    nombre: str = Field(min_length=1, max_length=50)


class Espacio(BaseModel):
    nombre: str = Field(min_length=1, max_length=20)


class Actividad(BaseModel):
    nombre: str = Field(min_length=1, max_length=50)
    id_disciplina: int = Field(gt=0)
    id_espacio: int = Field(gt=0)
    cupo_maximo: int = Field(gt=0)
    dia: str = Field(min_length=1, max_length=50)
    horario: str
    estado: Literal["abierta", "cerrada", "finalizada", "cancelada"]


class Inscripcion(BaseModel):
    id_estudiante: str = Field(min_length=1, max_length=15)
    id_actividad: int = Field(gt=0)


class Asistencia(BaseModel):
    id_inscripcion: int = Field(gt=0)
    fecha: date
    asistencia: bool
