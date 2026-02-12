
import React, { useRef } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { SharedUser } from '../types';
import { db } from '../firebase';

interface Props {
  userConfig: SharedUser;
  onUpdateUser: (config: SharedUser) => void;
}

const Settings: React.FC<Props> = ({ userConfig, onUpdateUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportHistory = async () => {
    try {
      const memoriesSnapshot = await getDocs(collection(db, 'memories'));
      const memories = memoriesSnapshot.docs.map(docSnap => docSnap.data());

      const bucketSnapshot = await getDocs(collection(db, 'bucket'));
      const bucket = bucketSnapshot.docs.map(docSnap => docSnap.data());

      const dataToExport = {
        memories,
        bucket,
        userConfig,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nuestra_historia.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar la historia', error);
      alert('Error al exportar la historia.');
    }
  };

  const importHistory = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      (async () => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);

          // Restaurar recuerdos
          if (Array.isArray(data.memories)) {
            const memoriesRef = collection(db, 'memories');
            const existingMemories = await getDocs(memoriesRef);
            await Promise.all(existingMemories.docs.map(docSnap => deleteDoc(docSnap.ref)));

            await Promise.all(
              data.memories.map((m: any) => {
                const id = m.id ?? doc(memoriesRef).id;
                const memoryWithId = { ...m, id };
                return setDoc(doc(memoriesRef, id), memoryWithId);
              })
            );
          }

          // Restaurar bucket list
          if (Array.isArray(data.bucket)) {
            const bucketRef = collection(db, 'bucket');
            const existingBucket = await getDocs(bucketRef);
            await Promise.all(existingBucket.docs.map(docSnap => deleteDoc(docSnap.ref)));

            await Promise.all(
              data.bucket.map((b: any) => {
                const id = b.id ?? doc(bucketRef).id;
                const bucketWithId = { ...b, id };
                return setDoc(doc(bucketRef, id), bucketWithId);
              })
            );
          }

          // Restaurar configuración compartida (se guardará también en Firestore vía App.tsx)
          if (data.userConfig) {
            onUpdateUser(data.userConfig);
          }

          alert('¡Historia importada! Recargando...');
          window.location.reload();
        } catch (error) {
          console.error('Error al importar la historia', error);
          alert('Error al importar.');
        }
      })();
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 flex flex-col gap-8">
      <header>
        <h2 className="text-3xl font-extrabold text-text-main mb-2">Nuestro Espacio</h2>
        <p className="text-text-muted">Configuramos la experiencia compartida.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-4 ring-primary/5">
            <span className="material-symbols-outlined text-5xl filled">celebration</span>
          </div>
          <div className="w-full space-y-4">
            <div>
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 ml-1">Fecha Especial ❤️</label>
              <input 
                type="date"
                value="2022-09-25"
                disabled
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed outline-none font-bold text-center"
              />
              <p className="text-[10px] text-primary mt-2 text-center font-bold">El mejor dia ❤️</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">sync</span>
            Copia de Seguridad
          </h3>
          <p className="text-xs text-text-muted">Descargar la historia para guardarla en otro dispositivo.</p>
          <button onClick={() => { void exportHistory(); }} className="w-full p-4 bg-gray-50 rounded-2xl font-bold flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-100">
            <span className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">download</span>Exportar</span>
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 bg-gray-50 rounded-2xl font-bold flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-100">
            <span className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">upload_file</span>Importar</span>
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={importHistory} className="hidden" accept=".json" />
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Cerrar Sesión</h3>
            <p className="text-sm text-text-muted">Proteger la privacidad al terminar.</p>
          </div>
          <button onClick={() => { sessionStorage.removeItem('is_authenticated'); window.location.reload(); }} className="px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">lock</span>Bloquear Acceso
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
