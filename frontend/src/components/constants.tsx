import { ReactNode } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  Dumbbell,
  GraduationCap,
  Home,
} from 'lucide-react';
import type { ActivityPayload, Student, ViewKey } from '../types';

export const navItems: { key: ViewKey; label: string; icon: ReactNode }[] = [
  { key: 'resumen', label: 'Resumen', icon: <Home size={18} /> },
  { key: 'estudiantes', label: 'Estudiantes', icon: <GraduationCap size={18} /> },
  { key: 'disciplinas', label: 'Disciplinas', icon: <Dumbbell size={18} /> },
  { key: 'espacios', label: 'Espacios', icon: <Building2 size={18} /> },
  { key: 'actividades', label: 'Actividades', icon: <Activity size={18} /> },
  { key: 'inscripciones', label: 'Inscripciones', icon: <BookOpen size={18} /> },
  { key: 'asistencias', label: 'Asistencias', icon: <ClipboardCheck size={18} /> },
  { key: 'reportes', label: 'Reportes', icon: <BarChart3 size={18} /> },
];

export const reportItems = [
  { label: 'Actividades mas inscriptos', endpoint: '/reportes/actividades-mas-inscriptos' },
  { label: 'Actividades con cupos', endpoint: '/reportes/actividades-con-cupos' },
  { label: 'Inscriptos por disciplina', endpoint: '/reportes/inscriptos-por-disciplina' },
  { label: 'Inscriptos por facultad', endpoint: '/reportes/inscriptos-por-facultad' },
  { label: 'Ocupacion actividades', endpoint: '/reportes/ocupacion-actividades' },
  { label: 'Asistencia por actividad', endpoint: '/reportes/asistencia-por-actividad' },
  { label: 'Estudiantes con inasistencias', endpoint: '/reportes/estudiantes-con-inasistencias' },
  { label: 'Confirmados por actividad', endpoint: '/reportes/estudiantes-confirmados-por-actividad' },
  { label: 'Actividades sin inscriptos', endpoint: '/reportes/actividades-sin-inscriptos' },
  { label: 'Mayor asistencia', endpoint: '/reportes/estudiantes-con-mayor-asistencia' },
];

export const emptyStudent: Student = {
  id: '',
  nombre: '',
  apellido: '',
  email: '',
  carrera: '',
  facultad: '',
};

export const emptyActivity: ActivityPayload = {
  nombre: '',
  id_disciplina: 0,
  id_espacio: 0,
  cupo_maximo: 1,
  dia: '',
  horario: '18:00:00',
  estado: 'abierta',
};
