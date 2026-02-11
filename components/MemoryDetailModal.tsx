
import React, { useState, useEffect } from 'react';
import { Memory } from '../types';

interface Props {
  memory: Memory | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (memory: Memory) => void;
  onToggleFavorite: (id: string) => void;
}

const MemoryDetailModal: React.FC<Props> = ({ memory, onClose, onDelete, onEdit, onToggleFavorite }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Reiniciar estados cuando cambia el recuerdo
  useEffect(() => {
    setActiveImageIndex(0);
    setIsConfirmingDelete(false);
  }, [memory?.id]);

  if (!memory) return null;

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
    onDelete(memory.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(memory);
    onClose();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % memory.imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + memory.imageUrls.length) % memory.imageUrls.length);
  };

  const displayFullDate = memory.endDate 
    ? `${new Date(memory.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - ${new Date(memory.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : new Date(memory.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Area de Imagen */}
        <div className="w-full md:w-1/2 relative bg-gray-100 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full relative group">
            <img 
              src={memory.imageUrls[activeImageIndex]} 
              alt={memory.title} 
              className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
            />
            
            {memory.imageUrls.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 size-10 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 size-10 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </>
            )}
          </div>
          <button onClick={onClose} className="absolute top-4 left-4 md:hidden p-2 bg-black/50 text-white rounded-full backdrop-blur-sm">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Area de Contenido */}
        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit uppercase tracking-wider">
                {memory.category}
              </span>
              <h2 className="text-3xl font-black text-text-main leading-tight">{memory.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onToggleFavorite(memory.id)} className={`p-2 rounded-full transition-all ${memory.isFavorite ? 'text-primary bg-primary/5' : 'text-gray-300'}`}>
                <span className={`material-symbols-outlined text-2xl ${memory.isFavorite ? 'filled' : ''}`}>favorite</span>
              </button>
              <button onClick={onClose} className="hidden md:flex p-2 hover:bg-gray-100 rounded-full text-text-muted">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-accent-rose rounded-xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">calendar_today</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Cuándo</p>
                  <p className="text-sm font-bold text-text-main">{displayFullDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Dónde</p>
                  <p className="text-sm font-bold text-text-main">{memory.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-lg text-text-main leading-relaxed">
              "{memory.description}"
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center bg-white sticky bottom-0">
            {!isConfirmingDelete ? (
              <>
                <button onClick={handleEdit} className="px-6 py-3 text-text-main font-bold flex items-center gap-2 hover:bg-gray-100 rounded-xl transition-all">
                  <span className="material-symbols-outlined text-xl">edit</span>
                  Editar
                </button>
                <button onClick={handleStartDelete} className="px-6 py-3 text-red-500 font-bold flex items-center gap-2 hover:bg-red-50 rounded-xl transition-all">
                  <span className="material-symbols-outlined text-xl">delete</span>
                  Borrar
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full animate-in slide-in-from-bottom-2">
                <p className="text-sm font-bold text-red-600 flex-1">¿Borrar para siempre?</p>
                <button onClick={handleCancelDelete} className="px-4 py-2 text-text-muted font-bold hover:bg-gray-100 rounded-lg transition-all">
                  No
                </button>
                <button onClick={handleConfirmDelete} className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95">
                  Sí, borrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDetailModal;
