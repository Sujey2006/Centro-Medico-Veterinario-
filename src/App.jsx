import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, PawPrint, UserCircle, LogOut,
  Bell, Search, Plus, Trash2, HeartPulse, Menu, X, LogIn,
  Scissors, ChevronRight, Filter, Clock, CheckCircle2, MoreHorizontal,
  Package, ClipboardList, ShieldCheck, TrendingUp, AlertCircle, FileText,
  Activity, Star, Zap, Droplets, Sparkles, Wand2
} from 'lucide-react';
import {
  auth, db, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from './services/firebaseService';
import {
  collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import StatsGrid from './components/StatsGrid';

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('appointment');
  const [searchTerm, setSearchTerm] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sincronización Global con Cloud Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const qApps = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
        const qPats = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
        const qInv = query(collection(db, 'inventory'), orderBy('name', 'asc'));

        onSnapshot(qApps, (s) => setAppointments(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        onSnapshot(qPats, (s) => setPatients(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        onSnapshot(qInv, (s) => setInventory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Acceso Denegado: Revisa tus credenciales de administrador.");
    }
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const colName = modalType === 'appointment' ? 'appointments' : (modalType === 'patient' ? 'patients' : 'inventory');
      await addDoc(collection(db, colName), {
        ...data,
        createdAt: serverTimestamp(),
        status: modalType === 'appointment' ? 'Pendiente' : undefined,
        date: modalType === 'appointment' ? new Date().toLocaleDateString() : undefined
      });
      setIsModalOpen(false);
      e.target.reset();
    } catch (err) { alert("Error de sincronización con la nube."); }
  };

  const updateAppStatus = async (id, status) => {
    await updateDoc(doc(db, 'appointments', id), { status });
  };

  if (!user) return <LoginView email={email} setEmail={setEmail} password={password} setPassword={setPassword} onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-[#6c5ce7]/10 antialiased">

      {/* Sidebar Móvil Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar - Pro Design */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-slate-100 flex flex-col p-8 space-y-10 z-[70] transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4 text-[#6c5ce7]">
            <div className="p-3 bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] rounded-2xl shadow-xl shadow-indigo-100 text-white leading-none transform -rotate-3 transition-transform hover:rotate-0 duration-500"><HeartPulse size={32} strokeWidth={2.5} /></div>
            <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">VETCARE</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1 italic leading-none font-bold uppercase tracking-widest">Enterprise</span>
            </div>
          </div>
          <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Centro de Mando', icon: <LayoutDashboard size={20} /> },
            { id: 'appointments', label: 'Agenda y Estética', icon: <Scissors size={20} /> },
            { id: 'patients', label: 'Directorio Médico', icon: <PawPrint size={20} /> },
            { id: 'inventory', label: 'Farmacia / Stock', icon: <Package size={20} /> },
            { id: 'history', label: 'Historiales', icon: <ClipboardList size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 ${
                activeTab === item.id ? 'bg-[#6c5ce7] text-white shadow-2xl shadow-[#6c5ce7]/40 font-bold translate-x-2' : 'text-slate-400 hover:bg-slate-50 hover:text-[#6c5ce7]'
              }`}
            >
              {item.icon} <span className="text-sm font-semibold tracking-tight leading-none">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => signOut(auth)} className="w-full flex items-center gap-5 p-4 text-slate-400 hover:text-red-500 rounded-3xl transition-all font-bold group border-t border-slate-50 pt-8">
          <div className="p-2 group-hover:bg-red-50 rounded-lg transition-colors"><LogOut size={20} /></div>
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white/50 backdrop-blur-2xl border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-3 bg-white shadow-sm border border-slate-100 rounded-2xl text-[#6c5ce7]" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="relative w-96 hidden md:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6c5ce7] transition-colors" size={20} />
              <input
                type="text"
                placeholder="Buscar paciente, dueño o registro médico..."
                className="w-full pl-12 pr-6 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-4 focus:ring-[#6c5ce7]/5 outline-none transition-all text-sm font-semibold placeholder:text-slate-400"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
               <Activity size={14} className="animate-pulse" /> Sincronizado
            </div>
            <div className="relative p-3 bg-white shadow-sm border border-slate-100 rounded-2xl text-slate-400 cursor-pointer hover:scale-105 transition-all">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#6c5ce7] rounded-full border-2 border-white shadow-sm"></span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-center font-black shadow-lg">V</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 pb-32 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-12">
            {activeTab === 'dashboard' && <DashboardView appointments={appointments} patients={patients} inventory={inventory} setModal={setIsModalOpen} setType={setModalType} onUpdate={updateAppStatus} />}
            {activeTab === 'appointments' && <AppointmentsView appointments={appointments.filter(a => a.pet?.toLowerCase().includes(searchTerm.toLowerCase()))} setModal={setIsModalOpen} setType={setModalType} onDelete={(id) => deleteDoc(doc(db, 'appointments', id))} onUpdate={updateAppStatus} />}
            {activeTab === 'patients' && <PatientsView patients={patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))} setModal={setIsModalOpen} setType={setModalType} onDelete={(id) => deleteDoc(doc(db, 'patients', id))} />}
            {activeTab === 'inventory' && <InventoryView inventory={inventory} setModal={setIsModalOpen} setType={setModalType} onDelete={(id) => deleteDoc(doc(db, 'inventory', id))} />}
            {activeTab === 'history' && <HistoryView appointments={appointments.filter(a => a.status === 'Completado')} />}
          </div>
        </main>
      </div>

      {/* Modern Modal System */}
      {isModalOpen && <Modal type={modalType} onClose={() => setIsModalOpen(false)} onSubmit={handleAddData} />}
    </div>
  );
};

// --- SUB-VIEWS ---

const DashboardView = ({ appointments, patients, inventory, setModal, setType, onUpdate }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      <div className="space-y-3">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none tracking-tighter leading-none">Buen día, Dr. ✨</h1>
        <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em]">Operación Médica y Estética</p>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <button onClick={() => {setType('patient'); setModal(true)}} className="flex-1 md:flex-none px-8 py-5 bg-white border border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95 leading-none">Registrar Mascota</button>
        <button onClick={() => {setType('appointment'); setModal(true)}} className="flex-1 md:flex-none px-8 py-5 bg-[#6c5ce7] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#6c5ce7]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 leading-none">
          <Plus size={20} strokeWidth={3}/> Agendar Cita
        </button>
      </div>
    </div>

    <StatsGrid appointments={appointments} patients={patients} inventory={inventory} />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
          <h2 className="font-black flex items-center gap-3 text-slate-800 text-sm uppercase tracking-widest leading-none tracking-wider font-bold uppercase"><Clock size={20} className="text-[#6c5ce7]" /> Próximas Atenciones</h2>
          <span className="text-[10px] font-black text-[#6c5ce7] bg-[#f3f0ff] px-4 py-2 rounded-full border border-[#e0d7ff] uppercase">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {appointments.length > 0 ? appointments.slice(0, 5).map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group leading-none">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#f3f0ff] to-[#e0d7ff] text-[#6c5ce7] rounded-2xl flex items-center justify-center font-black text-xl shadow-inner leading-none">{app.pet?.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-tight mb-1">{app.pet}</p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">{app.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <p className="text-sm text-slate-500 font-bold leading-tight flex items-center gap-2 leading-none uppercase text-[10px]">
                        {app.service?.includes('Pelu') ? <Scissors size={14} className="text-[#6c5ce7]"/> : <HeartPulse size={14} className="text-[#6c5ce7]"/>}
                        {app.service}
                     </p>
                  </td>
                  <td className="px-10 py-8 text-right leading-none">
                    <button onClick={() => onUpdate(app.id, 'Completado')} className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm leading-none"><CheckCircle2 size={20}/></button>
                  </td>
                </tr>
              )) : (
                <tr><td className="p-24 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic tracking-[0.2em]">No hay atenciones programadas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#6c5ce7] rounded-[3.5rem] p-12 text-white shadow-2xl shadow-[#6c5ce7]/30 relative overflow-hidden group">
        <Sparkles className="absolute -right-10 -top-10 w-56 h-56 opacity-10 rotate-12 transition-transform duration-1000 group-hover:rotate-45" />
        <h3 className="text-2xl font-black mb-12 leading-tight uppercase italic tracking-tighter">Servicios de<br/>Estética</h3>
        <div className="space-y-4 relative leading-none">
             <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex justify-between items-center transition-all hover:bg-white/20 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl"><Droplets size={20}/></div>
                  <div><p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Baños Hoy</p><p className="font-black text-2xl leading-none">08</p></div>
                </div>
                <ChevronRight className="opacity-40" />
             </div>
             <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex justify-between items-center transition-all hover:bg-white/20 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl"><Scissors size={20}/></div>
                  <div><p className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Cortes Hoy</p><p className="font-black text-2xl leading-none">05</p></div>
                </div>
                <ChevronRight className="opacity-40" />
             </div>
        </div>
      </div>
    </div>
  </div>
);

const HistoryView = ({ appointments }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-10 tracking-tighter leading-none">Historial Clínico</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {appointments.length > 0 ? appointments.map(record => (
        <div key={record.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-200/60 shadow-sm space-y-8 hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-[#6c5ce7] shadow-inner group-hover:scale-110 transition-transform"><FileText size={28}/></div>
                <div>
                   <h3 className="font-black text-2xl text-slate-900 leading-none mb-2 tracking-tight uppercase leading-none">{record.pet}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Fecha Atencion: {record.date}</p>
                </div>
             </div>
             <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest leading-none">Completado</span>
          </div>
          <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50 shadow-inner">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 leading-none tracking-wider font-bold">Diagnóstico / Procedimiento</p>
             <p className="text-slate-600 font-bold text-lg leading-relaxed italic">"{record.service}"</p>
          </div>
        </div>
      )) : (
        <div className="col-span-full p-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-200">
           <HeartPulse size={48} className="text-slate-100 mx-auto mb-4" />
           <p className="text-slate-300 font-black uppercase tracking-widest text-sm italic tracking-[0.2em] leading-none">Sin registros de atencion</p>
        </div>
      )}
    </div>
  </div>
);

const AppointmentsView = ({ appointments, setModal, setType, onDelete, onUpdate }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex justify-between items-center px-4">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none tracking-tighter leading-none italic uppercase">Agenda General</h1>
      <button onClick={() => {setType('appointment'); setModal(true)}} className="p-6 bg-[#6c5ce7] text-white rounded-3xl shadow-2xl shadow-[#6c5ce7]/30 hover:scale-110 transition-all active:scale-95 leading-none font-bold uppercase"><Plus size={28} strokeWidth={3}/></button>
    </div>
    <div className="bg-white rounded-[3.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[11px] uppercase font-black text-slate-400 tracking-[0.3em] border-b border-slate-100">
          <tr><th className="px-12 py-8 tracking-[0.3em]">Mascota</th><th className="px-12 py-8 tracking-[0.3em]">Servicio</th><th className="px-12 py-8 tracking-[0.3em]">Estado</th><th className="px-12 py-8 text-right tracking-[0.3em]">Accion</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {appointments.map(app => (
            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-12 py-10 font-black text-slate-800 text-xl tracking-tight leading-none uppercase font-bold tracking-tight">{app.pet}</td>
              <td className="px-12 py-10 text-slate-500 font-bold leading-none uppercase text-[12px]">{app.service}</td>
              <td className="px-12 py-10 leading-none tracking-none italic">
                <span className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest ${app.status === 'Completado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{app.status || 'Pendiente'}</span>
              </td>
              <td className="px-12 py-10 text-right flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                {app.status !== 'Completado' && <button onClick={() => onUpdate(app.id, 'Completado')} className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-colors leading-none"><CheckCircle2 size={24}/></button>}
                <button onClick={() => onDelete(app.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors leading-none"><Trash2 size={24}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PatientsView = ({ patients, setModal, setType, onDelete }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex justify-between items-center px-4 leading-none">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none tracking-tighter uppercase italic">Mascotas</h1>
      <button onClick={() => {setType('patient'); setModal(true)}} className="p-6 bg-[#6c5ce7] text-white rounded-3xl shadow-2xl hover:scale-110 transition-all active:scale-95 leading-none font-bold uppercase"><Plus size={28} strokeWidth={3}/></button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {patients.map(p => (
        <div key={p.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-200/60 shadow-sm flex items-center justify-between group hover:border-[#6c5ce7]/40 hover:shadow-2xl transition-all relative overflow-hidden">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-[#f3f0ff] text-[#6c5ce7] rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-inner leading-none"><PawPrint size={40}/></div>
            <div className="leading-none">
              <h3 className="font-black text-2xl text-slate-800 leading-tight mb-2 tracking-tight leading-none uppercase font-bold">{p.name}</h3>
              <p className="text-[10px] text-[#6c5ce7] font-black uppercase tracking-widest opacity-80 leading-none">{p.species} • {p.breed || 'N/A'}</p>
            </div>
          </div>
          <button onClick={() => onDelete(p.id)} className="text-slate-200 hover:text-rose-500 p-4 opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6 hover:bg-rose-50 rounded-2xl leading-none"><Trash2 size={24}/></button>
        </div>
      ))}
    </div>
  </div>
);

const InventoryView = ({ inventory, setModal, setType, onDelete }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex justify-between items-center px-4 leading-none">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none tracking-tighter leading-none uppercase italic">Inventario</h1>
      <button onClick={() => {setType('inventory'); setModal(true)}} className="p-6 bg-[#6c5ce7] text-white rounded-3xl shadow-2xl hover:scale-110 transition-all active:scale-95 leading-none font-bold uppercase"><Plus size={24} strokeWidth={3}/></button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {inventory.map(item => (
        <div key={item.id} className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm flex flex-col justify-between group hover:shadow-2xl transition-all h-full relative overflow-hidden leading-none">
          <div className="flex justify-between items-start mb-10 leading-none">
             <div className="p-5 bg-slate-50 rounded-3xl text-[#6c5ce7] shadow-inner leading-none"><Package size={32}/></div>
             <button onClick={() => onDelete(item.id)} className="text-slate-200 hover:text-rose-500 transition-all p-3 group-hover:opacity-100 opacity-0 hover:bg-rose-50 rounded-2xl transition-all duration-300 leading-none"><Trash2 size={20}/></button>
          </div>
          <div className="leading-none">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none opacity-60 font-bold uppercase">Insumo</p>
            <h3 className="font-black text-2xl text-slate-800 mb-8 tracking-tight leading-tight uppercase font-bold leading-none">{item.name}</h3>
            <div className={`inline-flex items-center px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${parseInt(item.quantity) < 5 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'} leading-none`}>
               Stock: {item.quantity}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Modal = ({ type, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-8 overflow-y-auto antialiased">
    <div className="bg-white w-full max-w-lg rounded-[4.5rem] p-14 shadow-[0_30px_100px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300 border border-white/50 my-auto">
      <div className="flex justify-between items-center mb-14 leading-none">
        <div className="space-y-1 leading-none">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none tracking-tighter uppercase italic leading-none font-black tracking-tight">{type === 'appointment' ? 'Nueva Cita' : (type === 'patient' ? 'Nueva Mascota' : 'Nuevo Producto')}</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-4 leading-none opacity-60 font-bold tracking-widest leading-none">VetCare Professional Engine</p>
        </div>
        <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-colors text-slate-300 leading-none"><X size={32}/></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6 leading-none">
        {type === 'appointment' ? (
          <div className="space-y-5 leading-none">
            <input name="pet" placeholder="NOMBRE DE LA MASCOTA" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
            <input name="owner" placeholder="NOMBRE DEL DUEÑO" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
            <input name="service" placeholder="MOTIVO O SERVICIO" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
          </div>
        ) : type === 'patient' ? (
          <div className="space-y-5 leading-none">
            <input name="name" placeholder="NOMBRE MASCOTA" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
            <div className="grid grid-cols-2 gap-6 leading-none">
              <input name="species" placeholder="ESPECIE" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
              <input name="breed" placeholder="RAZA" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" />
            </div>
          </div>
        ) : (
          <div className="space-y-5 leading-none">
            <input name="name" placeholder="NOMBRE DEL PRODUCTO" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
            <input name="quantity" placeholder="CANTIDAD INICIAL" type="number" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest" required />
          </div>
        )}
        <button type="submit" className="w-full py-9 bg-[#6c5ce7] text-white font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(108,92,231,0.4)] hover:scale-[1.02] active:scale-95 transition-all text-xl mt-8 uppercase tracking-[0.2em] font-bold leading-none transform hover:-translate-y-1">Sincronizar Cloud</button>
      </form>
    </div>
  </div>
);

const LoginView = ({ setEmail, setPassword, onLogin }) => (
  <div className="min-h-screen bg-[#F3F0FF] flex items-center justify-center p-10 relative overflow-hidden antialiased selection:bg-[#6c5ce7]/20">
    <div className="absolute top-[-20%] -left-[-20%] w-[800px] h-[800px] bg-[#6c5ce7]/10 rounded-full blur-[200px] animate-pulse leading-none"></div>
    <div className="absolute bottom-[-20%] -right-[-20%] w-[800px] h-[800px] bg-[#a29bfe]/10 rounded-full blur-[200px] animate-pulse duration-[5000ms] leading-none"></div>

    <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg p-20 rounded-[5.5rem] shadow-[0_50px_150px_-20px_rgba(108,92,231,0.25)] border border-white relative z-10 text-center space-y-16 animate-in fade-in zoom-in duration-1000 border border-white/50 leading-none">
      <div className="space-y-8 leading-none">
        <div className="bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] w-36 h-32 rounded-[3.5rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-[#6c5ce7]/40 transform -rotate-12 transition-all hover:rotate-0 hover:scale-110 duration-700 leading-none font-black shadow-inner border border-white/20"><HeartPulse size={80} strokeWidth={2.5} /></div>
        <div className="space-y-2 leading-none">
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2 tracking-tighter leading-none italic uppercase leading-none font-black tracking-tight">VETCARE <span className="text-[#6c5ce7]">PRO</span></h1>
            <p className="text-slate-400 font-black uppercase text-[12px] font-bold tracking-[0.6em] mt-8 leading-none opacity-60 font-bold leading-none select-none tracking-widest">Management OS v5.0</p>
        </div>
      </div>
      <form onSubmit={onLogin} className="space-y-8 leading-none">
        <div className="space-y-4 leading-none">
            <input type="email" placeholder="ADMIN ID" onChange={(e) => setEmail(e.target.value)} className="w-full p-8 bg-slate-100/50 border border-transparent focus:border-[#6c5ce7]/20 rounded-[3rem] outline-none transition-all font-black text-slate-700 shadow-inner text-center text-xl placeholder:text-slate-300 leading-none uppercase tracking-widest focus:bg-white" required />
            <input type="password" placeholder="ACCESS KEY" onChange={(e) => setPassword(e.target.value)} className="w-full p-8 bg-slate-100/50 border border-transparent focus:border-[#6c5ce7]/20 rounded-[3rem] outline-none transition-all font-black text-slate-700 shadow-inner text-center text-xl placeholder:text-slate-300 leading-none uppercase tracking-widest focus:bg-white" required />
        </div>
        <button className="w-full bg-[#6c5ce7] text-white font-black py-9 rounded-[3rem] shadow-[0_20px_60px_rgba(108,92,231,0.4)] hover:bg-[#5b4bc4] hover:shadow-2xl transition-all text-sm uppercase tracking-[0.4em] active:scale-95 leading-none font-bold transform hover:-translate-y-1">Desbloquear Sistema</button>
      </form>
      <div className="pt-8 leading-none"><div className="inline-flex items-center gap-3 bg-white/50 px-8 py-5 rounded-full border border-slate-100 shadow-sm transition-all hover:scale-105 leading-none"><ShieldCheck size={24} className="text-emerald-500" /> <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest font-bold tracking-[0.2em] leading-none uppercase tracking-widest">Protocolo de seguridad activo</span></div></div>
    </div>
  </div>
);

export default App;
