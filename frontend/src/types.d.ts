export type ViewKey =
  | 'resumen'
  | 'estudiantes'
  | 'disciplinas'
  | 'espacios'
  | 'actividades'
  | 'inscripciones'
  | 'asistencias'
  | 'reportes';

export type AnyRecord = Record<string, unknown>;

export type Student = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  carrera: string;
  facultad: string;
};

export type NamedItem = {
  id: number;
  nombre: string;
};

export type ActivityItem = {
  id: number;
  nombre: string;
  disciplina: string;
  espacio: string;
  cupo_maximo: number;
  dia: string;
  horario: string;
  estado: string;
};

export type ActivityPayload = {
  nombre: string;
  id_disciplina: number;
  id_espacio: number;
  cupo_maximo: number;
  dia: string;
  horario: string;
  estado: 'abierta' | 'cerrada' | 'finalizada' | 'cancelada';
};

export type InscriptionItem = {
  id: number;
  id_estudiante: string;
  estudiante: string;
  id_actividad: number;
  actividad: string;
  fecha_inscripcion: string;
  estado: 'confirmada' | 'espera' | 'cancelada';
};

export type Notice = {
  type: 'success' | 'error';
  text: string;
} | null;
