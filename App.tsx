import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile, TaEntry, COLUMNS } from './types';
import { PrintLayout } from './components/PrintLayout';
import { 
  Plus, Trash2, Printer, Save, ChevronLeft, 
  User, Settings, FileText, AlertTriangle, Menu, X, Download, Copy 
} from 'lucide-react';

// --- COMPONENTS ---

// 1. Splash Screen
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-railway-900 flex flex-col items-center justify-center text-white z-50">
      <div className="animate-bounce mb-4">
        <Printer size={64} />
      </div>
      <h1 className="text-3xl font-bold mb-2">Railway TA Journal</h1>
      <p className="text-railway-100">Simplify Your Claims</p>
      <div className="absolute bottom-10 text-xs opacity-70">
        Developed By Milind Manugade
      </div>
    </div>
  );
};

// 2. Profile Editor
const ProfileEditor = ({ onSave, initialData, onCancel }: { onSave: (p: UserProfile) => void, initialData?: UserProfile, onCancel?: () => void }) => {
  const [form, setForm] = useState<UserProfile>(initialData || {
    id: uuidv4(),
    name: '', designation: '', station: '', payLevel: '', basicPay: '', pfNumber: '', headquarters: '', branch: '', division: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white min-h-screen">
       <h2 className="text-xl font-bold text-railway-900 mb-4">{initialData ? 'Edit Profile' : 'Create New Profile'}</h2>
       <div className="space-y-3">
         <Input label="Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Milind D. Manugade" />
         <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. PMA" />
         <Input label="Station" name="station" value={form.station} onChange={handleChange} />
         <div className="grid grid-cols-2 gap-2">
            <Input label="Pay Level" name="payLevel" value={form.payLevel} onChange={handleChange} placeholder="Level-2" />
            <Input label="Basic Pay" name="basicPay" value={form.basicPay} onChange={handleChange} placeholder="24500" />
         </div>
         <Input label="PF Number" name="pfNumber" value={form.pfNumber} onChange={handleChange} />
         <Input label="Headquarters" name="headquarters" value={form.headquarters} onChange={handleChange} />
         <div className="grid grid-cols-2 gap-2">
            <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} placeholder="TFC/OPTG" />
            <Input label="Division" name="division" value={form.division} onChange={handleChange} placeholder="PUNE" />
         </div>
       </div>
       <div className="flex gap-3 mt-6">
         {onCancel && <button onClick={onCancel} className="flex-1 py-3 border border-gray-300 rounded text-gray-700">Cancel</button>}
         <button onClick={() => onSave(form)} className="flex-1 py-3 bg-railway-700 text-white rounded font-bold shadow-md">Save Profile</button>
       </div>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
    <input className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-railway-500 outline-none" {...props} />
  </div>
);

// 3. Entry Editor Modal
const EntryEditor = ({ onSave, onCancel, initialData }: { onSave: (e: TaEntry) => void, onCancel: () => void, initialData?: Partial<TaEntry> }) => {
    // Default form data
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:w-[90%] max-w-md h-[90vh] sm:h-auto overflow-y-auto rounded-t-xl sm:rounded-xl p-4 shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="font-bold text-lg">Add TA Entry</h3>
                    <button onClick={onCancel}><X size={24} /></button>
                </div>
                
                <div className="space-y-3">
                    <Input type="date" label="Date" name="date" value={form.date} onChange={handleChange} />
                    
                    <div className="grid grid-cols-3 gap-2">
                        <Input label="Train No" name="trainNo" value={form.trainNo} onChange={handleChange} placeholder="XXXX" />
                        <Input type="time" label="Dep Time" name="departureTime" value={form.departureTime} onChange={handleChange} />
                        <Input type="time" label="Arr Time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                         <Input label="From Stn" name="fromStation" value={form.fromStation} onChange={handleChange} placeholder="KARAD" />
                         <Input label="To Stn" name="toStation" value={form.toStation} onChange={handleChange} placeholder="PUNE" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                         <Input label="KMs" name="kms" value={form.kms} onChange={handleChange} type="number" />
                         <div className="col-span-1">
                             <label className="block text-xs font-semibold text-gray-500 mb-1">Claim %</label>
                             <select name="dayNightPercent" value={form.dayNightPercent} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded bg-white">
                                 <option value="100%">100%</option>
                                 <option value="70%">70%</option>
                                 <option value="30%">30%</option>
                             </select>
                         </div>
                         <Input label="Rate (Rs)" name="rate" value={form.rate} onChange={handleChange} type="number" />
                    </div>

                    <Input label="Purpose (Details)" name="purpose" value={form.purpose} onChange={handleChange} placeholder="Alongwith..." />
                </div>

                <div className="mt-6">
                    <button onClick={() => onSave(form)} className="w-full bg-railway-700 text-white py-3 rounded-lg font-bold text-lg active:scale-95 transition-transform">
                        Save Entry
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
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        });
    }
  };

  // Back button safety
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
       if (hasUnsavedChanges) {
           if (!window.confirm("तुमची माहिती सेव्ह केलेली नाही. बाहेर जायचे आहे का?")) {
               history.pushState(null, '', window.location.href); // Push state back to prevent exit
           }
       }
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [hasUnsavedChanges]);


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
    <ProfileEditor onSave={handleCreateProfile} />
  );

  if (view === 'dashboard') {
     return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-railway-900 text-white p-4 shadow-md flex justify-between items-center">
                <div>
                   <h1 className="font-bold text-lg">My Dashboard</h1>
                   <p className="text-xs text-railway-100">{currentProfile?.name}</p>
                </div>
                <button onClick={() => setView('profiles')} className="p-2"><Settings size={20} /></button>
            </header>

            <main className="flex-grow p-4 space-y-4">
                {/* Active Month Card */}
                <div className="bg-white rounded-lg shadow p-4 border-l-4 border-railway-500">
                    <h2 className="text-gray-500 text-xs font-bold uppercase mb-2">Create / Continue Journal</h2>
                    <input 
                        type="month" 
                        className="w-full p-3 border rounded text-lg font-mono"
                        onChange={(e) => {
                           if(e.target.value) handleMonthSelect(new Date(e.target.value));
                        }}
                    />
                </div>

                {/* Recent History Placeholder */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-gray-500 text-xs font-bold uppercase mb-2">History</h2>
                    <p className="text-sm text-gray-400 italic">No saved forms yet.</p>
                </div>

                 {/* Ad Placeholder */}
                 <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                     Google AdMob Banner
                 </div>
            </main>

            {/* Install Prompt Modal */}
            {showInstallPrompt && (
                <div className="fixed bottom-0 inset-x-0 bg-white shadow-2xl p-4 rounded-t-xl z-50 animate-slide-up">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-railway-900">Install Railway TA App</h3>
                        <button onClick={() => setShowInstallPrompt(false)}><X size={20} /></button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Add to home screen for quick access and offline use.</p>
                    <button onClick={handleInstallClick} className="w-full bg-railway-500 text-white py-2 rounded font-bold">Install Now</button>
                </div>
            )}
        </div>
     );
  }

  if (view === 'entry') {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col">
              <header className="bg-railway-700 text-white p-3 shadow sticky top-0 z-10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <button onClick={() => setView('dashboard')}><ChevronLeft /></button>
                     <div>
                         <h2 className="font-bold text-sm">
                             {currentMonthData ? `${new Date(currentMonthData.year, currentMonthData.month).toLocaleString('default', { month: 'long', year: 'numeric' })}` : 'Loading'}
                         </h2>
                         <p className="text-[10px] opacity-80">{currentProfile?.station} - {currentProfile?.designation}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={duplicateLastEntry} className="p-2 bg-railway-600 rounded-full" title="Duplicate Last"><Copy size={18} /></button>
                      <button onClick={() => window.print()} className="p-2 bg-white text-railway-700 rounded-full hidden md:block"><Printer size={18} /></button>
                      <button onClick={() => setView('print')} className="p-2 bg-green-500 text-white rounded-full font-bold text-xs flex items-center gap-1">
                          <FileText size={14} /> PDF
                      </button>
                  </div>
              </header>

              <main className="flex-grow p-2 space-y-2 pb-24">
                  {/* Entries List */}
                  {currentMonthData?.entries.length === 0 ? (
                      <div className="text-center py-20 text-gray-400">
                          <p>No entries yet.</p>
                          <p className="text-sm">Tap + to add daily TA.</p>
                      </div>
                  ) : (
                      currentMonthData?.entries.map((entry, idx) => (
                          <div key={entry.id} className="bg-white p-3 rounded shadow-sm border-l-4 border-railway-500 relative group">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="font-bold text-lg text-gray-800">{new Date(entry.date).getDate()}<span className="text-xs font-normal text-gray-500 align-top ml-1">th</span></p>
                                  </div>
                                  <div className="text-right">
                                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">Rs. {entry.rate}</span>
                                  </div>
                              </div>
                              <div className="mt-1 text-sm text-gray-700 grid grid-cols-2 gap-x-2">
                                  <span>🚂 {entry.trainNo || 'N/A'}</span>
                                  <span>📍 {entry.fromStation} ➝ {entry.toStation}</span>
                                  <span>🕒 {entry.departureTime} - {entry.arrivalTime}</span>
                                  <span className="truncate w-full">{entry.purpose}</span>
                              </div>
                              
                              <div className="absolute right-2 bottom-2 flex gap-2">
                                  <button onClick={() => { setEditingEntry(entry); setShowEntryModal(true); }} className="p-1.5 bg-gray-100 rounded text-gray-600"><Settings size={14} /></button>
                                  <button onClick={() => deleteEntry(entry.id)} className="p-1.5 bg-red-50 rounded text-red-500"><Trash2 size={14} /></button>
                              </div>
                          </div>
                      ))
                  )}
              </main>

              {/* Floating Action Button */}
              <button 
                  onClick={() => { setEditingEntry(undefined); setShowEntryModal(true); }}
                  className="fixed bottom-6 right-6 bg-railway-600 text-white p-4 rounded-full shadow-lg hover:bg-railway-700 active:scale-90 transition-all z-20"
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
          <div className="min-h-screen bg-gray-500 flex flex-col items-center pt-8">
              <div className="no-print bg-white p-4 w-full max-w-lg mb-4 rounded shadow text-center space-y-2">
                  <h2 className="font-bold text-lg">Print Preview</h2>
                  <p className="text-sm text-gray-600">Please set Paper Size to <span className="font-bold">A4</span> and Orientation to <span className="font-bold">Landscape</span> in printer settings.</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setView('entry')} className="px-4 py-2 border rounded">Back</button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow flex items-center gap-2 mx-auto">
                        <Printer size={18} /> Print / Save PDF
                    </button>
                  </div>
              </div>

              {/* The Actual Sheet */}
              <div className="bg-white shadow-2xl mb-10 overflow-hidden">
                   <PrintLayout data={currentMonthData} profile={currentProfile} />
              </div>
          </div>
      );
  }

  return <div>Loading...</div>;
}