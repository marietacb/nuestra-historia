
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Memories from './views/Memories';
import Movies from './views/Movies';
import Passport from './views/Passport';
import BucketList from './views/BucketList';
import Timeline from './views/Timeline';
import Settings from './views/Settings';
import Login from './views/Login';
import AddMemoryModal from './components/AddMemoryModal';
import MemoryDetailModal from './components/MemoryDetailModal';
import { Memory, SharedUser, Category } from './types';
import { INITIAL_MEMORIES, OUR_ACCOUNT } from './constants';
import { supabase } from './supabase';
import { rowToMemory, memoryToRow } from './lib/supabase-mappers';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [selectedMemoryDetail, setSelectedMemoryDetail] = useState<Memory | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('is_authenticated') === 'true';
  });

  // Recuerdos: intentamos recuperar primero de localStorage como copia local,
  // y si no hay nada
  const [memories, setMemories] = useState<Memory[]>(() => {
    if (typeof window === 'undefined') return INITIAL_MEMORIES;
    try {
      const saved = localStorage.getItem('love_memories');
      return saved ? (JSON.parse(saved) as Memory[]) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  });

  const [userConfig, setUserConfig] = useState<SharedUser>(OUR_ACCOUNT);

  // Cargar configuración compartida desde Supabase
  useEffect(() => {
    const loadUserConfig = async () => {
      try {
        const { data, error } = await supabase.from('config').select('value').eq('key', 'user').single();

        if (!error && data?.value) {
          setUserConfig(data.value as SharedUser);
        } else {
          await supabase.from('config').upsert({ key: 'user', value: OUR_ACCOUNT });
          setUserConfig(OUR_ACCOUNT);
        }
      } catch (error) {
        console.error('Error al cargar configuración desde Supabase', error);
        setUserConfig(OUR_ACCOUNT);
      }
    };

    void loadUserConfig();
  }, []);

  // Cargar recuerdos desde Supabase
  useEffect(() => {
    const loadMemories = async () => {
      try {
        const { data: rows, error } = await supabase.from('memories').select('*');

        if (error) throw error;

        if (!rows?.length) {
          await supabase.from('memories').insert(INITIAL_MEMORIES.map(memoryToRow));
          setMemories(INITIAL_MEMORIES);
        } else {
          setMemories(rows.map(rowToMemory));
        }
      } catch (error) {
        console.error('Error al cargar recuerdos desde Supabase', error);
        try {
          const saved = localStorage.getItem('love_memories');
          if (saved) setMemories(JSON.parse(saved) as Memory[]);
          else setMemories(INITIAL_MEMORIES);
        } catch {
          setMemories(INITIAL_MEMORIES);
        }
      }
    };

    void loadMemories();
  }, []);

  // Guardar configuración compartida en Supabase cuando cambie
  useEffect(() => {
    const saveUserConfig = async () => {
      try {
        await supabase.from('config').upsert({ key: 'user', value: userConfig });
      } catch (error) {
        console.error('Error al guardar configuración en Supabase', error);
      }
    };

    void saveUserConfig();
  }, [userConfig]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('is_authenticated', 'true');
  };

  // Mantener una copia local de los recuerdos por si falla la conexión.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('love_memories', JSON.stringify(memories));
      }
    } catch (error) {
      console.error('Error al guardar recuerdos en localStorage', error);
    }
  }, [memories]);

  const handleAddMemory = (newMemory: Memory) => {
    setMemories(prev => [newMemory, ...prev]);
    void supabase.from('memories').upsert(memoryToRow(newMemory));
  };

  const handleEditMemory = (updatedMemory: Memory) => {
    setMemories(prev => prev.map(m => m.id === updatedMemory.id ? updatedMemory : m));
    if (selectedMemoryDetail?.id === updatedMemory.id) {
      setSelectedMemoryDetail(updatedMemory);
    }
    setEditingMemory(null);
    void supabase.from('memories').upsert(memoryToRow(updatedMemory));
  };

  const handleToggleFavorite = useCallback((id: string) => {
    setMemories(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
      const updatedMemory = updated.find(m => m.id === id);
      if (updatedMemory) void supabase.from('memories').upsert(memoryToRow(updatedMemory));
      return updated;
    });
    setSelectedMemoryDetail(prev => prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev);
  }, []);

  const handleDeleteMemory = useCallback(async(id: string) => {
    setMemories(prev => {
      const updated = prev.filter(m => m.id !== id);

      try {
        if (typeof window !== 'undefined'){
          localStorage.setItem('love_memories', JSON.stringify(updated));
        }
      } catch (error) {
        console.error('Error al guardar recuerdos en localStorage', error);
      }
      return updated;
    });
    setSelectedMemoryDetail(prev => (prev?.id === id ? null : prev));

    const { error } = await supabase.from('memories').delete().eq('id', id);

    if  (error) {
      console.error('Error al borrar recuerdo en Supabase', error);
      alert('Error al borrar recuerdo. Por favor, inténtalo de nuevo.');
    }
  }, []);

  const openAddModal = () => {
    setEditingMemory(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (memory: Memory) => {
    setEditingMemory(memory);
    setIsAddModalOpen(true);
  };

  const handleConvertBucketToAppointment = (title: string, category: Category) => {
    setEditingMemory({
      id: '',
      title: title,
      date: new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      imageUrls: [],
      category: category,
      isFavorite: false
    });
    setIsAddModalOpen(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen w-full overflow-hidden bg-background-light font-display antialiased">
        <Sidebar currentUser={userConfig} onAddClick={openAddModal} />

        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-surface-light border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">favorite</span>
            <h1 className="text-text-main text-lg font-bold">Nuestra Historia</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-text-main">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-72 h-full bg-white p-6" onClick={e => e.stopPropagation()}>
              <Sidebar currentUser={userConfig} onAddClick={() => { openAddModal(); setIsMobileMenuOpen(false); }} />
            </div>
          </div>
        )}

        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-16 md:pt-0">
          <Routes>
            <Route path="/" element={<Dashboard memories={memories} userConfig={userConfig} onViewMemory={setSelectedMemoryDetail} />} />
            <Route path="/memories" element={<Memories memories={memories} onAddClick={openAddModal} onDelete={handleDeleteMemory} onViewMemory={setSelectedMemoryDetail} />} />
            <Route path="/movies" element={<Movies memories={memories} onMovieClick={setSelectedMemoryDetail} onDelete={handleDeleteMemory} />} />
            <Route path="/passport" element={<Passport memories={memories} userConfig={userConfig} onViewMemory={setSelectedMemoryDetail} onAddClick={openAddModal} />} />
            <Route path="/bucket" element={<BucketList onConvertToAppointment={handleConvertBucketToAppointment} />} />
            <Route path="/timeline" element={<Timeline memories={memories} />} />
            <Route path="/settings" element={<Settings userConfig={userConfig} onUpdateUser={setUserConfig} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <AddMemoryModal 
          isOpen={isAddModalOpen} 
          onClose={() => { setIsAddModalOpen(false); setEditingMemory(null); }} 
          onAdd={handleAddMemory}
          onEdit={handleEditMemory}
          memoryToEdit={editingMemory}
        />

        <MemoryDetailModal 
          memory={selectedMemoryDetail}
          onClose={() => setSelectedMemoryDetail(null)}
          onDelete={handleDeleteMemory}
          onEdit={openEditModal}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </Router>
  );
};

export default App;
