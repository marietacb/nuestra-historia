
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
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
import { db } from './firebase';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [selectedMemoryDetail, setSelectedMemoryDetail] = useState<Memory | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('is_authenticated') === 'true';
  });

  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);

  const [userConfig, setUserConfig] = useState<SharedUser>(() => {
    const saved = localStorage.getItem('love_user_config');
    return saved ? JSON.parse(saved) : OUR_ACCOUNT;
  });

  // Cargar recuerdos desde Firestore
  useEffect(() => {
    const loadMemories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'memories'));

        if (snapshot.empty) {
          // Sembrar la base de datos con los recuerdos iniciales
          await Promise.all(
            INITIAL_MEMORIES.map(memory =>
              setDoc(doc(collection(db, 'memories'), memory.id), memory)
            )
          );
          setMemories(INITIAL_MEMORIES);
        } else {
          const loaded: Memory[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data() as Memory;
            return {
              ...data,
              id: data.id ?? docSnap.id
            };
          });
          setMemories(loaded);
        }
      } catch (error) {
        // Si falla Firestore, al menos seguimos con los recuerdos iniciales en memoria
        console.error('Error al cargar recuerdos desde Firestore', error);
      }
    };

    void loadMemories();
  }, []);

  useEffect(() => {
    localStorage.setItem('love_user_config', JSON.stringify(userConfig));
  }, [userConfig]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('is_authenticated', 'true');
  };

  const handleAddMemory = (newMemory: Memory) => {
    setMemories(prev => [newMemory, ...prev]);
    // Guardar en Firestore
    void setDoc(doc(collection(db, 'memories'), newMemory.id), newMemory);
  };

  const handleEditMemory = (updatedMemory: Memory) => {
    setMemories(prev => prev.map(m => m.id === updatedMemory.id ? updatedMemory : m));
    if (selectedMemoryDetail?.id === updatedMemory.id) {
      setSelectedMemoryDetail(updatedMemory);
    }
    setEditingMemory(null);
    // Actualizar en Firestore
    void setDoc(doc(collection(db, 'memories'), updatedMemory.id), updatedMemory, { merge: true });
  };

  const handleToggleFavorite = useCallback((id: string) => {
    setMemories(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
      const updatedMemory = updated.find(m => m.id === id);
      if (updatedMemory) {
        void setDoc(doc(collection(db, 'memories'), updatedMemory.id), updatedMemory, { merge: true });
      }
      return updated;
    });
    setSelectedMemoryDetail(prev => prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev);
  }, []);

  const handleDeleteMemory = useCallback((id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    // Limpieza profunda del estado de detalle
    setSelectedMemoryDetail(prev => (prev?.id === id ? null : prev));
    void deleteDoc(doc(collection(db, 'memories'), id));
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
