import { BarChart3, BookOpen, CalendarCheck, Plus } from 'lucide-react';
import type { ActivityItem, NamedItem, Student, ViewKey } from '../../types';
import { Metric, QuickAction } from '../controls';

export function Summary({
  students,
  disciplines,
  spaces,
  activities,
  onGo,
}: {
  students: Student[];
  disciplines: NamedItem[];
  spaces: NamedItem[];
  activities: ActivityItem[];
  onGo: (view: ViewKey) => void;
}) {
  const openActivities = activities.filter((activity) => activity.estado === 'abierta').length;

  return (
    <section className='view-stack'>
      <div className='metric-grid'>
        <Metric label='Estudiantes' value={students.length} />
        <Metric label='Actividades abiertas' value={openActivities} />
        <Metric label='Disciplinas' value={disciplines.length} />
        <Metric label='Espacios' value={spaces.length} />
      </div>
      <section className='panel'>
        <div className='panel-header'>
          <div>
            <h2>Acciones frecuentes</h2>
            <p>Gestion rapida de inscripciones, asistencias y datos maestros.</p>
          </div>
        </div>
        <div className='quick-grid'>
          <QuickAction label='Crear estudiante' icon={<Plus size={18} />} onClick={() => onGo('estudiantes')} />
          <QuickAction label='Crear actividad' icon={<CalendarCheck size={18} />} onClick={() => onGo('actividades')} />
          <QuickAction
            label='Inscribir estudiante'
            icon={<BookOpen size={18} />}
            onClick={() => onGo('inscripciones')}
          />
          <QuickAction label='Ver reportes' icon={<BarChart3 size={18} />} onClick={() => onGo('reportes')} />
        </div>
      </section>
    </section>
  );
}
