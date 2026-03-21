import { ZoomIn, ZoomOut } from "lucide-react";

export default function PreviewCard({ sections, resumeInfo }: { sections: any[], resumeInfo: any }) {
    return (
        <aside className="w-[480px] border-l bg-slate-200/50 p-6 overflow-y-auto flex flex-col shadow-inner relative z-0">
            <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-slate-700">Live Preview</span>
                <div className="flex items-center space-x-2 bg-white rounded-md border shadow-sm p-1">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ZoomOut className="w-4 h-4" /></button>
                    <span className="text-xs font-medium text-slate-600 px-2 border-x select-none">100%</span>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ZoomIn className="w-4 h-4" /></button>
                </div>
            </div>
            
            <div className="flex-1 flex justify-center">
                {/* Simulated A4 Resume Sheet (aspect ratio 1:1.414) */}
                <div className="bg-white text-black shadow-xl shadow-slate-300/50 w-[400px] h-[565px] p-8 rounded-sm shrink-0 border border-slate-100 relative overflow-hidden flex flex-col mx-auto transition-all">
                    
                    <h1 className="text-xl font-bold uppercase tracking-wide border-b border-black/80 pb-2 mb-4 text-center">
                        Mallah Navigator
                    </h1>
                    
                    <div className="text-center text-[8px] text-slate-500 mb-6 -mt-3 space-x-2">
                        <span>navigator@mallah.com</span>
                        <span>•</span>
                        <span>Riyadh, SA</span>
                        <span>•</span>
                        <span>github.com/mallah</span>
                    </div>
                    
                    {sections.map(sec => (
                        <div key={sec.section_id || sec.section_type} className="mb-4">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-2">
                                {sec.section_type}
                            </h2>
                            <div className="text-[9px] leading-relaxed text-slate-700">
                                 {sec.content?.text || <span className="text-slate-400 italic">No content provided...</span>}
                            </div>
                        </div>
                    ))}

                    {sections.length === 0 && (
                         <div className="absolute inset-0 flex items-center justify-center text-slate-200 opacity-20 uppercase tracking-[1em] text-4xl font-black rotate-[-45deg] select-none pointer-events-none">
                              DRAFT
                         </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
