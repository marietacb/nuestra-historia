import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface Props {
  onAddClick: () => void;
}

const primaryTabs = [
  { to: '/', label: 'Inicio', icon: 'dashboard', end: true },
  { to: '/memories', label: 'Citas', icon: 'favorite', end: false },
] as const;

const trailingTabs = [
  { to: '/timeline', label: 'Calendario', icon: 'calendar_month', end: false },
] as const;

const moreItems = [
  { to: '/movies', label: 'Cartelera', icon: 'movie_filter' },
  { to: '/passport', label: 'Pasaporte', icon: 'travel_explore' },
  { to: '/bucket', label: 'Deseos', icon: 'auto_fix_high' },
  { to: '/settings', label: 'Ajustes', icon: 'settings' },
] as const;

const tabClass = (active: boolean) =>
  `flex flex-col items-center justify-center gap-0.5 min-h-11 text-[10px] font-bold ${
    active ? 'text-primary' : 'text-text-muted'
  }`;

const MobileTabBar: React.FC<Props> = ({ onAddClick }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = moreItems.some((item) => location.pathname === item.to);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const renderTab = (item: { to: string; label: string; icon: string; end: boolean }) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={({ isActive }) => tabClass(isActive)}
    >
      {({ isActive }) => (
        <>
          <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          aria-label="Cerrar menú"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {moreOpen && (
        <div className="md:hidden fixed inset-x-3 z-50 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] rounded-3xl border border-gray-100 bg-white p-3 shadow-2xl">
          <div className="grid grid-cols-4 gap-2">
            {moreItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-2xl px-1 py-3 text-[11px] font-bold ${
                    isActive ? 'bg-primary text-white' : 'text-text-muted'
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
        aria-label="Navegación principal"
      >
        <div className="grid h-16 grid-cols-5 items-center px-1">
          {primaryTabs.map(renderTab)}

          <button
            type="button"
            onClick={onAddClick}
            className="flex items-center justify-center"
            aria-label="Añadir cita"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95">
              <span className="material-symbols-outlined">add</span>
            </span>
          </button>

          {trailingTabs.map(renderTab)}

          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            className={tabClass(moreActive || moreOpen)}
            aria-expanded={moreOpen}
            aria-label="Más secciones"
          >
            <span className={`material-symbols-outlined text-[22px] ${moreActive || moreOpen ? 'filled' : ''}`}>
              apps
            </span>
            <span>Más</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileTabBar;
