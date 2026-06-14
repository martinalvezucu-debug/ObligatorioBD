import { z } from 'zod';

export const studentSchema = z.object({
  id: z.string().trim().min(1).max(15),
  nombre: z.string().trim().min(1).max(50),
  apellido: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(75),
  carrera: z.string().trim().min(1).max(100),
  facultad: z.string().trim().min(1).max(50),
});

export const namedSchema = z.object({
  nombre: z.string().trim().min(1).max(50),
});

export const spaceSchema = z.object({
  nombre: z.string().trim().min(1).max(20),
});

export const activitySchema = z.object({
  nombre: z.string().trim().min(1).max(50),
  id_disciplina: z.coerce.number().int().positive(),
  id_espacio: z.coerce.number().int().positive(),
  cupo_maximo: z.coerce.number().int().positive(),
  dia: z.string().trim().min(1).max(50),
  horario: z.string().trim().min(1),
  estado: z.enum(['abierta', 'cerrada', 'finalizada', 'cancelada']),
});

export const inscriptionSchema = z.object({
  id_estudiante: z.string().trim().min(1).max(15),
  id_actividad: z.coerce.number().int().positive(),
});

export const attendanceSchema = z.object({
  id_inscripcion: z.coerce.number().int().positive(),
  fecha: z.string().trim().min(1),
  asistencia: z.boolean(),
});
