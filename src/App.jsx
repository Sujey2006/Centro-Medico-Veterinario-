import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, PawPrint, UserCircle, LogOut,
  Bell, Search, Plus, Trash2, HeartPulse, Menu, X, LogIn,
  Package, ClipboardList, ShieldCheck, TrendingUp, AlertCircle,
  CheckCircle2, Clock, ChevronRight, Activity, Zap, Star
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
  const [notification, setNotification] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Verificación de configuración para evitar pantalla en blanco en Vercel
  const isConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        syncData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [isConfigured]);

  const syncData = () => {
    const qApps = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const qPats = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
    const qInv = query(collection(db, 'inventory'), orderBy('name', 'asc'));

    onSnapshot(qApps, (s) => setAppointments(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(qPats, (s) => setPatients(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(qInv, (s) => setInventory(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notify("Bienvenido al sistema");
    } catch (error) {
      alert("Error: Acceso denegado. Revisa tu ID y Clave.");
    }
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const col = modalType === 'appointment' ? 'appointments' : (modalType === 'patient' ? 'patients' : 'inventory');
      await addDoc(collection(db, col), {
        ...data,
        createdAt: serverTimestamp(),
        status: modalType === 'appointment' ? 'Pendiente' : undefined,
        date: new Date().toLocaleDateString()
      });
      setIsModalOpen(false);
      notify("Datos guardados en la nube");
      e.target.reset();
    } catch (err) { alert("Error al guardar en Firebase"); }
  };

  const deleteItem = async (col, id) => {
    if(window.confirm("¿Seguro que deseas eliminar este registro?")) {
      await deleteDoc(doc(db, col, id));
      notify("Registro eliminado");
    }
  };

  if (!isConfigured) return <ConfigErrorView />;
  if (loading) return <LoadingView />;
  if (!user) return <LoginView email={email} setEmail={setEmail} password={password} setPassword={setPassword} onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased">

      {notification && (
        <div className="fixed top-10 right-10 z-[100] bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10">
          <Zap size={20} className="text-yellow-400 fill-yellow-400" />
          <span className="font-black text-sm uppercase">{notification}</span>
        </div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-slate-200/60 flex flex-col p-8 space-y-10 z-50 transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[#6c5ce7]">
            <div className="p-3 bg-[#f3f0ff] rounded-[1.25rem] shadow-sm"><HeartPulse size={32} strokeWidth={3} /></div>
            <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter uppercase">VetCare Pro</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Management</span>
            </div>
          </div>
          <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {[
            { id: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={20} /> },
            { id: 'appointments', label: 'Citas Hoy', icon: <Calendar size={20} /> },
            { id: 'patients', label: 'Directorio', icon: <PawPrint size={20} /> },
            { id: 'inventory', label: 'Farmacia', icon: <Package size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${
                activeTab === item.id ? 'bg-[#6c5ce7] text-white shadow-xl shadow-[#6c5ce7]/30 font-bold translate-x-1' : 'text-slate-400 hover:bg-slate-50 hover:text-[#6c5ce7]'
              }`}
            >
              {item.icon} <span className="text-sm font-semibold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => signOut(auth)} className="w-full flex items-center gap-4 p-4 text-slate-400 hover:text-red-500 rounded-3xl transition-all font-bold group border-t border-slate-100 pt-8">
          <LogOut size={20} /> <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-3 bg-white shadow-sm border border-slate-100 rounded-2xl text-[#6c5ce7]" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input type="text" placeholder="Buscar..." className="w-full pl-12 pr-6 py-3.5 bg-slate-100/50 border-none rounded-2xl focus:ring-4 focus:ring-[#6c5ce7]/10 outline-none transition-all text-sm font-semibold" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
               <ShieldCheck size={16} className="text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sincronizado Cloud</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-center font-black shadow-lg">V</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 pb-32">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeTab === 'dashboard' && <DashboardView appointments={appointments} patients={patients} inventory={inventory} setModal={setIsModalOpen} setType={setModalType} />}
            {activeTab === 'appointments' && <DataView title="Agenda de Citas" items={appointments.filter(a => a.pet?.toLowerCase().includes(searchTerm.toLowerCase()))} onDelete={(id) => deleteItem('appointments', id)} onAdd={() => {setModalType('appointment'); setIsModalOpen(true)}} />}
            {activeTab === 'patients' && <PatientsGrid patients={patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))} onDelete={(id) => deleteItem('patients', id)} onAdd={() => {setModalType('patient'); setIsModalOpen(true)}} />}
            {activeTab === 'inventory' && <InventoryGrid inventory={inventory} onDelete={(id) => deleteItem('inventory', id)} onAdd={() => {setModalType('inventory'); setIsModalOpen(true)}} />}
          </div>
        </main>
      </div>

      {isModalOpen && <Modal type={modalType} onClose={() => setIsModalOpen(false)} onSubmit={handleAddData} />}
    </div>
  );
};

// --- VIEWS ---

const DashboardView = ({ appointments, patients, inventory, setModal, setType }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 leading-none">
      <div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none tracking-tighter">Bienvenido, Dr. ✨</h1>
        <p className="text-slate-500 font-medium italic mt-4 italic leading-none opacity-60 font-bold tracking-widest">Operación Clínica en Tiempo Real</p>
      </div>
      <button onClick={() => {setType('appointment'); setModal(true)}} className="w-full md:w-auto px-10 py-5 bg-[#6c5ce7] text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#6c5ce7]/30 hover:scale-105 active:scale-95 transition-all">+ Agendar Atencion</button>
    </div>

    <StatsGrid appointments={appointments} patients={patients} inventory={inventory} />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 bg-white rounded-[3.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/20 leading-none">
          <h2 className="font-black flex items-center gap-3 text-slate-800 text-sm uppercase tracking-widest"><Clock size={20} className="text-[#6c5ce7]" /> Próximas Atenciones</h2>
          <span className="text-[10px] font-black text-[#6c5ce7] bg-[#f3f0ff] px-4 py-2 rounded-full">EN VIVO</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-100">
              {appointments.slice(0, 5).map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-8 font-black text-slate-900 text-lg uppercase tracking-tight italic">{app.pet}</td>
                  <td className="px-10 py-8 text-slate-500 font-bold uppercase text-xs">{app.service}</td>
                  <td className="px-10 py-8 text-right"><span className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black rounded-2xl border border-amber-100 uppercase tracking-widest">En espera</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-[#6c5ce7] rounded-[3.5rem] p-12 text-white shadow-2xl shadow-[#6c5ce7]/30 relative overflow-hidden group">
        <PawPrint className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <h3 className="text-3xl font-black mb-10 leading-tight leading-none italic uppercase">Acceso<br/>Clínico</h3>
        <button onClick={() => setModal(true)} className="relative w-full p-5 bg-white text-[#6c5ce7] rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Sincronizar Datos</button>
      </div>
    </div>
  </div>
);

const DataView = ({ title, items, onDelete, onAdd }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex justify-between items-center px-4">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none tracking-tighter uppercase italic leading-none font-black">{title}</h1>
      <button onClick={onAdd} className="p-6 bg-[#6c5ce7] text-white rounded-3xl shadow-2xl hover:scale-110 transition-all active:scale-95 leading-none font-bold uppercase"><Plus size={28} strokeWidth={3}/></button>
    </div>
    <div className="bg-white rounded-[3.5rem] border border-slate-200/60 shadow-sm overflow-hidden leading-none font-black font-black font-black font-black font-black font-black">
      <table className="w-full text-left leading-none font-black">
        <thead className="bg-slate-50/50 text-[11px] uppercase font-black text-slate-400 tracking-[0.3em] border-b border-slate-100">
          <tr><th className="px-12 py-8 tracking-[0.3em]">Mascota</th><th className="px-12 py-8 tracking-[0.3em]">Servicio</th><th className="px-12 py-8 text-right tracking-[0.3em]">Acción</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-black">
          {items.map(app => (
            <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-12 py-10 font-black text-slate-800 text-xl tracking-tight leading-none uppercase font-bold tracking-tight">{app.pet}</td>
              <td className="px-12 py-10 text-slate-500 font-bold leading-none uppercase text-[12px]">{app.service}</td>
              <td className="px-12 py-10 text-right flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                <button onClick={() => onDelete(app.id)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors leading-none"><Trash2 size={24}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PatientsGrid = ({ patients, onAdd, onDelete }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex justify-between items-center px-4">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none tracking-tighter italic uppercase">Mascotas</h1>
      <button onClick={onAdd} className="p-6 bg-[#6c5ce7] text-white rounded-3xl shadow-2xl hover:scale-110 transition-all font-bold uppercase leading-none font-black"><Plus size={28} strokeWidth={3}/></button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {patients.map(p => (
        <div key={p.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-2xl transition-all relative overflow-hidden font-black">
          <div className="flex items-center gap-8 font-black font-black font-black">
            <div className="w-24 h-24 bg-[#f3f0ff] text-[#6c5ce7] rounded-[2.5rem] flex items-center justify-center font-black text-3xl shadow-inner leading-none"><PawPrint size={40}/></div>
            <div className="leading-none font-black font-black font-black">
              <h3 className="font-black text-2xl text-slate-900 leading-tight mb-2 tracking-tight leading-none uppercase font-bold">{p.name}</h3>
              <p className="text-[10px] text-[#6c5ce7] font-black uppercase tracking-widest opacity-80 leading-none">{p.species}</p>
            </div>
          </div>
          <button onClick={() => onDelete(p.id)} className="text-slate-200 hover:text-rose-500 p-4 opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6 hover:bg-rose-50 rounded-2xl leading-none font-black"><Trash2 size={24}/></button>
        </div>
      ))}
    </div>
  </div>
);

const InventoryGrid = ({ inventory, onAdd, onDelete }) => (
  <div className="space-y-10 animate-in fade-in duration-500">
    <div className="flex justify-between items-center px-4">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none tracking-tighter leading-none italic uppercase font-black tracking-tight italic">Inventario</h1>
      <button onClick={onAdd} className="p-6 bg-[#6c5ce7] text-white rounded-3xl shadow-2xl hover:scale-110 transition-all font-bold uppercase leading-none font-black"><Plus size={24} strokeWidth={3}/></button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-black font-black">
      {inventory.map(item => (
        <div key={item.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-2xl transition-all h-full relative overflow-hidden font-black">
          <div className="flex justify-between items-start mb-10 leading-none font-black font-black">
             <div className="p-5 bg-slate-50 rounded-3xl text-[#6c5ce7] shadow-inner font-black"><Package size={32}/></div>
             <button onClick={() => onDelete(item.id)} className="text-slate-200 hover:text-rose-500 p-3 group-hover:opacity-100 opacity-0 hover:bg-rose-50 rounded-2xl transition-all duration-300 leading-none font-black"><Trash2 size={20}/></button>
          </div>
          <div className="leading-none font-black font-black">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 leading-none opacity-60 font-bold uppercase">Insumo</p>
            <h3 className="font-black text-2xl text-slate-800 mb-8 tracking-tight leading-tight uppercase font-bold leading-none">{item.name}</h3>
            <div className={`inline-flex items-center px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${parseInt(item.quantity) < 5 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'} font-black`}>
               Cant: {item.quantity}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Modal = ({ type, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-8 overflow-y-auto antialiased font-black">
    <div className="bg-white w-full max-w-lg rounded-[4.5rem] p-14 shadow-[0_30px_100px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300 border border-white/50 my-auto font-black leading-none">
      <div className="flex justify-between items-center mb-14 leading-none font-black">
        <div className="space-y-1 leading-none font-black font-black">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none tracking-tighter uppercase italic font-black tracking-tight">{type === 'appointment' ? 'Nueva Cita' : (type === 'patient' ? 'Nueva Mascota' : 'Nuevo Producto')}</h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-3 leading-none opacity-60 font-bold tracking-widest leading-none font-black">VetCare Cloud Engine</p>
        </div>
        <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-colors text-slate-300 font-black leading-none"><X size={32}/></button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6 font-black font-black font-black">
        {type === 'appointment' ? (
          <div className="space-y-5 leading-none font-black font-black">
            <input name="pet" placeholder="NOMBRE MASCOTA" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
            <input name="owner" placeholder="NOMBRE DUEÑO" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
            <input name="service" placeholder="¿QUÉ SERVICIO REQUIERE?" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
          </div>
        ) : type === 'patient' ? (
          <div className="space-y-5 font-black font-black font-black">
            <input name="name" placeholder="NOMBRE MASCOTA" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
            <div className="grid grid-cols-2 gap-6 leading-none font-black font-black font-black">
              <input name="species" placeholder="ESPECIE" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
              <input name="breed" placeholder="RAZA" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" />
            </div>
          </div>
        ) : (
          <div className="space-y-5 font-black font-black font-black font-black font-black">
            <input name="name" placeholder="NOMBRE PRODUCTO" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
            <input name="quantity" placeholder="STOCK INICIAL" type="number" className="w-full p-7 bg-slate-50 border border-transparent focus:border-[#6c5ce7]/30 rounded-[2rem] outline-none font-black text-slate-700 transition-all shadow-inner text-lg placeholder:text-slate-300 leading-none uppercase focus:bg-white tracking-widest font-black" required />
          </div>
        )}
        <button type="submit" className="w-full py-9 bg-[#6c5ce7] text-white font-black rounded-[2.5rem] shadow-[0_20px_50px_rgba(108,92,231,0.4)] hover:scale-[1.02] active:scale-95 transition-all text-xl mt-8 uppercase tracking-[0.2em] font-bold leading-none transform hover:-translate-y-1 font-black font-black font-black font-black font-black font-black">Sincronizar Datos</button>
      </form>
    </div>
  </div>
);

const LoginView = ({ setEmail, setPassword, onLogin }) => (
  <div className="min-h-screen bg-[#F3F0FF] flex items-center justify-center p-10 relative overflow-hidden antialiased selection:bg-[#6c5ce7]/20 leading-none font-black font-black font-black font-black">
    <div className="absolute top-[-20%] -left-[-20%] w-[800px] h-[800px] bg-[#6c5ce7]/10 rounded-full blur-[200px] animate-pulse leading-none font-black font-black font-black font-black"></div>
    <div className="absolute bottom-[-20%] -right-[-20%] w-[800px] h-[800px] bg-[#a29bfe]/10 rounded-full blur-[200px] animate-pulse duration-[5000ms] leading-none font-black font-black font-black font-black"></div>

    <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg p-20 rounded-[5.5rem] shadow-[0_50px_150px_-20px_rgba(108,92,231,0.25)] border border-white relative z-10 text-center space-y-16 animate-in fade-in zoom-in duration-1000 border border-white/50 leading-none font-black font-black font-black">
      <div className="space-y-8 leading-none font-black font-black font-black">
        <div className="bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe] w-36 h-32 rounded-[3.5rem] mx-auto flex items-center justify-center text-white shadow-2xl shadow-[#6c5ce7]/40 transform -rotate-12 transition-all hover:rotate-0 hover:scale-110 duration-700 leading-none font-black shadow-inner border border-white/20 font-black font-black font-black font-black"><HeartPulse size={80} strokeWidth={2.5} /></div>
        <div className="space-y-2 leading-none font-black font-black font-black font-black font-black">
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2 tracking-tighter leading-none italic uppercase leading-none font-black tracking-tight leading-none font-black uppercase font-black font-black font-black">VETCARE <span className="text-[#6c5ce7]">PRO</span></h1>
            <p className="text-slate-400 font-black uppercase text-[12px] font-bold tracking-[0.6em] mt-10 leading-none opacity-60 font-bold leading-none select-none tracking-widest font-black font-black font-black font-black leading-none font-black font-black font-black font-black font-black font-black">Management System v5.0</p>
        </div>
      </div>
      <form onSubmit={onLogin} className="space-y-8 leading-none font-black font-black font-black font-black font-black font-black font-black font-black">
        <div className="space-y-4 leading-none font-black font-black font-black font-black font-black font-black font-black font-black font-black">
            <input type="email" placeholder="ADMIN USER ID" onChange={(e) => setEmail(e.target.value)} className="w-full p-8 bg-slate-100/50 border border-transparent focus:border-[#6c5ce7]/20 rounded-[3rem] outline-none transition-all font-black text-slate-700 shadow-inner text-center text-xl placeholder:text-slate-300 leading-none uppercase tracking-widest focus:bg-white font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black" required />
            <input type="password" placeholder="ACCESS KEY" onChange={(e) => setPassword(e.target.value)} className="w-full p-8 bg-slate-100/50 border border-transparent focus:border-[#6c5ce7]/20 rounded-[3rem] outline-none transition-all font-black text-slate-700 shadow-inner text-center text-xl placeholder:text-slate-300 leading-none uppercase tracking-widest focus:bg-white font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black" required />
        </div>
        <button className="w-full bg-[#6c5ce7] text-white font-black py-9 rounded-[3rem] shadow-[0_20px_60px_rgba(108,92,231,0.4)] hover:bg-[#5b4bc4] hover:shadow-2xl transition-all text-sm uppercase tracking-[0.4em] active:scale-95 leading-none font-bold transform hover:-translate-y-1 font-black font-black font-black leading-none font-black font-black font-black font-black font-black font-black">Desbloquear Sistema</button>
      </form>
      <div className="pt-8 leading-none font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black font-black"><div className="inline-flex items-center gap-3 bg-white/50 px-8 py-5 rounded-full border border-slate-100 shadow-sm transition-all hover:scale-105 leading-none font-black font-black font-black font-black font-black font-black font-black font-black font-black"><ShieldCheck size={24} className="text-emerald-500" /> <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest font-bold tracking-[0.2em] leading-none uppercase tracking-widest font-black font-black font-black font-black font-black font-black font-black font-black">Protocolo de seguridad activo</span></div></div>
    </div>
  </div>
);

const ConfigErrorView = () => (
  <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 text-center leading-none font-black font-black">
    <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-rose-100 font-black font-black font-black font-black">
      <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-3xl mx-auto flex items-center justify-center mb-8 font-black font-black font-black"><AlertCircle size={40} /></div>
      <h2 className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tighter leading-none font-black">Error de Configuración</h2>
      <p className="text-slate-500 font-bold mb-8 leading-relaxed uppercase text-xs leading-none font-black font-black">Para ver tu página en Vercel, debes agregar las variables de entorno en el panel de configuración de tu proyecto.</p>
      <div className="text-left bg-slate-50 p-6 rounded-2xl font-mono text-[10px] text-slate-400 font-black leading-none font-black">
        <p>1. Ve a Vercel Settings</p>
        <p>2. Environment Variables</p>
        <p>3. Agrega VITE_FIREBASE_API_KEY, etc.</p>
      </div>
    </div>
  </div>
);

const LoadingView = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 leading-none font-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6c5ce7] font-black font-black"></div>
  </div>
);

export default App;
