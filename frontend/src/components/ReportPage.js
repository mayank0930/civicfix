import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { GoogleGenerativeAI } from "@google/generative-ai"; //
import Webcam from 'react-webcam';

const ReportPage = ({ user, onAddIssue }) => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [geotag, setGeotag] = useState(null);
    const [image, setImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false); // State for AI loading
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const autocompleteInputRef = useRef(null);
    const placesLib = useMapsLibrary('places');

    // --- AI ENHANCEMENT LOGIC ---
    const enhanceDescription = async () => {
        if (!description.trim()) {
            setError("Please write something first to enhance it.");
            return;
        }

        setIsEnhancing(true);
        try {
            // Using your project's API key
            const genAI = new GoogleGenerativeAI("AIzaSyCfsHUU_BSbN8nb8U85mMUdAl99YwmDJMo");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Rewrite this civic issue report to be more professional, clear, and urgent for city officials. Category: ${category}. Original text: "${description}"`;

            const result = await model.generateContent(prompt);
            const enhancedText = result.response.text();
            
            setDescription(enhancedText); // Update the textarea with AI text
            setSuccess("Description enhanced by Gemini AI!");
        } catch (err) {
            console.error(err);
            setError("AI Enhancement failed. Check your API key.");
        } finally {
            setIsEnhancing(false);
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        setShowCamera(false);
    }, [webcamRef]);

    useEffect(() => {
        if (!placesLib || !autocompleteInputRef.current) return;
        const autocomplete = new placesLib.Autocomplete(autocompleteInputRef.current, {
            fields: ["geometry", "name", "formatted_address"],
            componentRestrictions: { country: "in" } 
        });
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                setGeotag({ latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() });
                setAddress(place.formatted_address || place.name);
            }
        });
    }, [placesLib]);

    const handleGetLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGeotag({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setAddress(`Pinned: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
            },
            () => setError("Location access denied.")
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!geotag) { setError("Please select a location."); return; }
        setIsLoading(true);
        onAddIssue({
            id: Date.now().toString(),
            category, description, address, geotag, image,
            reporter_email: user.email, upvotes: 0, status: 'submitted',
            timestamp: new Date().toISOString()
        });
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            <div className="bg-white border rounded-[3rem] shadow-2xl p-10">
                <h2 className="text-4xl font-black text-center mb-10">Report <span className="text-emerald-600">New Issue</span></h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-indigo-900 mb-2">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none">
                                <option value="">Select type...</option>
                                <option value="Pothole">Pothole</option>
                                <option value="Garbage">Garbage Dump</option>
                                <option value="Streetlight">Streetlight Outage</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div className="relative">
                            <label className="block text-[10px] font-black uppercase text-indigo-900 mb-2">Description</label>
                            <textarea rows="5" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe what's wrong..." className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none mb-2" />
                            
                            {/* AI ENHANCE BUTTON */}
                            <button 
                                type="button" 
                                onClick={enhanceDescription}
                                disabled={isEnhancing}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black transition-all border border-indigo-200 shadow-sm"
                            >
                                {isEnhancing ? (
                                    <span className="animate-spin">🌀</span>
                                ) : (
                                    <span>✨</span>
                                )}
                                {isEnhancing ? "ENHANCING..." : "ENHANCE WITH AI"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] font-black uppercase text-indigo-900">Visual Evidence</label>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowCamera(true)} className="text-[10px] font-bold text-emerald-600 underline">📸 CAMERA</button>
                                    <button type="button" onClick={() => fileInputRef.current.click()} className="text-[10px] font-bold text-indigo-600 underline">📁 UPLOAD</button>
                                </div>
                            </div>
                            <div className="aspect-video w-full border-2 border-dashed rounded-3xl flex items-center justify-center bg-gray-50 overflow-hidden relative">
                                {image && !showCamera && <img src={image} className="w-full h-full object-cover" alt="preview" />}
                                {!image && !showCamera && <span className="text-3xl">📷</span>}
                                {showCamera && (
                                    <div className="absolute inset-0 bg-black flex flex-col items-center">
                                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                                        <button type="button" onClick={capture} className="absolute bottom-4 bg-emerald-500 text-white px-6 py-2 rounded-full font-black text-xs">CLICK PHOTO</button>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setImage(reader.result);
                                    reader.readAsDataURL(file);
                                }
                            }} className="hidden" />
                        </div>
                        
                        <div className="relative">
                            <label className="block text-[10px] font-black uppercase text-indigo-900 mb-2">Location</label>
                            <input ref={autocompleteInputRef} type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder="Search street..." className="w-full pl-5 pr-12 py-4 bg-gray-50 border rounded-2xl outline-none font-bold text-sm" />
                            <button type="button" onClick={handleGetLocation} className="absolute right-4 top-12">📍</button>
                        </div>
                    </div>

                    {error && <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-2xl text-center text-xs font-bold">{error}</div>}
                    {success && <div className="md:col-span-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-center text-xs font-bold">{success}</div>}

                    <button type="submit" disabled={isLoading} className="md:col-span-2 py-5 bg-indigo-950 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">
                        {isLoading ? 'Tagging...' : 'Confirm and Tag Map'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportPage;