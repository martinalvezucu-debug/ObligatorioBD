from fastapi import FastAPI
from backend.routers import estudiantes, inscripciones, disciplinas, espacios, actividades, asistencias, reportes

app = FastAPI(title="Sistema de actividades deportivas")

@app.get("/")
def inicio():
    return {"mensaje": "API funcionando"}

app.include_router(estudiantes.router)
app.include_router(disciplinas.router)
app.include_router(espacios.router)
app.include_router(actividades.router)
app.include_router(inscripciones.router)
app.include_router(asistencias.router)
app.include_router(reportes.router)
