'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Badge } from '@/components/ui/badge';
import { Loader2, UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import { uploadCVAction } from '../actions/analyzer.action';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import { ExtractedCV } from '../types';

interface CVUploadZoneProps {
    fileName?: string | null;
    onUploadStarted?: (name: string) => void;
    onUploadComplete?: (cvData: ExtractedCV) => void;
    onRemove?: () => void;
}

import { useTranslations } from 'next-intl';

export function CVUploadZone({ fileName, onUploadStarted, onUploadComplete, onRemove }: CVUploadZoneProps) {
    const t = useTranslations('Dashboard.Opportunities.customAnalysis.fileUpload');
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File exceeds 5MB limit");
            return;
        }

        if (onUploadStarted) onUploadStarted(file.name);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadCVAction(formData);
            
            if (result.success && result.data) {
                toast.success("CV processed successfully");
                if (onUploadComplete) onUploadComplete(result.data);
            } else {
                toast.error(result.error || "Failed to process CV");
                if (onRemove) onRemove(); // Reset in parent if failed
            }
        } catch {
            toast.error("Upload failed");
            if (onRemove) onRemove(); // Reset in parent if failed
        } finally {
            setIsUploading(false);
        }
    }, [onUploadStarted, onUploadComplete, onRemove]);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRemove) onRemove();
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        disabled: !!fileName || isUploading
    });

    return (
        <div className="space-y-4">
            <div 
                {...getRootProps()} 
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-500 cursor-pointer group min-h-[160px] flex flex-col items-center justify-center overflow-hidden",
                    isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-primary/10 bg-muted/10 hover:border-primary/30 hover:bg-primary/5",
                    isUploading && "pointer-events-none opacity-50",
                    fileName && !isUploading && "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50"
                )}
            >
                <input {...getInputProps()} />
                
                <AnimatePresence mode="wait">
                    {isUploading ? (
                        <motion.div 
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="flex flex-col items-center justify-center text-center space-y-3"
                        >
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-[10px] font-mono tracking-widest text-primary uppercase animate-pulse">
                                {t('dragActive')}
                            </p>
                        </motion.div>
                    ) : fileName ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 relative z-10">
                                    <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                                </div>
                            </div>
                            
                            <div className="space-y-2 z-10">
                                <p className="text-xs font-mono tracking-widest text-emerald-500 uppercase font-bold">
                                    {t('ready')}
                                </p>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono max-w-[240px] truncate">
                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{fileName}</span>
                                    <button 
                                        type="button"
                                        onClick={handleRemove}
                                        className="ml-1 p-1 hover:bg-emerald-500/20 rounded-md transition-colors text-emerald-400/70 hover:text-emerald-400"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center text-center space-y-3"
                        >
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <UploadCloud className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-mono tracking-widest text-primary/80 uppercase group-hover:text-primary transition-colors">
                                    {isDragActive ? t('dragActive') : t('empty')}
                                </p>
                                <p className="text-[9px] font-mono text-foreground/60 uppercase">
                                    {t('formats')}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex items-center justify-center">
                <div className={cn(
                    "text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded transition-colors duration-500",
                    fileName ? "text-emerald-500 bg-emerald-500/10" : "text-foreground/60 bg-white/10"
                )}>
                    {fileName ? "Transmission Verified" : t('status')}
                </div>
            </div>
        </div>
    );
}

