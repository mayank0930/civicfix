import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import IssuesMapView from './components/IssuesMapView';
import ReportPage from './components/ReportPage';
import ViewIssuesPage from './components/ViewIssuesPage';
import AuthPage from './components/AuthPage';
import fixedRoadImage from './assets/road-fixed.jpg'; 

const App = () => {
    const [user, setUser] = useState(null);
    const [activePage, setActivePage] = useState('map');
    
    const [issues, setIssues] = useState([
        {
            id: '1',
            category: 'Pothole',
            description: 'Massive crater near the main entrance. Very dangerous for bikes.',
            address: 'Sector 62, Noida, UP',
            geotag: { latitude: 28.6273, longitude: 77.3725 },
            upvotes: 42,
            status: 'submitted',
            image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400',
            timestamp: new Date().toISOString()
        },
        {
            id: '2',
            category: 'Garbage Dump',
            description: 'Trash piling up near the park entrance. Needs immediate clearance.',
            address: 'Indirapuram, Ghaziabad',
            geotag: { latitude: 28.6353, longitude: 77.3525 },
            upvotes: 15,
            status: 'pending',
            image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=400',
            timestamp: new Date().toISOString()
        }
    ]);

    const handleLogin = (userData) => {
        // ADMIN CHECK: If email ends with @city.gov, they are an Admin
        const isAdmin = userData.email.endsWith('@city.gov');
        setUser({ ...userData, isAdmin });
    };

    const handleLogout = () => { setUser(null); setActivePage('map'); };
    
    const addIssue = (newIssue) => {
        setIssues([newIssue, ...issues]);
        setActivePage('map'); 
    };

    // Function for Admin to resolve issues
    const resolveIssue = (id) => {
        setIssues(issues.map(i => i.id === id ? { ...i, status: 'Resolved' } : i));
    };

    if (!user) return <AuthPage onLogin={handleLogin} />;

    return (
        <APIProvider apiKey="AIzaSyCfsHUU_BSbN8nb8U85mMUdAl99YwmDJMo">
            <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
                
                <aside className="w-80 bg-indigo-950 text-white flex flex-col h-full shadow-2xl relative z-50">
                    <div className="p-8">
                        <h1 className="text-3xl font-black tracking-tighter italic">Civic<span className="text-emerald-400">Fix</span></h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/60">
                            {user.isAdmin ? "Admin Control Panel" : "Citizen Portal"}
                        </p>
                    </div>

                    <nav className="flex-1 px-4 space-y-3 overflow-y-auto">
                        <button 
                            onClick={() => setActivePage('map')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activePage === 'map' ? 'bg-white/10 text-white' : 'text-indigo-200'}`}
                        >
                            📄 {user.isAdmin ? "Manage Issues" : "Community Issues"}
                        </button>

                        {!user.isAdmin && (
                            <button 
                                onClick={() => setActivePage('report')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activePage === 'report' ? 'bg-emerald-500' : 'text-indigo-200'}`}
                            >
                                📢 Report New Issue
                            </button>
                        )}

                        <div className="pt-8 mt-8 border-t border-white/5">
                            <p className="px-6 text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4">Recently Resolved</p>
                            <div className="mx-2 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-5">
                                <img src={fixedRoadImage} className="rounded-2xl h-24 w-full object-cover mb-2" alt="Fixed road" />
                                <h4 className="text-xs font-black text-white">Road Repair: Sector 4</h4>
                            </div>
                        </div>
                    </nav>

                    <div className="p-6 bg-indigo-900/30 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${user.isAdmin ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                {user.email[0].toUpperCase()}
                            </div>
                            <p className="text-xs font-bold truncate text-white">{user.email}</p>
                        </div>
                        <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase">🚪 Logout</button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
                    <div className="max-w-6xl mx-auto space-y-10">
                        {activePage === 'map' && (
                            <>
                                <div className="rounded-[3rem] overflow-hidden shadow-2xl h-[400px]">
                                    <IssuesMapView issues={issues} />
                                </div>
                                <ViewIssuesPage 
                                    issues={issues} 
                                    setIssues={setIssues} 
                                    isAdmin={user.isAdmin} 
                                    onResolve={resolveIssue} 
                                />
                            </>
                        )}
                        {activePage === 'report' && <ReportPage user={user} onAddIssue={addIssue} />}
                    </div>
                </main>
            </div>
        </APIProvider>
    );
};

export default App;