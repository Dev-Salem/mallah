'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UploadCloud, FileText } from 'lucide-react';
import { uploadCVAction } from '../actions/analyzer.action';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { ExtractedCV } from '../types';

interface CVUploadZoneProps {
    onUploadComplete?: (cvData: ExtractedCV) => void;
}

import { useTranslations } from 'next-intl';

export function CVUploadZone({ onUploadComplete }: CVUploadZoneProps) {
    const t = useTranslations('Dashboard.Opportunities.customAnalysis.fileUpload');
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File exceeds 5MB limit");
            return;
        }

        setFileName(file.name);
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
                setFileName(null);
            }
        } catch {
            toast.error("Upload failed");
            setFileName(null);
        } finally {
            setIsUploading(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    return (
        <div className="space-y-4">
            <div 
                {...getRootProps()} 
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group",
                    isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-primary/10 bg-muted/10 hover:border-primary/30 hover:bg-primary/5",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    {isUploading ? (
                        <>
                            <Loader2 className="h-10 w-10 animate-spin text-primary/70" />
                            <p className="text-[10px] font-mono tracking-widest text-primary uppercase animate-pulse">
                                {t('dragActive')}
                            </p>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>

            {fileName && !isUploading && (
                <div className="flex items-center justify-center animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-mono uppercase tracking-tight">
                        <FileText className="h-3 w-3" />
                        <span>{t('ready')}: {fileName}</span>
                    </div>
                </div>
            )}
            
            {!fileName && !isUploading && (
                <div className="flex items-center justify-center">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-foreground/60 bg-white/10 px-2 py-0.5 rounded">
                        {t('status')}
                    </div>
                </div>
            )}
        </div>
    );
}
