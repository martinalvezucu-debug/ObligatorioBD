import { FormEvent, useState } from 'react';
import { z } from 'zod';
import { request } from '../../api';
import type { NamedItem, Notice } from '../../types';
import { CrudLayout, DataTable, FormActions, Input, RowActions } from '../controls';
import { getZodMessage } from '../helpers';

export function NamedView({
  title,
  description,
  endpoint,
  items,
  schema,
  maxLength,
  onSaved,
  setNotice,
}: {
  title: string;
  description: string;
  endpoint: string;
  items: NamedItem[];
  schema: z.ZodSchema<{ nombre: string }>;
  maxLength: number;
  onSaved: () => Promise<void>;
  setNotice: (notice: Notice) => void;
}) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = schema.parse({ nombre: name });
      if (editingId) {
        await request(`${endpoint}/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await request(endpoint, { method: 'POST', body: JSON.stringify(payload) });
      }
      setNotice({ type: 'success', text: editingId ? `${title} actualizado` : `${title} creado` });
      setName('');
      setEditingId(null);
      await onSaved();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Eliminar registro?')) return;
    try {
      await request(`${endpoint}/${id}`, { method: 'DELETE' });
      setNotice({ type: 'success', text: 'Registro eliminado' });
      await onSaved();
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    }
  };

  return (
    <CrudLayout
      title={title}
      description={description}
      form={
        <form className='form-grid single' onSubmit={submit}>
          <Input label='Nombre' maxLength={maxLength} value={name} onChange={setName} />
          <FormActions
            editing={!!editingId}
            onCancel={() => {
              setName('');
              setEditingId(null);
            }}
          />
        </form>
      }
    >
      <DataTable
        rows={items}
        columns={['id', 'nombre']}
        actions={(row) => (
          <RowActions
            onEdit={() => {
              const item = row as NamedItem;
              setName(item.nombre);
              setEditingId(item.id);
            }}
            onDelete={() => remove((row as NamedItem).id)}
          />
        )}
      />
    </CrudLayout>
  );
}
