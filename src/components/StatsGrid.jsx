import React from 'react';
import { Calendar, PawPrint, Package, CheckCircle2 } from 'lucide-react';

const StatsGrid = ({ appointments = [], patients = [], inventory = [] }) => {
  const stats = [
    {
      label: 'Citas Hoy',
      value: appointments.length,
      icon: <Calendar size={22} />,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Pacientes',
      value: patients.length,
      icon: <PawPrint size={22} />,
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Insumos',
      value: inventory.length,
      icon: <Package size={22} />,
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      label: 'Completadas',
      value: appointments.filter(a => a.status === 'Completado').length,
      icon: <CheckCircle2 size={22} />,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all duration-300">
          <div className={`${stat.lightColor} ${stat.textColor} p-4 rounded-2xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
