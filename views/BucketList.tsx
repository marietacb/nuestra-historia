
import React, { useState, useEffect } from 'react';
import { BucketItem, Category } from '../types';

interface Props {
  onConvertToAppointment: (title: string, category: Category) => void;
}

const BucketList: React.FC<Props> = ({ onConvertToAppointment }) => {
  const [items, setItems] = useState<BucketItem[]>(() => {
    const saved = localStorage.getItem('love_bucket');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Viaje a Japón', description: '', isCompleted: false, category: 'Viaje' },
      { id: '2', title: 'Curso de Baile juntos', description: '', isCompleted: false, category: 'Hito' },
      { id: 'm1', title: 'Gladiator 2', description: '', isCompleted: false, category: 'Cine' },
      { id: 'm2', title: 'Wicked', description: '', isCompleted: false, category: 'Cine' }
    ];
  });

  const [newPlan, setNewPlan] = useState('');
  const [newMovie, setNewMovie] = useState('');

  useEffect(() => {
    localStorage.setItem('love_bucket', JSON.stringify(items));
  }, [items]);

  const addItem = (title: string, category: Category) => {
    if (!title.trim()) return;
    const item: BucketItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: '',
      isCompleted: false,
      category: category
    };
    setItems([item, ...items]);
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const nowCompleted = !item.isCompleted;
        // Si acabamos de marcarlo como completado, disparamos la creación de cita
        if (nowCompleted) {
          onConvertToAppointment(item.title, item.category);
        }
        return { ...item, isCompleted: nowCompleted };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se dispare el toggle al borrar
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const plans = items.filter(i => i.category !== 'Cine');
  const movies = items.filter(i => i.category === 'Cine');

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-10">
      <header>
        <h2 className="text-4xl font-black text-text-main tracking-tight">Nuestros Sueños</h2>
        <p className="text-text-muted text-lg mt-1 font-medium">Nuestros planes pendientes jiji.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* COLUMNA 1: PLANES GENERALES */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">auto_fix_high</span>
              Lista de próximos planes
            </h3>
            <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
              {plans.filter(p => !p.isCompleted).length} pendientes
            </span>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); addItem(newPlan, 'Hito'); setNewPlan(''); }} 
            className="flex gap-2"
          >
            <input 
              value={newPlan} 
              onChange={(e) => setNewPlan(e.target.value)} 
              placeholder="¿Qué aventura sigue?..." 
              className="flex-1 bg-white border border-gray-100 rounded-2xl px-5 py-4 font-bold shadow-sm focus:border-primary/30 outline-none" 
            />
            <button type="submit" className="bg-primary text-white size-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined font-bold">add</span>
            </button>
          </form>

          <div className="flex flex-col gap-3">
            {plans.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleItem(item.id)} 
                className={`group flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${
                  item.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:shadow-md'
                }`}
              >
                <div className={`size-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.isCompleted ? 'bg-primary border-primary text-white' : 'border-gray-200'
                }`}>
                  {item.isCompleted && <span className="material-symbols-outlined text-xs font-bold">check</span>}
                </div>
                <div className="flex-1">
                  <span className={`font-bold block ${item.isCompleted ? 'text-text-muted line-through opacity-50' : 'text-text-main'}`}>
                    {item.title}
                  </span>
                </div>
                <button 
                  onClick={(e) => deleteItem(item.id, e)} 
                  className="size-10 rounded-xl hover:bg-red-50 text-red-400 transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMNA 2: PELÍCULAS PENDIENTES */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-500 filled">movie_filter</span>
              Cartelera Pendiente
            </h3>
            <span className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
              {movies.filter(m => !m.isCompleted).length} pelis
            </span>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); addItem(newMovie, 'Cine'); setNewMovie(''); }} 
            className="flex gap-2"
          >
            <input 
              value={newMovie} 
              onChange={(e) => setNewMovie(e.target.value)} 
              placeholder="Película que queremos ver..." 
              className="flex-1 bg-white border border-gray-100 rounded-2xl px-5 py-4 font-bold shadow-sm focus:border-purple-200 outline-none" 
            />
            <button type="submit" className="bg-purple-600 text-white size-14 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined font-bold">movie</span>
            </button>
          </form>

          <div className="bg-accent-rose/30 p-4 rounded-[2.5rem] border border-primary/5">
            <div className="flex flex-col gap-3">
              {movies.map(movie => (
                <div 
                  key={movie.id} 
                  onClick={() => toggleItem(movie.id)} 
                  className={`group flex items-center gap-4 p-5 rounded-2xl transition-all cursor-pointer ${
                    movie.isCompleted ? 'bg-white/40 opacity-50' : 'bg-white shadow-sm border border-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    movie.isCompleted ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-200'
                  }`}>
                    {movie.isCompleted && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                  </div>
                  <div className="flex-1">
                    <span className={`font-bold block ${movie.isCompleted ? 'line-through text-text-muted' : 'text-text-main'}`}>
                      {movie.title}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => deleteItem(movie.id, e)} 
                    className="size-10 rounded-xl hover:bg-red-50 text-red-400 transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BucketList;
