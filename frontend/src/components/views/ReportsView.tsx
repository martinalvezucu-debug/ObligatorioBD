import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { request } from '../../api';
import type { AnyRecord, Notice } from '../../types';
import { DataTable } from '../controls';
import { reportItems } from '../constants';
import { getZodMessage } from '../helpers';

export function ReportsView({ setNotice }: { setNotice: (notice: Notice) => void }) {
  const [activeReport, setActiveReport] = useState(reportItems[0]);
  const [rows, setRows] = useState<AnyRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async (endpoint = activeReport.endpoint) => {
    setLoading(true);
    try {
      const data = await request<AnyRecord[]>(endpoint);
      setRows(data);
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReport(activeReport.endpoint);
  }, [activeReport.endpoint]);

  return (
    <section className='view-stack'>
      <div className='report-tabs'>
        {reportItems.map((report) => (
          <button
            key={report.endpoint}
            className={activeReport.endpoint === report.endpoint ? 'tab active' : 'tab'}
            onClick={() => setActiveReport(report)}
            type='button'
          >
            {report.label}
          </button>
        ))}
      </div>
      <section className='panel'>
        <div className='panel-header'>
          <div>
            <h2>{activeReport.label}</h2>
            <p>{rows.length} registros encontrados.</p>
          </div>
          <button className='ghost-button' onClick={() => loadReport()} type='button'>
            <RefreshCw size={16} />
            Recargar
          </button>
        </div>
        {loading ? <div className='empty-state'>Cargando reporte...</div> : <DataTable rows={rows} />}
      </section>
    </section>
  );
}
