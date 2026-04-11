'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UploadCloud, FileText } from 'lucide-react';
import { uploadCVAction } from '../actions/analyzer.action';
import { toast } from 'sonner';

import { ExtractedCV } from '../types';

interface CVUploadZoneProps {
    onUploadComplete?: (cvData: ExtractedCV) => void;
}

export function CVUploadZone({ onUploadComplete }: CVUploadZoneProps) {
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
        <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="p-6">
                <div 
                    {...getRootProps()} 
                    className={`flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
                >
                    <input {...getInputProps()} />
                    
                    {isUploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Extracting skills from CV...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-center">
                            <UploadCloud className="h-8 w-8 mb-2" />
                            <p className="text-sm font-medium">Drag & drop your CV here</p>
                            <p className="text-xs">PDF or DOCX up to 5MB</p>
                        </div>
                    )}
                </div>

                {fileName && !isUploading && (
                    <div className="mt-4 flex items-center justify-center">
                        <Badge variant="secondary" className="flex items-center space-x-2 py-1.5 px-3">
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            <span>CV uploaded: {fileName}</span>
                        </Badge>
                    </div>
                )}
                {!fileName && !isUploading && (
                    <div className="mt-4 flex items-center justify-center">
                        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
                            No CV — Mallah profile only
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
