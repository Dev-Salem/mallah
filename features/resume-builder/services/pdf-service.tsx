import { renderToStream } from '@react-pdf/renderer';
import { ResumePDFTemplate } from '../components/pdf/resume-pdf-template';

// We isolate this in a .tsx file so the .ts Route Handler can call it safely
export async function generateResumePdfStream(resume: any) {
    const stream = await renderToStream(
        <ResumePDFTemplate sections={resume.resume_sections || []} resumeInfo={resume} />
    );
    return stream;
}
