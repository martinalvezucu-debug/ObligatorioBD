import { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import type { AnyRecord, NamedItem } from '../types';
import { formatValue } from './helpers';

export function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className='metric'>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function QuickAction({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button className='quick-action' onClick={onClick} type='button'>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function CrudLayout({
  title,
  description,
  form,
  children,
  query,
  onQuery,
}: {
  title: string;
  description: string;
  form: ReactNode;
  children: ReactNode;
  query?: string;
  onQuery?: (value: string) => void;
}) {
  return (
    <section className='work-grid'>
      <section className='panel'>
        <div className='panel-header'>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {onQuery && (
            <input
              className='search'
              placeholder='Buscar'
              value={query}
              onChange={(event) => onQuery(event.target.value)}
            />
          )}
        </div>
        {children}
      </section>
      <section className='panel form-panel'>
        <div className='panel-header'>
          <div>
            <h2>Formulario</h2>
            <p>Los campos se validan antes de enviar.</p>
          </div>
        </div>
        {form}
      </section>
    </section>
  );
}

export function DataTable({
  rows,
  columns,
  actions,
}: {
  rows: AnyRecord[];
  columns?: string[];
  actions?: (row: AnyRecord) => ReactNode;
}) {
  const resolvedColumns = columns || Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  if (rows.length === 0) {
    return <div className='empty-state'>No hay registros para mostrar.</div>;
  }

  return (
    <div className='table-wrap'>
      <table>
        <thead>
          <tr>
            {resolvedColumns.map((column) => (
              <th key={column}>{column.replace(/_/g, ' ')}</th>
            ))}
            {actions && <th>acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${JSON.stringify(row)}-${index}`}>
              {resolvedColumns.map((column) => (
                <td key={column}>{formatValue(row[column])}</td>
              ))}
              {actions && <td className='actions-cell'>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className='row-actions'>
      <button className='small-button' onClick={onEdit} type='button'>
        Editar
      </button>
      <button className='icon-danger' onClick={onDelete} title='Eliminar' type='button'>
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
}) {
  return (
    <label className='field'>
      <span>{label}</span>
      <input
        disabled={disabled}
        maxLength={maxLength}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: NamedItem[];
}) {
  return (
    <label className='field'>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
        <option value={0}>Seleccionar</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nombre}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FormActions({ editing, onCancel }: { editing: boolean; onCancel: () => void }) {
  return (
    <div className='form-actions'>
      <button className='primary-button' type='submit'>
        {editing ? 'Guardar cambios' : 'Crear'}
      </button>
      {editing && (
        <button className='ghost-button' onClick={onCancel} type='button'>
          Cancelar
        </button>
      )}
    </div>
  );
}
