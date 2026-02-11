
import React, { useState } from 'react';
import { Memory } from '../types';

interface MemoryCardProps {
  memory: Memory;
  onClick: (memory: Memory) => void;
  onDelete?: (id: string) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick, onDelete }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const getCategoryColor = (category: Memory['category']) => {
    switch (category) {
      case 'Viaje': return 'text-blue-600';
      case 'Comida': return 'text-orange-600';
      case 'Cine': return 'text-purple-600';
      case 'Hito': return 'text-yellow-600';
      case 'Tometa': return 'text-red-500';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: Memory['category']) => {
    switch (category) {
      case 'Viaje': return 'flight_takeoff';
      case 'Comida': return 'restaurant';
      case 'Cine': return 'movie';
      case 'Hito': return 'celebration';
      case 'Tometa': return 'local_bar';
      default: return 'favorite';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const displayDate = memory.endDate 
    ? `${formatDate(memory.date)} - ${formatDate(memory.endDate)} ${new Date(memory.date).getFullYear()}`
    : new Date(memory.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleStartDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(memory.id);
    setIsConfirmingDelete(false);
  };

  return (
    <article 
      onClick={() => onClick(memory)}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80 z-10"></div>
        <img 
          alt={memory.title} 
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
          src={memory.imageUrls[0] || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'} 
        />
        
        {/* Multi-photo indicator badge */}
        {memory.imageUrls.length > 1 && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            <span className="material-symbols-outlined text-xs">photo_library</span>
            {memory.imageUrls.length}
          </div>
        )}

        <div className="absolute right-3 top-3 z-30 flex gap-2">
          {onDelete && (
            !isConfirmingDelete ? (
              <button 
                onClick={handleStartDelete}
                className="size-8 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            ) : (
              <div className="flex gap-1 animate-in zoom-in-95">
                <button 
                  onClick={handleCancelDelete}
                  className="h-8 px-2 bg-white text-text-main font-bold text-[10px] rounded-lg shadow-lg"
                >
                  No
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="h-8 px-2 bg-red-500 text-white font-bold text-[10px] rounded-lg shadow-lg"
                >
                  Sí
                </button>
              </div>
            )
          )}
          <span className={`inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold ${getCategoryColor(memory.category)} shadow-sm backdrop-blur-sm`}>
            <span className="material-symbols-outlined text-[14px]">{getCategoryIcon(memory.category)}</span>
            {memory.category}
          </span>
        </div>
        
        {memory.isFavorite && (
          <div className="absolute bottom-3 right-3 z-20 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-primary">
            <span className="material-symbols-outlined text-[20px] filled">favorite</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{displayDate}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {memory.location}
          </span>
        </div>
        <h3 className="mb-1 text-lg font-bold leading-tight text-gray-900 group-hover:text-primary transition-colors truncate">
          {memory.title}
        </h3>
        {memory.category === 'Cine' && memory.movie && (
          <p className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">movie</span>
            {memory.movie}
          </p>
        )}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {memory.description}
        </p>
      </div>
    </article>
  );
};

export default MemoryCard;
