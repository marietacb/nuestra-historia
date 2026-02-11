
import React, { useState } from 'react';
import { Memory } from '../types';

interface Props {
  memories: Memory[];
  onMovieClick: (memory: Memory) => void;
  onDelete: (id: string) => void;
}

const Movies: React.FC<Props> = ({ memories, onMovieClick, onDelete }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const movieMemories = memories
    .filter(m => m.category === 'Cine')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const StarRating = ({ rating, label }: { rating?: number, label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter mb-1">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`material-symbols-outlined text-sm ${rating && star <= rating ? 'text-yellow-400 filled' : 'text-gray-200'}`}
          >
            star
          </span>
        ))}
      </div>
    </div>
  );

  const handleStartDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8">
      <header>
        <h2 className="text-3xl font-black text-text-main tracking-tight">Nuestra Cartelera</h2>
        <p className="text-text-muted font-medium">Todas nuestras tardes de cine y tus palomitas glotón.</p>
      </header>

      {movieMemories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movieMemories.map((movie) => {
            const isMasterpiece = movie.ratingMaria === 5 && movie.ratingGuillem === 5;
            const isDeleting = confirmDeleteId === movie.id;
            
            return (
              <div 
                key={movie.id}
                onClick={() => onMovieClick(movie)}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100 flex flex-col relative"
              >
                {isMasterpiece && (
                  <div className="absolute top-4 left-4 z-20 bg-yellow-400 text-white size-10 rounded-full flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined filled text-sm">workspace_premium</span>
                  </div>
                )}

                {/* Botón de borrado con confirmación integrada */}
                <div className="absolute top-4 right-4 z-30 flex gap-2">
                  {!isDeleting ? (
                    <button 
                      onClick={(e) => handleStartDelete(movie.id, e)}
                      className="size-10 bg-black/40 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  ) : (
                    <div className="flex gap-1 animate-in zoom-in-95">
                      <button 
                        onClick={(e) => handleCancelDelete(e)}
                        className="h-10 px-3 bg-white text-text-main font-bold text-xs rounded-full shadow-lg"
                      >
                        No
                      </button>
                      <button 
                        onClick={(e) => handleConfirmDelete(movie.id, e)}
                        className="h-10 px-3 bg-red-500 text-white font-bold text-xs rounded-full shadow-lg"
                      >
                        Sí, borrar
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img 
                    src={movie.imageUrls[0] || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={movie.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">
                      {new Date(movie.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <h3 className="text-white font-black text-lg leading-tight truncate">{movie.title}</h3>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted font-bold">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {movie.location}
                  </div>
                  
                  <div className="flex justify-around py-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <StarRating label="Maria" rating={movie.ratingMaria} />
                    <div className="w-px h-8 bg-gray-200 self-center"></div>
                    <StarRating label="Guillem" rating={movie.ratingGuillem} />
                  </div>

                  <p className="text-xs text-text-muted italic line-clamp-2 leading-relaxed">
                    "{movie.description}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 opacity-50">
          <span className="material-symbols-outlined text-7xl mb-4">movie</span>
          <p className="text-lg font-bold text-text-muted">Aún no hemos ido al cine juntos...</p>
          <p className="text-sm">¡Añadir nuestra primera película!</p>
        </div>
      )}
    </div>
  );
};

export default Movies;
