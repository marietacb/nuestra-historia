
import React from 'react';
import { NavLink } from 'react-router-dom';
import { SharedUser } from '../types';

interface Props {
  currentUser: SharedUser;
  onAddClick: () => void;
}

const Sidebar: React.FC<Props> = ({ currentUser, onAddClick }) => {
  const navItems = [
    { to: '/', label: 'Inicio', icon: 'dashboard' },
    { to: '/memories', label: 'Nuestras Citas', icon: 'favorite' },
    { to: '/movies', label: 'Nuestra Cartelera', icon: 'movie_filter' },
    { to: '/passport', label: 'Pasaporte', icon: 'travel_explore' },
    { to: '/bucket', label: 'Lista de Deseos', icon: 'auto_fix_high' },
    { to: '/timeline', label: 'Calendario', icon: 'calendar_month' },
    { to: '/settings', label: 'Ajustes', icon: 'settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-surface-light border-r border-gray-100 p-6 shadow-sm z-20">
      <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
        <div className="relative size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          <span className="material-symbols-outlined filled">favorite</span>
        </div>
        <div>
          <h1 className="text-text-main text-base font-bold leading-tight">Nuestra Historia</h1>
          <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{currentUser.name}</p>
        </div>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
                  : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined ${isActive ? 'filled' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={onAddClick}
        className="mt-auto flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white py-4 px-4 rounded-2xl font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
      >
        <span className="material-symbols-outlined">add_circle</span>
        <span>Añadir Cita</span>
      </button>
    </aside>
  );
};

export default Sidebar;
