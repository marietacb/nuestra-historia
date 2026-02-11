
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const TennisWidget: React.FC = () => {
  const [record, setRecord] = useState(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar récord de tenis desde Firestore
  useEffect(() => {
    const loadRecord = async () => {
      try {
        const ref = doc(db, 'meta', 'tennis');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as { record?: number };
          if (typeof data.record === 'number') {
            setRecord(data.record);
          }
        }
      } catch (error) {
        console.error('Error al cargar el récord de tenis desde Firestore', error);
      }
    };

    void loadRecord();
  }, []);

  const handleUpdateRecord = () => {
    const newCount = parseInt(inputValue, 10);
    if (!isNaN(newCount)) {
      const isNewRecord = newCount > record;
      setRecord(newCount);
      void setDoc(doc(db, 'meta', 'tennis'), { record: newCount });

      if (isNewRecord) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
      setInputValue('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-lime-400 to-lime-600 p-6 rounded-2xl shadow-xl shadow-lime-500/20 text-white flex flex-col items-center justify-between min-h-[240px] relative">
      <div className="w-full flex justify-between items-start">
        <div>
          <p className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">Tenis</p>
          <h3 className="text-xl font-black">Nuestro Récord</h3>
        </div>
        <div className="size-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-white">sports_tennis</span>
        </div>
      </div>
      
      <div className="text-center my-4">
        <span className="text-5xl font-black block tracking-tighter drop-shadow-md">{record}</span>
        <span className="text-xs font-medium text-white/70 uppercase tracking-tighter">Nuestro máximo histórico</span>
      </div>

      <div className="w-full space-y-3">
        <div className="relative">
          <input 
            type="number" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nueva marca..."
            className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold text-center"
          />
        </div>
        
        <button 
          onClick={handleUpdateRecord}
          disabled={!inputValue}
          className="w-full bg-white text-lime-600 font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all hover:bg-lime-50 disabled:opacity-50 disabled:active:scale-100"
        >
          Actualizar Nuestra Marca
        </button>
      </div>
      
      {showSuccess && (
        <div className="absolute inset-0 bg-lime-500 rounded-2xl flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-300 z-10">
          <span className="material-symbols-outlined text-5xl mb-2">workspace_premium</span>
          <h4 className="text-xl font-black">¡NUESTRO NUEVO RÉCORD!</h4>
          <p className="text-sm font-medium opacity-90">¡Lo hemos superado!</p>
        </div>
      )}

      <div className="mt-4 w-full bg-black/10 rounded-lg py-1 px-3 text-center text-[10px] font-bold uppercase">
        <span>Anotamos nuestra marca al volver de pista</span>
      </div>
    </div>
  );
};

export default TennisWidget;
