import { FormEvent, useState } from 'react';
import { request } from '../../api';
import { activitySchema } from '../../schemas';
import type { ActivityItem, ActivityPayload, NamedItem, Notice } from '../../types';
import { CrudLayout, DataTable, FormActions, Input, RowActions, Select } from '../controls';
import { emptyActivity } from '../constants';
import { getZodMessage } from '../helpers';

export function ActivitiesView({
  activities,
  disciplines,
  spaces,
  onSaved,
  setNotice,
}: {
  activities: ActivityItem[];
  disciplines: NamedItem[];
  spaces: NamedItem[];
  onSaved: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [form, setForm] = useState<ActivityPayload>(emptyActivity);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const filtered = activities.filter((activity) =>
    `${activity.nombre} ${activity.disciplina} ${activity.espacio} ${activity.dia} ${activity.estado}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = activitySchema.parse(form);
      if (editingId) {
        await request(`/actividades/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await request('/actividades', { method: 'POST', body: JSON.stringify(payload) });
      }
      setNotice({ type: 'success', text: editingId ? 'Actividad actualizada' : 'Actividad creada' });
      setForm(emptyActivity);
      setEditingId(null);
      await onSaved();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Eliminar actividad?')) return;
    try {
      await request(`/actividades/${id}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: 'Actividad eliminada' });
      await onSaved();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  const edit = (activity: ActivityItem) => {
    const discipline = disciplines.find((item) => item.nombre === activity.disciplina);
    const space = spaces.find((item) => item.nombre === activity.espacio);
    setForm({
      nombre: activity.nombre,
      id_disciplina: discipline?.id || 0,
      id_espacio: space?.id || 0,
      cupo_maximo: activity.cupo_maximo,
      dia: activity.dia,
      horario: activity.horario.length === 5 ? `${activity.horario}:00` : activity.horario,
      estado: activity.estado as ActivityPayload['estado'],
    });
    setEditingId(activity.id);
  };

  return (
    <CrudLayout
      title='Actividades'
      description='Oferta deportiva con disciplina, espacio, cupo y estado.'
      query={query}
      onQuery={setQuery}
      form={
        <form className='form-grid' onSubmit={submit}>
          <Input label='Nombre' value={form.nombre} onChange={(nombre) => setForm({ ...form, nombre })} />
          <Select
            label='Disciplina'
            value={form.id_disciplina}
            onChange={(id_disciplina) => setForm({ ...form, id_disciplina })}
            options={disciplines}
          />
          <Select
            label='Espacio'
            value={form.id_espacio}
            onChange={(id_espacio) => setForm({ ...form, id_espacio })}
            options={spaces}
          />
          <Input
            label='Cupo maximo'
            type='number'
            value={String(form.cupo_maximo)}
            onChange={(cupo_maximo) => setForm({ ...form, cupo_maximo: Number(cupo_maximo) })}
          />
          <Input label='Dia' value={form.dia} onChange={(dia) => setForm({ ...form, dia })} />
          <Input
            label='Horario'
            type='time'
            value={form.horario.slice(0, 5)}
            onChange={(horario) => setForm({ ...form, horario: `${horario}:00` })}
          />
          <label className='field'>
            <span>Estado</span>
            <select
              value={form.estado}
              onChange={(event) => setForm({ ...form, estado: event.target.value as ActivityPayload['estado'] })}
            >
              <option value='abierta'>abierta</option>
              <option value='cerrada'>cerrada</option>
              <option value='finalizada'>finalizada</option>
              <option value='cancelada'>cancelada</option>
            </select>
          </label>
          <FormActions
            editing={!!editingId}
            onCancel={() => {
              setForm(emptyActivity);
              setEditingId(null);
            }}
          />
        </form>
      }
    >
      <DataTable
        rows={filtered}
        columns={['id', 'nombre', 'disciplina', 'espacio', 'cupo_maximo', 'dia', 'horario', 'estado']}
        actions={(row) => (
          <RowActions onEdit={() => edit(row as ActivityItem)} onDelete={() => remove((row as ActivityItem).id)} />
        )}
      />
    </CrudLayout>
  );
}
