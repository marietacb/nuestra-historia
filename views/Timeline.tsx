
import React, { useState, useMemo } from 'react';
import { Memory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface Props {
  memories: Memory[];
}

const Timeline: React.FC<Props> = ({ memories }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDay(null);
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDay(null);
  };
  const handleGoToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  const getDayActivities = (day: number) => {
    return memories.filter(memory => {
      const [y, m, d] = memory.date.split('-').map(Number);
      const memoryDate = new Date(y, m - 1, d);
      const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      
      if (memory.endDate) {
        const [ey, em, ed] = memory.endDate.split('-').map(Number);
        const memoryEndDate = new Date(ey, em - 1, ed);
        return checkDate >= memoryDate && checkDate <= memoryEndDate;
      }
      
      return (
        memoryDate.getFullYear() === checkDate.getFullYear() &&
        memoryDate.getMonth() === checkDate.getMonth() &&
        memoryDate.getDate() === checkDate.getDate()
      );
    });
  };

  const selectedDayActivities = useMemo(() => {
    if (selectedDay === null) return [];
    return getDayActivities(selectedDay);
  }, [selectedDay, currentMonth, memories]);

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 flex flex-col gap-8 h-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-text-main tracking-tight">Nuestro Calendario</h2>
          <p className="text-text-muted font-medium">Aquí tenemos nuestras citas organizadas en un calendario.</p>
        </div>
        <button 
          onClick={handleGoToToday}
          className="px-6 py-2.5 bg-white border border-gray-100 shadow-sm rounded-2xl font-bold text-sm text-primary hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm filled">today</span>
          Hoy
        </button>
      </header>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Calendar Card */}
        <div className="flex-1 w-full bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-50 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-white">
            <h3 className="text-2xl font-black text-text-main capitalize">
              {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="size-11 flex items-center justify-center hover:bg-accent-rose text-text-muted hover:text-primary rounded-2xl transition-all active:scale-90">
                <span className="material-symbols-outlined font-bold">chevron_left</span>
              </button>
              <button onClick={handleNextMonth} className="size-11 flex items-center justify-center hover:bg-accent-rose text-text-muted hover:text-primary rounded-2xl transition-all active:scale-90">
                <span className="material-symbols-outlined font-bold">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="p-2 md:p-4">
            <div className="grid grid-cols-7 mb-2">
              {dayLabels.map(day => (
                <div key={day} className="py-2 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100">
              {Array.from({ length: startDay(currentMonth) }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-50/30 min-h-[100px] md:min-h-[140px]"></div>
              ))}
              
              {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                const dayNum = i + 1;
                const activities = getDayActivities(dayNum);
                const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum).toDateString();
                const isSelected = selectedDay === dayNum;
                
                return (
                  <div 
                    key={dayNum} 
                    onClick={() => setSelectedDay(dayNum)}
                    className={`
                      min-h-[100px] md:min-h-[140px] p-2 bg-white flex flex-col gap-1 cursor-pointer transition-all relative group
                      ${isSelected ? 'bg-accent-rose/40 z-10' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`
                        text-xs font-black size-6 flex items-center justify-center rounded-full transition-colors
                        ${isSelected ? 'bg-primary text-white' : isToday ? 'text-primary ring-1 ring-primary' : 'text-gray-400'}
                      `}>
                        {dayNum}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide max-h-[100px]">
                      {activities.map((act) => (
                        <div 
                          key={act.id} 
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold text-white truncate shadow-sm animate-in fade-in zoom-in-95"
                          style={{ backgroundColor: CATEGORY_COLORS[act.category] || '#ec1337' }}
                          title={act.title}
                        >
                          {act.isFavorite && <span className="material-symbols-outlined text-[10px] filled">favorite</span>}
                          <span className="truncate">{act.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Sidebar */}
        <div className="w-full xl:w-96 shrink-0 flex flex-col gap-6 animate-in slide-in-from-right-8 duration-500">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-primary/5 min-h-[400px] sticky top-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">
                  Detalles del día
                </h4>
                <p className="text-lg font-black text-text-main">
                  {selectedDay 
                    ? `${selectedDay} de ${currentMonth.toLocaleDateString('es-ES', { month: 'long' })}` 
                    : 'Selecciona un día'}
                </p>
              </div>
              {selectedDayActivities.length > 0 && (
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined filled">auto_awesome</span>
                </div>
              )}
            </div>

            {selectedDayActivities.length > 0 ? (
              <div className="space-y-8">
                {selectedDayActivities.map(memory => (
                  <div key={memory.id} className="group">
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg ring-1 ring-gray-100">
                      <img src={memory.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black shadow-sm" style={{ color: CATEGORY_COLORS[memory.category] }}>
                        {memory.category.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-text-main text-lg leading-tight group-hover:text-primary transition-colors">{memory.title}</h5>
                      {memory.isFavorite && <span className="material-symbols-outlined text-primary filled text-xl">favorite</span>}
                    </div>
                    <p className="text-sm text-text-muted line-clamp-3 mt-2 italic leading-relaxed">"{memory.description}"</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {memory.location}
                      </div>
                      {memory.km && (
                         <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                          <span className="material-symbols-outlined text-sm">distance</span>
                          {memory.km} km
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <div className="size-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-5xl">calendar_today</span>
                </div>
                <p className="text-sm font-bold text-text-muted px-4">
                  {selectedDay 
                    ? "Este día no tiene ningún recuerdo :(." 
                    : "Toca cualquier día con etiqueta para ver qué pasó ese día."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
