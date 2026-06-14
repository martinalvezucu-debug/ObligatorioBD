import { FormEvent, useState } from 'react';
import { request } from '../../api';
import { attendanceSchema } from '../../schemas';
import type { Notice } from '../../types';
import { Input } from '../controls';
import { getZodMessage } from '../helpers';

export function AttendanceView({ setNotice }: { setNotice: (notice: Notice) => void }) {
  const [idInscripcion, setIdInscripcion] = useState(0);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [asistencia, setAsistencia] = useState(true);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = attendanceSchema.parse({ id_inscripcion: idInscripcion, fecha, asistencia });
      const response = await request<{ mensaje: string }>('/asistencias', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setNotice({ type: 'success', text: response.mensaje });
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  return (
    <section className='panel narrow-panel'>
      <div className='panel-header'>
        <div>
          <h2>Registrar asistencia</h2>
          <p>Solo se permite registrar asistencia de inscripciones confirmadas.</p>
        </div>
      </div>
      <form className='form-grid single' onSubmit={submit}>
        <Input
          label='ID de inscripcion'
          type='number'
          value={String(idInscripcion || '')}
          onChange={(value) => setIdInscripcion(Number(value))}
        />
        <Input label='Fecha' type='date' value={fecha} onChange={setFecha} />
        <label className='switch-row'>
          <input checked={asistencia} onChange={(event) => setAsistencia(event.target.checked)} type='checkbox' />
          <span>{asistencia ? 'Presente' : 'Ausente'}</span>
        </label>
        <button className='primary-button' type='submit'>
          Registrar asistencia
        </button>
      </form>
    </section>
  );
}
