import { renderToStream, renderToBuffer, Font } from '@react-pdf/renderer';
import { ResumePDFTemplate } from '../components/pdf/resume-pdf-template';
import fs from 'fs';
import path from 'path';

let fontsRegistered = false;

function registerResumeFonts() {
    if (fontsRegistered) return;
    
    try {
        const fontDir = path.join(process.cwd(), 'public', 'fonts');
        
        Font.register({
            family: 'Inter',
            fonts: [
                { src: fs.readFileSync(path.join(fontDir, 'Inter-Regular.ttf')) as any, fontWeight: 400 },
                { src: fs.readFileSync(path.join(fontDir, 'Inter-SemiBold.ttf')) as any, fontWeight: 600 },
                { src: fs.readFileSync(path.join(fontDir, 'Inter-Bold.ttf')) as any, fontWeight: 700 },
            ]
        });

        Font.register({
            family: 'JetBrains Mono',
            src: fs.readFileSync(path.join(fontDir, 'JetBrainsMono-Regular.ttf')) as any
        });

        fontsRegistered = true;
    } catch (error) {
        console.error("Error registering fonts:", error);
        // Fallback happens automatically to Helvetica if fonts fail to register
    }
}

// We isolate this in a .tsx file so the .ts Route Handler can call it safely
export async function generateResumePdfStream(resume: any) {
    registerResumeFonts();
    const stream = await renderToStream(
        <ResumePDFTemplate sections={resume.resume_sections || []} resumeInfo={resume} />
    );
    return stream;
}

export async function generateResumePdfBuffer(resume: any) {
    registerResumeFonts();
    const buffer = await renderToBuffer(
        <ResumePDFTemplate sections={resume.resume_sections || []} resumeInfo={resume} />
    );
    return buffer;
}
