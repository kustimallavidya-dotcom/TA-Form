import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, TaEntry, COLUMNS } from './types';
import { PrintLayout } from './components/PrintLayout';
import { 
  Plus, Trash2, Printer, ChevronLeft, 
  Settings, FileText, X, Copy, 
  Calendar, MapPin, IndianRupee, TrendingUp, ChevronRight, Save
} from 'lucide-react';

// --- HELPER COMPONENTS ---

const Card = ({ children, className = "", onClick }: any) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

// --- VIEWS ---

// 1. Splash Screen
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-railway-900 to-railway-700 flex flex-col items-center justify-center text-white z-50">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse ring-4 ring-white/20">
        <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/4/45/Indian_Railways_logo.svg/1200px-Indian_Railways_logo.svg.png" 
            alt="IR Logo" 
            className="w-16 h-16 object-contain opacity-90 drop-shadow-lg"
            onError={(e) => (e.currentTarget.style.display = 'none')} 
        />
        {/* Fallback Icon if Image fails */}
        <Printer size={40} className="absolute opacity-80" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Railway TA Journal</h1>
      <p className="text-railway-100 text-sm mt-1 opacity-80">Secure • Official • Easy</p>
      
      <div className="absolute bottom-8 flex flex-col items-center gap-2">
         <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-amber-400 animate-[shimmer_1s_infinite]"></div>
         </div>
         <p className="text-[10px] text-white/40 uppercase tracking-widest">Designed by Milind Manugade</p>
      </div>
    </div>
  );
};

// 2. Profile Editor (Modernized)
const ProfileEditor = ({ onSave, initialData, onCancel }: { onSave: (p: UserProfile) => void, initialData?: UserProfile, onCancel?: () => void }) => {
  const [form, setForm] = useState<UserProfile>(initialData || {
    id: uuidv4(),
    name: '', designation: '', station: '', payLevel: '', basicPay: '', pfNumber: '', headquarters: '', branch: '', division: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <div className="bg-white p-4 shadow-sm sticky top-0 z-10 border-b">
         <h2 className="text-lg font-bold text-railway-900">{initialData ? 'Edit Profile' : 'Setup Profile'}</h2>
         <p className="text-xs text-gray-500">Details for auto-filling the header</p>
       </div>
       
       <div className="p-4 space-y-4 pb-24 max-w-lg mx-auto w-full">
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-railway-50 flex items-center justify-center text-railway-700">
                    <Settings size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-gray-800">Personal Details</h3>
                    <p className="text-xs text-gray-500">Printed on top of every page</p>
                </div>
             </div>
             <Input label="Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Milind D. Manugade" />
             <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. PMA" />
             <Input label="Station" name="station" value={form.station} onChange={handleChange} />
         </div>

         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-800 border-b pb-2">Pay & Location</h3>
            <div className="grid grid-cols-2 gap-3">
                <Input label="Pay Level" name="payLevel" value={form.payLevel} onChange={handleChange} placeholder="Level-2" />
                <Input label="Basic Pay" name="basicPay" value={form.basicPay} onChange={handleChange} placeholder="24500" />
            </div>
            <Input label="PF Number" name="pfNumber" value={form.pfNumber} onChange={handleChange} />
            <Input label="Headquarters" name="headquarters" value={form.headquarters} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-3">
                <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} placeholder="TFC/OPTG" />
                <Input label="Division" name="division" value={form.division} onChange={handleChange} placeholder="PUNE" />
            </div>
         </div>
       </div>

       <div className="fixed bottom-0 inset-x-0 bg-white p-4 border-t flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {onCancel && <button onClick={onCancel} className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium">Cancel</button>}
         <button onClick={() => onSave(form)} className="flex-1 py-3 bg-railway-900 text-white rounded-lg font-bold shadow-md active:scale-95 transition-transform">
            Save & Continue
         </button>
       </div>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
    <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-railway-500 outline-none text-sm transition-all" {...props} />
  </div>
);

// 3. Entry Editor Modal (Sheet Style)
const EntryEditor = ({ onSave, onCancel, initialData }: { onSave: (e: TaEntry) => void, onCancel: () => void, initialData?: Partial<TaEntry> }) => {
    const [form, setForm] = useState<TaEntry>({
        id: initialData?.id || uuidv4(),
        date: initialData?.date || new Date().toISOString().split('T')[0],
        trainNo: initialData?.trainNo || '',
        departureTime: initialData?.departureTime || '',
        arrivalTime: initialData?.arrivalTime || '',
        fromStation: initialData?.fromStation || '',
        toStation: initialData?.toStation || '',
        kms: initialData?.kms || '',
        dayNightPercent: initialData?.dayNightPercent || '100%',
        purpose: initialData?.purpose || '',
        rate: initialData?.rate || '625',
        conveyanceDistance: initialData?.conveyanceDistance || '',
        reference: initialData?.reference || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white w-full sm:w-[500px] h-[95vh] sm:h-auto rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden">
                
                {/* Header */}
                <div className="bg-railway-50 px-4 py-3 border-b flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-railway-900">Add Journey Details</h3>
                        <p className="text-xs text-gray-500">Daily Movement</p>
                    </div>
                    <button onClick={onCancel} className="p-2 bg-white rounded-full text-gray-500 hover:bg-gray-100"><X size={20} /></button>
                </div>
                
                {/* Scrollable Form */}
                <div className="flex-grow overflow-y-auto p-4 space-y-5">
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <Input type="date" label="Date of Journey" name="date" value={form.date} onChange={handleChange} />
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase border-b pb-1">Train & Time</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <Input label="Train No" name="trainNo" value={form.trainNo} onChange={handleChange} placeholder="XXXX" />
                            <Input type="time" label="Departure" name="departureTime" value={form.departureTime} onChange={handleChange} />
                            <Input type="time" label="Arrival" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase border-b pb-1">Route</h4>
                        <div className="grid grid-cols-2 gap-3">
                             <Input label="From Station" name="fromStation" value={form.fromStation} onChange={handleChange} placeholder="STN CODE" />
                             <Input label="To Station" name="toStation" value={form.toStation} onChange={handleChange} placeholder="STN CODE" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase border-b pb-1">Claim Details</h4>
                        <div className="grid grid-cols-3 gap-3">
                             <Input label="Distance (KM)" name="kms" value={form.kms} onChange={handleChange} type="number" />
                             <div className="col-span-1">
                                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Claim %</label>
                                 <select name="dayNightPercent" value={form.dayNightPercent} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                                     <option value="100%">100%</option>
                                     <option value="70%">70%</option>
                                     <option value="30%">30%</option>
                                 </select>
                             </div>
                             <Input label="Rate (Rs)" name="rate" value={form.rate} onChange={handleChange} type="number" />
                        </div>
                    </div>

                    <Input label="Purpose / Object of Journey" name="purpose" value={form.purpose} onChange={handleChange} placeholder="e.g. Working Train No..." />
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t bg-gray-50">
                    <button onClick={() => onSave(form)} className="w-full bg-railway-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Save size={20} /> Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const { 
    profiles, currentProfileId, currentMonthData, 
    addProfile, switchProfile, createOrGetMonth, 
    saveEntry, deleteEntry, hasUnsavedChanges, 
    setHasUnsavedChanges, duplicateLastEntry
  } = useAppStore();

  const [view, setView] = useState<'splash' | 'profiles' | 'dashboard' | 'entry' | 'print'>('splash');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TaEntry | undefined>(undefined);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle PWA Install Prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        });
    }
  };

  // Back button safety
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
       if (hasUnsavedChanges && view !== 'dashboard') {
           if (!window.confirm("तुमची माहिती सेव्ह केलेली नाही. बाहेर जायचे आहे का?")) {
               history.pushState(null, '', window.location.href); 
           } else {
             setView('dashboard');
           }
       } else if (view !== 'dashboard' && view !== 'splash') {
          setView('dashboard');
       }
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [hasUnsavedChanges, view]);


  // Logic Controllers
  const handleSplashFinish = () => {
    if (profiles.length === 0) {
      setView('profiles');
    } else {
      if (currentProfileId) switchProfile(currentProfileId);
      setView('dashboard');
    }
  };

  const handleCreateProfile = (p: UserProfile) => {
    addProfile(p);
    setView('dashboard');
  };

  const handleMonthSelect = (date: Date) => {
      createOrGetMonth(date.getFullYear(), date.getMonth());
      setView('entry');
  };

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  // VIEWS
  if (view === 'splash') return <SplashScreen onFinish={handleSplashFinish} />;

  if (view === 'profiles') return (
    <ProfileEditor onSave={handleCreateProfile} initialData={currentProfile} onCancel={profiles.length > 0 ? () => setView('dashboard') : undefined} />
  );

  if (view === 'dashboard') {
     return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Header */}
            <header className="bg-gradient-to-r from-railway-900 to-railway-700 text-white p-6 pb-12 shadow-md rounded-b-[2rem] relative z-0">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl font-bold border border-white/30">
                          {currentProfile?.name.charAt(0)}
                      </div>
                      <div>
                         <p className="text-railway-100 text-xs uppercase tracking-wider font-semibold">Welcome Back</p>
                         <h1 className="font-bold text-xl leading-tight">{currentProfile?.name.split(' ')[0]}</h1>
                      </div>
                   </div>
                   <button onClick={() => setView('profiles')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition">
                     <Settings size={20} />
                   </button>
                </div>
            </header>

            <main className="flex-grow px-5 -mt-8 relative z-10 space-y-6 pb-8">
                {/* Active Action Card */}
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                           <Calendar size={18} className="text-railway-500"/> TA Journal
                        </h2>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-3">Select month to fill or print:</p>
                    <div className="relative">
                        <input 
                            type="month" 
                            className="w-full p-4 pl-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium text-gray-700 outline-none focus:ring-2 focus:ring-railway-500 transition-all"
                            onChange={(e) => {
                               if(e.target.value) handleMonthSelect(new Date(e.target.value));
                            }}
                        />
                        <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                            <ChevronRight />
                        </div>
                    </div>
                </div>

                {/* Quick Stats / History */}
                <div>
                   <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 px-1">Recent Activity</h3>
                   <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                       <div className="p-8 text-center text-gray-400">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                               <FileText size={24} className="opacity-50"/>
                           </div>
                           <p className="text-sm">No saved journals found.</p>
                           <p className="text-xs mt-1">Start by selecting a month above.</p>
                       </div>
                   </div>
                </div>

                {/* Ad Placeholder */}
                <div className="bg-gray-100 border border-dashed border-gray-300 rounded-xl h-24 flex flex-col items-center justify-center text-gray-400 text-xs">
                     <p>ADVERTISEMENT AREA</p>
                     <p>Google AdMob</p>
                </div>
            </main>
            
            {/* Install Prompt */}
            {showInstallPrompt && (
                <div className="fixed bottom-4 inset-x-4 bg-railway-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-slide-up z-50">
                    <div>
                        <p className="font-bold">Install App</p>
                        <p className="text-xs text-gray-300">Work offline & faster access.</p>
                    </div>
                    <button onClick={handleInstallClick} className="px-4 py-2 bg-white text-railway-900 rounded-lg font-bold text-sm">Install</button>
                </div>
            )}
        </div>
     );
  }

  if (view === 'entry') {
      const totalAmount = currentMonthData?.entries.reduce((sum, e) => sum + (parseFloat(e.rate) || 0), 0) || 0;

      return (
          <div className="min-h-screen bg-gray-50 flex flex-col">
              {/* Top Bar */}
              <div className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft className="text-gray-700"/></button>
                     <div>
                         <h2 className="font-bold text-gray-900 leading-tight">
                             {currentMonthData ? `${new Date(currentMonthData.year, currentMonthData.month).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'Loading'}
                         </h2>
                         <p className="text-[10px] text-gray-500 font-medium">Total Claim: Rs. {totalAmount}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={duplicateLastEntry} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Copy Last"><Copy size={18} /></button>
                      <button onClick={() => setView('print')} className="px-3 py-2 bg-green-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-green-700 transition">
                          <Printer size={16} /> Print
                      </button>
                  </div>
              </div>

              {/* List Content */}
              <main className="flex-grow p-4 pb-28 space-y-4">
                  {currentMonthData?.entries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 opacity-60">
                          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                              <Calendar size={48} className="text-gray-400" />
                          </div>
                          <p className="text-gray-900 font-bold">No entries yet</p>
                          <p className="text-sm text-gray-500 text-center max-w-[200px]">Tap the + button below to add your first daily journey.</p>
                      </div>
                  ) : (
                      <div className="relative">
                          {/* Timeline Line */}
                          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                          
                          {currentMonthData?.entries.map((entry, idx) => (
                              <div key={entry.id} className="relative pl-10 mb-6 last:mb-0 group">
                                  {/* Timeline Dot */}
                                  <div className="absolute left-[11px] top-4 w-3 h-3 bg-railway-500 rounded-full ring-4 ring-white shadow-sm z-10"></div>
                                  
                                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                      <div className="flex justify-between items-start mb-2">
                                          <div>
                                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date</span>
                                              <p className="font-bold text-lg text-gray-800 leading-none">
                                                {new Date(entry.date).getDate()} 
                                                <span className="text-xs font-normal text-gray-500 ml-1">
                                                    {new Date(entry.date).toLocaleString('default', { month: 'short' })}
                                                </span>
                                              </p>
                                          </div>
                                          <div className="text-right">
                                              <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-bold border border-green-100 flex items-center gap-1">
                                                <IndianRupee size={10} /> {entry.rate}
                                              </span>
                                          </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-2">
                                          <div className="flex items-center gap-1.5">
                                              <span className="w-5 h-5 bg-gray-50 rounded flex items-center justify-center text-[10px]">🚂</span>
                                              <span className="font-medium text-gray-800">{entry.trainNo || 'N/A'}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                              <span className="w-5 h-5 bg-gray-50 rounded flex items-center justify-center text-[10px]">🕒</span>
                                              <span>{entry.departureTime} - {entry.arrivalTime}</span>
                                          </div>
                                      </div>
                                      
                                      <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2 text-xs text-gray-700 mb-2">
                                          <MapPin size={12} className="text-railway-500" />
                                          <span className="font-bold">{entry.fromStation}</span>
                                          <span className="text-gray-400">➝</span>
                                          <span className="font-bold">{entry.toStation}</span>
                                          <span className="text-gray-300 mx-1">|</span>
                                          <span>{entry.kms} KM</span>
                                      </div>

                                      <p className="text-xs text-gray-500 italic truncate border-t pt-2 mt-1">
                                          {entry.purpose || 'No purpose specified'}
                                      </p>
                                      
                                      <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => { setEditingEntry(entry); setShowEntryModal(true); }} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200"><Settings size={14} /></button>
                                          <button onClick={() => deleteEntry(entry.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={14} /></button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </main>

              {/* Floating Action Button */}
              <button 
                  onClick={() => { setEditingEntry(undefined); setShowEntryModal(true); }}
                  className="fixed bottom-6 right-6 bg-gradient-to-r from-railway-700 to-railway-500 text-white w-14 h-14 rounded-2xl shadow-xl shadow-railway-500/30 hover:scale-105 active:scale-95 transition-all z-30 flex items-center justify-center"
              >
                  <Plus size={32} />
              </button>

              {/* Entry Modal */}
              {showEntryModal && (
                  <EntryEditor 
                      initialData={editingEntry || {}}
                      onCancel={() => setShowEntryModal(false)}
                      onSave={(entry) => {
                          saveEntry(entry);
                          setShowEntryModal(false);
                      }}
                  />
              )}
          </div>
      );
  }

  if (view === 'print') {
      if (!currentMonthData || !currentProfile) return <div>Error loading data</div>;
      return (
          <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 font-sans">
              <div className="no-print bg-white p-6 w-full max-w-lg mb-8 rounded-xl shadow-lg text-center space-y-4 mx-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <Printer size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-gray-900">Ready to Print</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Use <span className="font-bold text-gray-800">A4 Landscape</span> paper setting.
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-center pt-2">
                    <button onClick={() => setView('entry')} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
                        Edit More
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2.5 bg-railway-700 text-white rounded-lg font-bold shadow-lg hover:bg-railway-800 transition flex items-center gap-2">
                        Download PDF
                    </button>
                  </div>
              </div>

              {/* The Actual Sheet */}
              <div className="bg-white shadow-2xl mb-20 overflow-hidden print:shadow-none print:m-0">
                   <PrintLayout data={currentMonthData} profile={currentProfile} />
              </div>
          </div>
      );
  }

  return <div>Loading...</div>;
}