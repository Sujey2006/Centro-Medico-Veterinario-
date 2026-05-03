import React from 'react';
import { Calendar, PawPrint, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsGrid = ({ appointments = [], patients = [], inventory = [] }) => {
  const stats = [
    {
      label: 'Citas Registradas',
      value: appointments.length,
      icon: <Calendar size={22} />,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      trend: '+4% vs ayer'
    },
    {
      label: 'Pacientes Totales',
      value: patients.length,
      icon: <PawPrint size={22} />,
      color: 'bg-[#6c5ce7]',
      lightColor: 'bg-[#f3f0ff]',
      textColor: 'text-[#6c5ce7]',
      trend: 'Creciendo'
    },
    {
      label: 'Bajo Stock',
      value: inventory.filter(item => parseInt(item.quantity) < 5).length,
      icon: <AlertTriangle size={22} />,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      trend: 'Revisar'
    },
    {
      label: 'Completadas',
      value: appointments.filter(a => a.status === 'Completado').length,
      icon: <CheckCircle2 size={22} />,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      trend: 'Hoy'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:shadow-[#6c5ce7]/5 transition-all duration-500 group cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.lightColor} ${stat.textColor} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.lightColor} ${stat.textColor} uppercase tracking-tighter`}>
              {stat.trend}
            </span>
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
