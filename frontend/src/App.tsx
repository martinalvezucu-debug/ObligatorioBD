import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { request } from './api';
import { namedSchema, spaceSchema } from './schemas';
import type { ActivityItem, NamedItem, Notice, Student, ViewKey } from './types';
import { navItems } from './components/constants';
import { getZodMessage } from './components/helpers';
import {
  ActivitiesView,
  AttendanceView,
  InscriptionsView,
  NamedView,
  ReportsView,
  StudentsView,
  Summary,
} from './components/views';

function App() {
  const [activeView, setActiveView] = useState<ViewKey>('resumen');
  const [students, setStudents] = useState<Student[]>([]);
  const [disciplines, setDisciplines] = useState<NamedItem[]>([]);
  const [spaces, setSpaces] = useState<NamedItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const loadCatalogs = async () => {
    setLoading(true);
    try {
      const [nextStudents, nextDisciplines, nextSpaces, nextActivities] = await Promise.all([
        request<Student[]>('/estudiantes'),
        request<NamedItem[]>('/disciplinas'),
        request<NamedItem[]>('/espacios'),
        request<ActivityItem[]>('/actividades'),
      ]);
      setStudents(nextStudents);
      setDisciplines(nextDisciplines);
      setSpaces(nextSpaces);
      setActivities(nextActivities);
    } catch (error) {
      setNotice({ type: 'error', text: getZodMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const refresh = () => {
    void loadCatalogs();
  };

  const shellTitle = navItems.find((item) => item.key === activeView)?.label || 'Resumen';

  return (
    <div className='app-shell'>
      <aside className='sidebar'>
        <div className='brand'>
          <span className='brand-mark'>UCU</span>
          <div>
            <strong>Deportes</strong>
            <small>Gestion universitaria</small>
          </div>
        </div>
        <nav className='nav-list'>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={activeView === item.key ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveView(item.key)}
              type='button'
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className='main-area'>
        <header className='topbar'>
          <div>
            <span className='eyebrow'>Sistema de actividades deportivas</span>
            <h1>{shellTitle}</h1>
          </div>
          <button className='ghost-button' onClick={refresh} type='button'>
            <RefreshCw size={17} />
            Actualizar
          </button>
        </header>

        {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}
        {loading && <div className='notice info'>Cargando datos...</div>}

        {activeView === 'resumen' && (
          <Summary
            students={students}
            disciplines={disciplines}
            spaces={spaces}
            activities={activities}
            onGo={setActiveView}
          />
        )}
        {activeView === 'estudiantes' && (
          <StudentsView students={students} onSaved={loadCatalogs} setNotice={setNotice} />
        )}
        {activeView === 'disciplinas' && (
          <NamedView
            title='Disciplinas'
            description='ABM de disciplinas deportivas.'
            endpoint='/disciplinas'
            items={disciplines}
            schema={namedSchema}
            maxLength={50}
            onSaved={loadCatalogs}
            setNotice={setNotice}
          />
        )}
        {activeView === 'espacios' && (
          <NamedView
            title='Espacios'
            description='ABM de espacios deportivos.'
            endpoint='/espacios'
            items={spaces}
            schema={spaceSchema}
            maxLength={20}
            onSaved={loadCatalogs}
            setNotice={setNotice}
          />
        )}
        {activeView === 'actividades' && (
          <ActivitiesView
            activities={activities}
            disciplines={disciplines}
            spaces={spaces}
            onSaved={loadCatalogs}
            setNotice={setNotice}
          />
        )}
        {activeView === 'inscripciones' && (
          <InscriptionsView students={students} activities={activities} setNotice={setNotice} />
        )}
        {activeView === 'asistencias' && <AttendanceView setNotice={setNotice} />}
        {activeView === 'reportes' && <ReportsView setNotice={setNotice} />}
      </main>
    </div>
  );
}

export default App;
