import { z } from 'zod';

export function formatValue(value: unknown) {
  if (value === true) return 'Si';
  if (value === false) return 'No';
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

export function getZodMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || 'Revisa los campos ingresados';
  }
  if (error instanceof Error) return error.message;
  return 'Ocurrio un error';
}
