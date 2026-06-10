import React from 'react';

const ViewIssuesPage = ({ issues, setIssues, isAdmin, onResolve }) => {
    
    const handleUpvote = (id) => {
        setIssues(issues.map(i => i.id === id ? {...i, upvotes: i.upvotes + 1} : i));
    };

    return (
        <div className="space-y-8 pb-20">
            {/* AI Summary Header */}
            <div className="bg-white border rounded-[2.5rem] p-8 shadow-xl">
                <h2 className="text-2xl font-black italic">Community <span className="text-emerald-600">Overview</span></h2>
                <p className="text-gray-500 text-sm italic mt-2">"Total of {issues.length} reports. Admin attention required for pending cases."</p>
            </div>

            <div className="space-y-6">
                {issues.map(issue => (
                    <div key={issue.id} className="bg-white rounded-[2rem] p-6 shadow-lg border flex flex-col md:flex-row gap-6">
                        <img src={issue.image} className="w-40 h-32 rounded-2xl object-cover" alt="issue" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black uppercase bg-indigo-50 px-3 py-1 rounded-full">{issue.category}</span>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {issue.status}
                                </span>
                            </div>
                            <h5 className="text-lg font-black mt-2">{issue.address}</h5>
                            <p className="text-sm text-gray-500 italic mt-1">{issue.description}</p>
                            
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <button onClick={() => handleUpvote(issue.id)} className="flex items-center gap-2">
                                    <span className="text-sm font-black">▲ {issue.upvotes} Upvotes</span>
                                </button>

                                {/* ADMIN ONLY RESOLVE BUTTON */}
                                {isAdmin && issue.status !== 'Resolved' && (
                                    <button 
                                        onClick={() => onResolve(issue.id)}
                                        className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all"
                                    >
                                        ✅ MARK AS RESOLVED
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewIssuesPage;