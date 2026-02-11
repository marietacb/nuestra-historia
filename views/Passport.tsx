
import React, { useState, useMemo } from 'react';
import { Memory, SharedUser } from '../types';

interface Props {
  memories: Memory[];
  userConfig: SharedUser;
  onViewMemory: (memory: Memory) => void;
  onAddClick: () => void;
}

const Passport: React.FC<Props> = ({ memories, userConfig, onViewMemory, onAddClick }) => {
  // 'index' para el listado de países, o el nombre del país seleccionado
  const [currentView, setCurrentView] = useState<'index' | string>('index');

  // Agrupamos los viajes por país (asumiendo formato "Ciudad, País")
  const groupedByCountry = useMemo(() => {
    const travelMemories = memories.filter(m => m.category === 'Viaje');
    const groups: Record<string, Memory[]> = {};

    travelMemories.forEach(m => {
      const parts = m.location.split(',');
      const country = parts.length > 1 ? parts[parts.length - 1].trim() : 'Otros';
      if (!groups[country]) groups[country] = [];
      groups[country].push(m);
    });

    // Ordenar memorias dentro de cada país por fecha
    Object.keys(groups).forEach(country => {
      groups[country].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return groups;
  }, [memories]);

  // Cálculo de noches totales de aventura
  const totalNights = useMemo(() => {
    return memories
      .filter(m => m.category === 'Viaje' && m.date && m.endDate)
      .reduce((acc, m) => {
        const start = new Date(m.date).getTime();
        const end = new Date(m.endDate!).getTime();
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return acc + (diff > 0 ? diff : 0);
      }, 0);
  }, [memories]);

  const countries = Object.keys(groupedByCountry).sort();
  const selectedCountryMemories = currentView !== 'index' ? groupedByCountry[currentView] : [];

  const handleCountryClick = (country: string) => {
    setCurrentView(country);
  };

  const Stamp = ({ memory, index }: { memory: Memory, index: number }) => {
    const colors = ['border-passport-blue text-passport-blue', 'border-rose-500 text-rose-500', 'border-emerald-600 text-emerald-600', 'border-purple-600 text-purple-600'];
    const shapes = ['rounded-full', 'rounded-lg', 'rounded-[2rem]', 'rounded-tr-[2rem] rounded-bl-[2rem]'];
    
    const colorClass = colors[index % colors.length];
    const shapeClass = shapes[index % shapes.length];
    const rotation = (index % 3 === 0) ? '-rotate-6' : (index % 2 === 0) ? 'rotate-3' : 'rotate-0';

    const formatDateShort = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    
    const displayDate = memory.endDate 
      ? `${formatDateShort(memory.date)} - ${formatDateShort(memory.endDate)}`
      : new Date(memory.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
      <div 
        onClick={() => onViewMemory(memory)}
        className="relative flex items-center justify-center p-4 border border-slate-200/40 rounded-2xl group cursor-pointer hover:bg-white/50 transition-all h-full"
      >
        <div className={`relative transform ${rotation} border-4 ${colorClass} p-3 ${shapeClass} flex flex-col items-center text-center stamp-texture shadow-sm group-hover:scale-110 transition-transform`}>
          <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">Entry Permit</span>
          <span className="text-xs font-black uppercase leading-none my-1">{memory.location.split(',')[0]}</span>
          <div className="h-[1.5px] w-full bg-current opacity-20 my-0.5"></div>
          <span className="text-[9px] font-bold whitespace-nowrap">{displayDate}</span>
          <span className="material-icons-round text-[10px] mt-1 opacity-40">flight_takeoff</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-full leather-bg py-8 lg:py-16 px-4 flex flex-col items-center animate-in fade-in duration-700">
      {/* Header flotante */}
      <div className="w-full max-w-6xl mb-10 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Nuestro Pasaporte</h2>
          <p className="text-white/60 text-sm font-bold tracking-wide uppercase">Visados de amor y aventura</p>
        </div>
        <div className="flex gap-4">
          {currentView !== 'index' && (
            <button 
              onClick={() => setCurrentView('index')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">menu_book</span>
              Índice
            </button>
          )}
          <button 
            onClick={onAddClick}
            className="bg-passport-blue text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-passport-blue/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-icons-round">add_location_alt</span>
            Añadir Destino
          </button>
        </div>
      </div>

      {/* El Pasaporte */}
      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row items-stretch shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden bg-white">
        
        {/* PÁGINA IZQUIERDA */}
        <div className="w-full lg:w-1/2 bg-[#fcf9f2] border-r border-slate-200 relative overflow-hidden flex flex-col min-h-[500px]">
          {/* Textura y decoración */}
          <div className="absolute inset-0 parchment-texture opacity-40 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
          
          <div className="relative z-10 p-10 flex flex-col h-full">
            {currentView === 'index' ? (
              // Vista de Identidad (Portada del Interior)
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nuestro Pasaporte</span>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Súper chulo</h3>
                  </div>
                  <div className="size-14 rounded-full border-2 border-passport-blue/20 flex items-center justify-center text-passport-blue">
                    <span className="material-icons-round text-3xl">public</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
                  <div className="shrink-0 relative">
                    <div className="w-44 h-56 bg-slate-200 rounded-lg border-4 border-white shadow-xl overflow-hidden group">
                      <img 
                        src={userConfig.avatar} 
                        className="w-full h-full object-cover grayscale contrast-125 mix-blend-multiply" 
                        alt="Avatar" 
                      />
                      <div className="absolute inset-0 bg-passport-blue/10 mix-blend-overlay"></div>
                    </div>
                    <p className="mt-4 font-serif italic text-slate-400 text-center border-b border-slate-200 pb-1">Nosotros❤️</p>
                  </div>
                  
                  <div className="flex-1 space-y-4 text-sm font-bold text-slate-700">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-2">
                      <span className="text-[9px] uppercase text-passport-blue">Titulares</span>
                      <span className="uppercase text-right">Guillem y María</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-2">
                      <span className="text-[9px] uppercase text-passport-blue">Nacionalidad</span>
                      <span className="uppercase text-right">Española</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-2">
                      <span className="text-[9px] uppercase text-passport-blue">Desde el</span>
                      <span className="uppercase text-right">25 SEP 2022</span>
                    </div>
                    <div className="pt-4">
                      <span className="text-[9px] uppercase text-passport-blue block mb-2">Código de Viajero</span>
                      <p className="font-mono text-lg text-slate-900 tracking-widest">LOVE-PASS-2509</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto opacity-20 font-mono text-[9px] leading-tight break-all">
                  {'P<GUILLEMARIA<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'}
                  <br />
                  {'PASS-2409-2509<<<<MICHICOGUAPO<<<<<<<<<<TQM'}
                </div>
              </div>
            ) : (
              // Vista de Detalle de País (Izquierda)
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4">
                <button 
                  onClick={() => setCurrentView('index')}
                  className="mb-8 text-xs font-black text-passport-blue uppercase flex items-center gap-1 hover:translate-x-1 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Volver al Índice
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                   <div className="size-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl">
                    🗺️
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">{currentView}</h3>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/50 p-6 rounded-[2rem] border border-white/80 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resumen de Destino</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="block text-2xl font-black text-slate-800">{groupedByCountry[currentView].length}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ciudades</span>
                      </div>
                      <div>
                        <span className="block text-2xl font-black text-slate-800">
                          {new Set(groupedByCountry[currentView].map(m => m.date.split('-')[0])).size}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Años</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Lugares Visitados</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(groupedByCountry[currentView].map(m => m.location.split(',')[0]))).map(city => (
                        <span key={city} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                  <span className="material-icons-round text-slate-200 text-5xl">explore</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LOMO DEL PASAPORTE */}
        <div className="hidden lg:flex w-12 h-full passport-spine items-center justify-center bg-white z-10">
          <div className="w-[1.5px] h-[95%] bg-slate-200 shadow-inner"></div>
        </div>

        {/* PÁGINA DERECHA */}
        <div className="w-full lg:w-1/2 bg-[#fcf9f2] passport-texture relative flex flex-col min-h-[500px]">
          <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
          
          <div className="p-8 flex justify-between items-center relative z-10">
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              {currentView === 'index' ? 'Visas / Destinos' : `Entradas: ${currentView}`}
            </h4>
            <span className="text-slate-300 font-bold text-[10px] uppercase">t'estimo</span>
          </div>

          <div className="flex-1 p-8 pt-0 relative z-10">
            {currentView === 'index' ? (
              // ÍNDICE DE PAÍSES
              <div className="flex flex-col gap-4 h-full">
                {countries.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {countries.map((country, idx) => (
                      <button 
                        key={country}
                        onClick={() => handleCountryClick(country)}
                        className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md hover:border-passport-blue/30 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-passport-blue/10 transition-colors">
                            📍
                          </div>
                          <div className="text-left">
                            <span className="block font-black text-slate-800 uppercase tracking-tight">{country}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{groupedByCountry[country].length} sellos</span>
                          </div>
                        </div>
                        <span className="material-icons-round text-slate-200 group-hover:text-passport-blue transition-colors">arrow_forward</span>
                      </button>
                    ))}
                    <button 
                      onClick={onAddClick}
                      className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 hover:border-passport-blue/30 hover:text-passport-blue transition-all"
                    >
                      <span className="material-symbols-outlined">add_location</span>
                      <span className="font-black uppercase text-xs tracking-widest">Añadir Nuevo País</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                    <span className="material-icons-round text-7xl mb-4">travel_explore</span>
                    <p className="font-bold text-slate-600">Tu pasaporte está vacío...</p>
                    <p className="text-xs">¡Empieza vuestra aventura!</p>
                  </div>
                )}
              </div>
            ) : (
              // SELLOS DEL PAÍS SELECCIONADO
              <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full min-h-[400px]">
                {selectedCountryMemories.slice(0, 4).map((m, idx) => (
                  <Stamp key={m.id} memory={m} index={idx} />
                ))}
                
                {/* Huecos vacíos si hay menos de 4 sellos */}
                {selectedCountryMemories.length < 4 && Array.from({ length: 4 - selectedCountryMemories.length }).map((_, i) => (
                  <div 
                    key={`empty-${i}`}
                    onClick={onAddClick}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl hover:border-passport-blue/30 hover:bg-white/50 transition-all cursor-pointer group"
                  >
                    <span className="material-icons-round text-slate-200 group-hover:text-passport-blue mb-1">add</span>
                    <span className="text-[8px] font-black text-slate-300 group-hover:text-passport-blue uppercase">Nueva Entrada</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 pt-0 flex justify-between items-center relative z-10">
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full ${currentView === 'index' ? 'bg-passport-blue w-4' : 'bg-slate-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${currentView !== 'index' ? 'bg-passport-blue w-4' : 'bg-slate-300'}`}></div>
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pág. {currentView === 'index' ? '01' : (countries.indexOf(currentView) + 2).toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Stats inferiores */}
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="size-10 bg-passport-blue rounded-full flex items-center justify-center text-white">
            <span className="material-icons-round text-sm">public</span>
          </div>
          <div>
            <span className="block text-xl font-black text-white">{countries.length}</span>
            <span className="text-[10px] font-bold text-white/50 uppercase">Países Visitados</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="size-10 bg-rose-500 rounded-full flex items-center justify-center text-white">
            <span className="material-icons-round text-sm">hotel</span>
          </div>
          <div>
            <span className="block text-xl font-black text-white">{totalNights}</span>
            <span className="text-[10px] font-bold text-white/50 uppercase">Noches de Aventura</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passport;
