import React, { useState, useEffect } from 'react';

const AuthPage = ({ onLogin }) => {
    const [showIntro, setShowIntro] = useState(true);
    const [view, setView] = useState('main'); // 'main', 'google', 'facebook'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Intro animation logic set to exactly 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowIntro(false);
        }, 3000); 
        return () => clearTimeout(timer);
    }, []);

    // LOGIC: Check if the current email input belongs to an Admin
    const isCityAdmin = email.toLowerCase().endsWith('@city.gov');

    const handleBack = () => {
        setView('main');
        setError('');
        setEmail('');
        setPassword('');
    };

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (view === 'google' || view === 'main') {
            // Allow Admin pattern OR specific test credentials
            if (isCityAdmin || (email === 'civicfix01@gmail.com' && password === '11223344')) {
                onLogin({ email });
            } else {
                setError("Invalid Credentials. Tip: Use @city.gov for Admin.");
            }
        } else if (view === 'facebook') {
            if (email === '987654321' && password === '11223344') {
                onLogin({ email: "fb_user@civicfix.com" });
            } else {
                setError("Invalid Phone number or Password.");
            }
        }
    };

    // --- 1. BIG INTRO POP-UP VIEW (3 Seconds) ---
    if (showIntro) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-indigo-950 overflow-hidden">
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter animate-intro-fade">
                    Civic<span className="text-emerald-400">Fix</span>
                </h1>
                <style>{`
                    @keyframes intro-fade {
                        0% { opacity: 0; transform: scale(0.8); filter: blur(10px); }
                        20% { opacity: 1; transform: scale(1); filter: blur(0px); }
                        80% { opacity: 1; transform: scale(1); filter: blur(0px); }
                        100% { opacity: 0; transform: scale(1.1); filter: blur(8px); }
                    }
                    .animate-intro-fade {
                        animation: intro-fade 3s ease-in-out forwards;
                    }
                `}</style>
            </div>
        );
    }

    // --- 2. GOOGLE LOGIN VIEW ---
    if (view === 'google') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
                <div className="w-full max-w-[450px] p-10 bg-white border border-gray-300 rounded-lg shadow-sm text-center animate-in fade-in zoom-in duration-500">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-12 h-12 mx-auto mb-4" alt="Google" />
                    <h2 className="text-2xl font-normal text-gray-800 mb-1">Sign in</h2>
                    <p className="text-gray-600 mb-8 font-medium">Use your Google Account</p>
                    <form onSubmit={handleFinalSubmit} className="space-y-4">
                        <div className="relative">
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                placeholder="Email or @city.gov" />
                            {isCityAdmin && <span className="absolute right-3 top-3 animate-bounce">🔑</span>}
                        </div>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            placeholder="Enter your password" />
                        {error && <p className="text-red-600 text-sm text-left font-bold">{error}</p>}
                        <div className="flex justify-between items-center pt-6">
                            <button type="button" onClick={handleBack} className="text-blue-600 font-bold hover:bg-blue-50 px-3 py-2 rounded-md transition-colors">Back</button>
                            <button type="submit" className={`px-8 py-2 rounded-md font-bold shadow-md transition-all ${isCityAdmin ? 'bg-amber-500 text-indigo-950' : 'bg-blue-600 text-white'}`}>
                                {isCityAdmin ? 'Admin Login' : 'Next'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- 3. FACEBOOK LOGIN VIEW ---
    if (view === 'facebook') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5] font-sans">
                <div className="w-full max-w-[400px] p-6 bg-white rounded-xl shadow-2xl text-center animate-in fade-in zoom-in duration-500">
                    <h1 className="text-[#1877f2] text-4xl font-bold mb-6 tracking-tighter">facebook</h1>
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-inner">
                        <p className="mb-4 font-semibold text-gray-800">Log in to Facebook</p>
                        <form onSubmit={handleFinalSubmit} className="space-y-3">
                            <input type="text" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:border-[#1877f2] outline-none text-black"
                                placeholder="Phone number" />
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:border-[#1877f2] outline-none text-black"
                                placeholder="Password" />
                            {error && <p className="text-red-600 text-xs text-left font-bold">{error}</p>}
                            <button type="submit" className="w-full bg-[#1877f2] text-white py-3 rounded-md font-bold text-xl hover:bg-[#166fe5] shadow-lg">Log In</button>
                        </form>
                        <button onClick={handleBack} className="mt-4 text-[#1877f2] text-sm font-semibold hover:underline">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- 4. MAIN EYE-CATCHING PORTAL VIEW ---
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-teal-800 to-emerald-700 animate-in fade-in duration-1000">
            <div className="relative w-full max-w-md p-10 bg-white/10 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/20 mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                        Civic<span className="text-emerald-400">Fix</span>
                    </h1>
                    <p className="text-emerald-100/60 text-sm font-medium">Choose your login method</p>
                </div>

                <div className="space-y-4 mb-8">
                    <button type="button" onClick={() => setView('google')}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-2xl transition-all shadow-md active:scale-95">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                        <span className="text-lg">Continue with Google</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setView('facebook')}
                            className="flex items-center justify-center gap-2 py-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-2xl shadow-md active:scale-95">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 brightness-[10]" alt="F" />
                            <span>Facebook</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-4 bg-black text-white font-bold rounded-2xl shadow-md opacity-50 cursor-not-allowed">
                            <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 invert" alt="A" />
                            <span>Apple</span>
                        </button>
                    </div>
                </div>

                <div className="relative flex items-center mb-8">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Manual Access</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-5">
                    <div className="relative">
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="block w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                            placeholder="admin@city.gov" />
                        {/* ADMIN KEY ICON REVEAL */}
                        {isCityAdmin && <span className="absolute right-5 top-4 text-xl animate-bounce">🔑</span>}
                    </div>
                    
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        className="block w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                        placeholder="Password" />
                    
                    {error && <div className="p-4 text-xs font-bold text-red-200 bg-red-500/20 rounded-xl text-center border border-red-500/30 animate-pulse">{error}</div>}
                    
                    {/* DYNAMIC ADMIN BUTTON */}
                    <button type="submit" className={`w-full py-4 font-black rounded-2xl shadow-xl transition-all active:scale-[0.97] tracking-widest flex items-center justify-center gap-2 ${isCityAdmin ? 'bg-amber-500 hover:bg-amber-400 text-indigo-950' : 'bg-emerald-500 hover:bg-emerald-400 text-white'}`}>
                        {isCityAdmin && <span>🔐</span>}
                        {isCityAdmin ? 'ADMIN LOGIN' : 'ENTER DASHBOARD'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;