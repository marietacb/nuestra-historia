
import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import TennisWidget from '../components/TennisWidget';
import { Memory, SharedUser } from '../types';

interface DashboardProps {
  memories: Memory[];
  userConfig: SharedUser;
  onViewMemory: (memory: Memory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ memories, userConfig, onViewMemory }) => {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  const { pastMemories, futureMemories, nextEvent } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const sorted = [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = sorted.filter(m => new Date(m.date) <= now).reverse();
    const future = sorted.filter(m => new Date(m.date) > now);
    return { pastMemories: past, futureMemories: future, nextEvent: future[0] || null };
  }, [memories]);

  const daysToNext25 = useMemo(() => {
    const now = new Date();
    let next25 = new Date(now.getFullYear(), now.getMonth(), 25);
    if (now.getDate() >= 25) {
      next25 = new Date(now.getFullYear(), now.getMonth() + 1, 25);
    }
    const diff = next25.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, []);

  useEffect(() => {
    if (!nextEvent) return;
    const timer = setInterval(() => {
      const target = new Date(nextEvent.date).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ d: d.toString().padStart(2, '0'), h: h.toString().padStart(2, '0'), m: m.toString().padStart(2, '0'), s: s.toString().padStart(2, '0') });
    }, 1000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  const timeTogether = useMemo(() => {
    const start = new Date(userConfig.anniversary);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();
    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  }, [userConfig.anniversary]);

  const chartData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    return months.map((month, index) => {
      const count = memories.filter(m => {
        const d = new Date(m.date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      }).length;
      return { name: month, count };
    });
  }, [memories]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight mb-2">Nuestra Historia</h2>
          <p className="text-text-muted text-lg">Cada día es un regalo junto a tu. Feliz San Valentín.❤️❤️❤️</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Banner */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="shrink-0 size-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary relative z-10 ring-8 ring-primary/5">
            <span className="material-symbols-outlined text-5xl filled">celebration</span>
          </div>
          <div className="flex-1 text-center md:text-left relative z-10">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Juntos desde el 25/09/2022</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10">
              <div className="flex flex-col"><span className="text-4xl md:text-5xl font-black text-text-main tracking-tighter">{timeTogether.years}</span><span className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Años</span></div>
              <div className="flex flex-col"><span className="text-4xl md:text-5xl font-black text-text-main tracking-tighter">{timeTogether.months}</span><span className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Meses</span></div>
              <div className="flex flex-col"><span className="text-4xl md:text-5xl font-black text-text-main tracking-tighter">{timeTogether.days}</span><span className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Días</span></div>
            </div>
          </div>
        </div>

        {/* Mesiversario Card */}
        <div className="lg:col-span-4 bg-primary p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="material-symbols-outlined text-6xl">favorite</span>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-white/80">Próximo Mesiversario</p>
          <div className="text-5xl font-black mb-1">{daysToNext25}</div>
          <p className="text-sm font-bold opacity-90">días para el 25</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Citas Totales" value={pastMemories.length.toString()} trend={`${futureMemories.length} próximos planes`} icon="event_available" />
        <StatCard label="Km de Viaje" value={memories.reduce((acc, curr) => acc + (curr.km || 0), 0).toLocaleString()} icon="flight_takeoff" />
        <StatCard label="Cine Juntos (un montón)" value={memories.filter(m => m.category === 'Cine').length.toString()} icon="movie" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-light p-8 rounded-[2rem] shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-xl font-bold text-text-main mb-8">Frecuencia de citas</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#896168' }} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#ec1337' : '#fce7ea'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={`p-8 rounded-[2rem] shadow-xl relative overflow-hidden ${nextEvent ? 'bg-white border border-gray-100' : 'bg-gray-100 text-gray-400'}`}>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Cuenta Atrás</h4>
            <h3 className="text-2xl font-black text-text-main mb-6">{nextEvent ? nextEvent.title : 'Sin planes...'}</h3>
            {nextEvent && (
              <div className="grid grid-cols-4 gap-2 text-center">
                {[{ v: timeLeft.d, l: 'D' }, { v: timeLeft.h, l: 'H' }, { v: timeLeft.m, l: 'M' }, { v: timeLeft.s, l: 'S' }].map(t => (
                  <div key={t.l} className="bg-accent-rose rounded-2xl py-3">
                    <span className="block text-xl font-black text-primary">{t.v}</span>
                    <span className="text-[8px] font-bold uppercase text-primary/60">{t.l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <TennisWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
