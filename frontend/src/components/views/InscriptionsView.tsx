import { FormEvent, useEffect, useState } from 'react';
import { request } from '../../api';
import { inscriptionSchema } from '../../schemas';
import type { ActivityItem, InscriptionItem, Notice, Student } from '../../types';
import { CrudLayout, DataTable } from '../controls';
import { getZodMessage } from '../helpers';

export function InscriptionsView({
  students,
  activities,
  setNotice,
}: {
  students: Student[];
  activities: ActivityItem[];
  setNotice: (notice: Notice) => void;
}) {
  const [idEstudiante, setIdEstudiante] = useState('');
  const [idActividad, setIdActividad] = useState(0);
  const [lastStatus, setLastStatus] = useState('');
  const [inscriptions, setInscriptions] = useState<InscriptionItem[]>([]);
  const [query, setQuery] = useState('');

  const loadInscriptions = async () => {
    try {
      const data = await request<InscriptionItem[]>('/inscripciones');
      setInscriptions(data);
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  useEffect(() => {
    void loadInscriptions();
  }, []);

  const filtered = inscriptions.filter((inscription) =>
    `${inscription.estudiante} ${inscription.actividad} ${inscription.estado}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = inscriptionSchema.parse({ id_estudiante: idEstudiante, id_actividad: idActividad });
      const response = await request<{ mensaje: string; estado: string }>('/inscripciones', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setLastStatus(response.estado);
      setNotice({ type: 'success', text: `${response.mensaje}: ${response.estado}` });
      await loadInscriptions();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  const cancel = async (id: number) => {
    if (!confirm('Cancelar inscripcion?')) return;
    try {
      await request(`/inscripciones/${id}/cancelar`, { method: 'PUT' });
      setNotice({ type: 'success', text: 'Inscripcion cancelada' });
      await loadInscriptions();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  return (
    <CrudLayout
      title='Inscripciones'
      description='Gestion de altas, lista de espera y cancelaciones.'
      query={query}
      onQuery={setQuery}
      form={
        <form className='form-grid single' onSubmit={submit}>
          <label className='field'>
            <span>Estudiante</span>
            <select value={idEstudiante} onChange={(event) => setIdEstudiante(event.target.value)}>
              <option value=''>Seleccionar estudiante</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.apellido}, {student.nombre} - {student.id}
                </option>
              ))}
            </select>
          </label>
          <label className='field'>
            <span>Actividad</span>
            <select value={idActividad} onChange={(event) => setIdActividad(Number(event.target.value))}>
              <option value={0}>Seleccionar actividad</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.nombre} - {activity.estado}
                </option>
              ))}
            </select>
          </label>
          <button className='primary-button' type='submit'>
            Crear inscripcion
          </button>
          {lastStatus && <div className={`status-result ${lastStatus}`}>Estado: {lastStatus}</div>}
        </form>
      }
    >
      <DataTable
        rows={filtered}
        columns={['id', 'estudiante', 'actividad', 'fecha_inscripcion', 'estado']}
        actions={(row) => {
          const inscription = row as InscriptionItem;

          if (inscription.estado === 'cancelada') {
            return <span>Cancelada</span>;
          }

          return (
            <button className='small-button' onClick={() => cancel(inscription.id)} type='button'>
              Cancelar
            </button>
          );
        }}
      />
    </CrudLayout>
  );
}
