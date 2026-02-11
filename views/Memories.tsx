
import React, { useState, useMemo } from 'react';
import MemoryCard from '../components/MemoryCard';
import { Memory } from '../types';

interface Props {
  memories: Memory[];
  onAddClick: () => void;
  onDelete: (id: string) => void;
  onViewMemory: (memory: Memory) => void;
}

const Memories: React.FC<Props> = ({ memories, onAddClick, onDelete, onViewMemory }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filters = [
    { label: 'Todos', icon: 'apps', color: 'text-gray-500' },
    { label: 'Favoritos', icon: 'favorite', color: 'text-primary' },
    { label: 'Viaje', icon: 'flight_takeoff', color: 'text-blue-500' },
    { label: 'Comida', icon: 'restaurant', color: 'text-orange-500' },
    { label: 'Cine', icon: 'movie', color: 'text-purple-500' },
    { label: 'Hito', icon: 'celebration', color: 'text-yellow-500' },
  ];

  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                            m.location.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' 
        ? true 
        : activeFilter === 'Favoritos' 
          ? !!m.isFavorite 
          : m.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter, memories]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8">
      <div className="sticky top-0 z-40 -mx-4 bg-background-light/80 px-4 py-4 backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="group flex h-12 w-full max-w-md items-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-primary/50">
            <div className="flex h-full w-12 items-center justify-center text-gray-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full w-full border-none bg-transparent px-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0" 
              placeholder="Buscar citas, lugares..." 
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((f) => (
              <button 
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={`flex whitespace-nowrap items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all shadow-sm ring-1 ring-gray-200 ${
                  activeFilter === f.label 
                    ? 'bg-primary text-white ring-primary' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${activeFilter === f.label ? 'text-white' : f.color} ${f.label === 'Favoritos' ? 'filled' : ''}`}>
                  {f.icon}
                </span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMemories.map((memory) => (
          <MemoryCard 
            key={memory.id} 
            memory={memory} 
            onClick={onViewMemory} 
            onDelete={onDelete}
          />
        ))}
        <button onClick={onAddClick} className="group flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary transition-colors">
          <div className="size-16 rounded-full bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <h3 className="mt-4 font-bold">Añadir Cita</h3>
        </button>
      </div>
    </div>
  );
};

export default Memories;
