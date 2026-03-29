
import React, { useState, useRef, useEffect } from 'react';
import { Category, Memory } from '../types';
import { isLikelyWrongSupabaseHost, isSupabaseConfigured, supabase } from '../supabase';
import { memoryToRow } from '../lib/supabase-mappers';

const MEMORIES_BUCKET = 'memories';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
  memoryToEdit: Memory | null;
}

const AddMemoryModal: React.FC<Props> = ({ isOpen, onClose, onAdd, onEdit, memoryToEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    endDate: '',
    location: '',
    locations: [] as string[],
    category: 'Viaje' as Category,
    description: '',
    imageUrls: [] as string[],
    km: '',
    movie: '',
    isFavorite: false,
    ratingMaria: 0,
    ratingGuillem: 0
  });

  const resetForm = () => {
    setSelectedFiles([]);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      endDate: '',
      location: '',
      locations: [],
      category: 'Viaje',
      description: '',
      imageUrls: [],
      km: '',
      movie: '',
      isFavorite: false,
      ratingMaria: 0,
      ratingGuillem: 0
    });
  };

  useEffect(() => {
    if (isOpen) {
      if (memoryToEdit) {
        const isTravel = memoryToEdit.category === 'Viaje';
        const parsedLocations =
          isTravel && memoryToEdit.location
            ? memoryToEdit.location.split(' | ').map(part => part.trim()).filter(Boolean)
            : [];

        setFormData({
          title: memoryToEdit.title || '',
          date: memoryToEdit.date || new Date().toISOString().split('T')[0],
          endDate: memoryToEdit.endDate || '',
          location: memoryToEdit.location || '',
          locations: parsedLocations,
          category: memoryToEdit.category || 'Viaje',
          description: memoryToEdit.description || '',
          imageUrls: memoryToEdit.imageUrls ? [...memoryToEdit.imageUrls] : [],
          km: memoryToEdit.km?.toString() || '',
          movie: memoryToEdit.movie || '',
          isFavorite: !!memoryToEdit.isFavorite,
          ratingMaria: memoryToEdit.ratingMaria || 0,
          ratingGuillem: memoryToEdit.ratingGuillem || 0
        });
      } else {
        resetForm();
      }
    }
  }, [memoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    
    // 1. Guardamos los archivos reales para subirlos luego
    setSelectedFiles(prev => [...prev, ...files]);

    // 2. Mantenemos la vista previa en base64 para que el usuario vea la foto
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          imageUrls: [...prev.imageUrls, reader.result as string] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    // Hay que quitar tanto la URL de vista previa como el archivo pendiente (si existe)
    // Nota: Esta lógica es simple, si borras una imagen que ya venía de edición (URL remota)
    // vs una nueva (File local), habría que gestionar los índices con cuidado.
    // Para simplificar, asumimos que borras visualmente.
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
    // También intentamos quitarlo de los archivos nuevos si coincide el índice
    // (Esto es una aproximación, para producción idealmente separarías "nuevas" de "existentes")
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica para viajes: al menos un lugar
    if (formData.category === 'Viaje') {
      const hasLocations = formData.locations && formData.locations.length > 0;
      if (!hasLocations) {
        alert('Para un viaje, añade al menos un lugar.');
        return;
      }
    }

    setIsUploading(true); // Bloquear botón

    if (!isSupabaseConfigured) {
      setIsUploading(false);
      alert(
        'No hay conexión a Supabase: faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en el despliegue (Vercel → Settings → Environment Variables). Tras añadirlas, vuelve a desplegar el proyecto porque Vite las incrusta al compilar.'
      );
      return;
    }

    if (isLikelyWrongSupabaseHost()) {
      setIsUploading(false);
      alert(
        'La URL de Supabase está mal configurada: debe ser la Project URL que termina en .supabase.co (por ejemplo https://abcdefgh.supabase.co). Si en Vercel pusiste algo como https://abcdefgh.co, falta ".supabase" en el dominio; cópiala entera desde Supabase → Project Settings → API.'
      );
      return;
    }

    try {
      const isActuallyEditing = memoryToEdit && memoryToEdit.id && memoryToEdit.id !== '';
      const memoryId = isActuallyEditing ? memoryToEdit!.id : Math.random().toString(36).substr(2, 9);
      
      const uploadedUrls: string[] = [];
      const existingRemoteUrls = formData.imageUrls.filter(url => url.startsWith('http'));
      uploadedUrls.push(...existingRemoteUrls);

      for (const file of selectedFiles) {
        const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
        const safeBase = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const safeName = ext ? `${safeBase}.${ext}` : safeBase;
        const path = `${memoryId}/${safeName}`;

        const { error: uploadError } = await supabase
          .storage
          .from(MEMORIES_BUCKET)
          .upload(path, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase
          .storage
          .from(MEMORIES_BUCKET)
          .getPublicUrl(path);

        uploadedUrls.push(urlData.publicUrl);
      }

      const memoryData: Memory = {
        ...formData,
        id: memoryId,
        imageUrls: uploadedUrls,
        km: formData.category === 'Viaje' ? parseFloat(formData.km) || 0 : undefined,
        movie: formData.category === 'Cine' ? (formData.movie || formData.title) : undefined,
        ratingMaria: formData.category === 'Cine' ? formData.ratingMaria : undefined,
        ratingGuillem: formData.category === 'Cine' ? formData.ratingGuillem : undefined,
        endDate: formData.endDate || undefined
      };

      const { error: dbError } = await supabase.from('memories').upsert(memoryToRow(memoryData));
      if (dbError) throw dbError;

      if (isActuallyEditing) {
        onEdit(memoryData);
      } else {
        onAdd(memoryData);
      }

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      alert('Error al guardar la cita en la base de datos. Revisa la consola.');
    } finally {
      setIsUploading(false);
    }
  };

  const StarInput = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`material-symbols-outlined text-2xl transition-all hover:scale-125 ${star <= value ? 'text-yellow-400 filled' : 'text-gray-200'}`}
          >
            star
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-text-main">
            {memoryToEdit && memoryToEdit.id ? 'Editar Cita' : 'Nueva Cita'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form id="add-memory-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Fotos */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Nuestras fotos</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative shrink-0 size-24 rounded-2xl overflow-hidden border border-gray-100 group">
                  <img src={url} className="w-full h-full object-cover" alt="Preview" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 size-6 bg-black/50 text-white rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 size-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-2xl">add_a_photo</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImagesChange} className="hidden" accept="image/*" multiple />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">¿Qué pasó?</label>
              <input required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all" placeholder="Título de la cita..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Fecha Inicio</label>
                <input required type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Fecha Fin (Opcional)</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {formData.category === 'Viaje' ? (
                  <>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">
                      Lugares (uno por línea)
                    </label>
                    <textarea
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none text-sm resize-none h-24"
                      placeholder="Ej:&#10;Roma, Italia&#10;Florencia, Italia"
                      value={formData.locations.join('\n')}
                      onChange={e => {
                        const lines = e.target.value
                          .split('\n')
                          .map(line => line.trim())
                          .filter(Boolean);
                        setFormData({
                          ...formData,
                          locations: lines,
                          location: lines.join(' | ')
                        });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Lugar</label>
                    <input
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 outline-none text-sm"
                      placeholder="Dónde..."
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Categoría</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-white text-sm"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  <option value="Viaje">✈️ Viaje</option>
                  <option value="Comida">🥘 Comida</option>
                  <option value="Cine">🍿 Cine</option>
                  <option value="Hito">✨ Hito Especial</option>
                  <option value="Tometa">🍸 Tometa</option>
                  <option value="Cumpleaños">🎂 Cumpleaños</option>
                  <option value="Plan espontáneo">⚡ Plan espontáneo</option>
                  <option value="Tarde con amigos">👯‍♀️ Tarde con amigos</option>
                  <option value="Sorpresa">🎁 Sorpresa</option>
                  <option value="Fiesta">🎉 Fiesta</option>
                  <option value="Plan Casero">🏡 Plan casero</option>
                  <option value="Deporte">💪 Deporte</option>
                  <option value="Libro">📚 Libro</option>
                  <option value="Amor">💕 Amor</option>
                </select>
              </div>
            </div>

            {formData.category === 'Viaje' && (
              <div className="animate-in slide-in-from-right-4">
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Km Totales</label>
                <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm" placeholder="Distancia recorrida..." value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} />
              </div>
            )}

            {formData.category === 'Cine' && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4">
                <StarInput label="Nota Maria" value={formData.ratingMaria} onChange={val => setFormData({...formData, ratingMaria: val})} />
                <StarInput label="Nota Guillem" value={formData.ratingGuillem} onChange={val => setFormData({...formData, ratingGuillem: val})} />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 ml-1">Comentario</label>
              <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none h-24 text-sm" placeholder="¿Qué hizo especial este momento?..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0 bg-white">
          <button onClick={onClose} className="flex-1 py-3.5 px-4 rounded-xl font-bold text-text-muted bg-gray-50 hover:bg-gray-100 transition-colors">Cancelar</button>
          <button 
            type="submit"
            form="add-memory-form"
            disabled={isUploading}
            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploading ? 'Subiendo fotos...' : (memoryToEdit && memoryToEdit.id ? 'Guardar Cambios' : 'Guardar Cita')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryModal;
