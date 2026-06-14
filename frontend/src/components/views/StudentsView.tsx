import { FormEvent, useState } from 'react';
import { request } from '../../api';
import { studentSchema } from '../../schemas';
import type { Notice, Student } from '../../types';
import { CrudLayout, DataTable, FormActions, Input, RowActions } from '../controls';
import { emptyStudent } from '../constants';
import { getZodMessage } from '../helpers';

export function StudentsView({
  students,
  onSaved,
  setNotice,
}: {
  students: Student[];
  onSaved: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [form, setForm] = useState<Student>(emptyStudent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = students.filter((student) =>
    `${student.id} ${student.nombre} ${student.apellido} ${student.email} ${student.carrera} ${student.facultad}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = studentSchema.parse(form);
      if (editingId) {
        await request(`/estudiantes/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await request('/estudiantes', { method: 'POST', body: JSON.stringify(payload) });
      }
      setNotice({ type: 'success', text: editingId ? 'Estudiante actualizado' : 'Estudiante creado' });
      setForm(emptyStudent);
      setEditingId(null);
      await onSaved();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminar estudiante?')) return;
    try {
      await request(`/estudiantes/${id}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: 'Estudiante eliminado' });
      await onSaved();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  return (
    <CrudLayout
      title='Estudiantes'
      description='Documento, datos personales, carrera y facultad.'
      query={query}
      onQuery={setQuery}
      form={
        <form className='form-grid' onSubmit={submit}>
          <Input label='Documento' value={form.id} onChange={(id) => setForm({ ...form, id })} disabled={!!editingId} />
          <Input label='Nombre' value={form.nombre} onChange={(nombre) => setForm({ ...form, nombre })} />
          <Input label='Apellido' value={form.apellido} onChange={(apellido) => setForm({ ...form, apellido })} />
          <Input label='Email' value={form.email} onChange={(email) => setForm({ ...form, email })} />
          <Input label='Carrera' value={form.carrera} onChange={(carrera) => setForm({ ...form, carrera })} />
          <Input label='Facultad' value={form.facultad} onChange={(facultad) => setForm({ ...form, facultad })} />
          <FormActions
            editing={!!editingId}
            onCancel={() => {
              setForm(emptyStudent);
              setEditingId(null);
            }}
          />
        </form>
      }
    >
      <DataTable
        rows={filtered}
        columns={['id', 'nombre', 'apellido', 'email', 'carrera', 'facultad']}
        actions={(row) => (
          <RowActions
            onEdit={() => {
              setForm(row as Student);
              setEditingId((row as Student).id);
            }}
            onDelete={() => remove((row as Student).id)}
          />
        )}
      />
    </CrudLayout>
  );
}
