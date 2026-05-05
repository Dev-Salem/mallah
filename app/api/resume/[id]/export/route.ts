import { NextResponse } from 'next/server';
import { fetchResumeById } from '@/features/resume-builder/services/resume-service';
import { generateResumePdfBuffer } from '@/features/resume-builder/services/pdf-service';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const resume = await fetchResumeById(params.id);
        if (!resume) {
            return new NextResponse("Resume not found", { status: 404 });
        }

        const buffer = await generateResumePdfBuffer(resume);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${(resume.title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`,
                'Content-Length': buffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error("PDF Generation Detailed Error:", {
            message: error.message,
            stack: error.stack,
            resumeId: params.id
        });
        return new NextResponse(`Internal Server Error generating PDF: ${error.message}`, { status: 500 });
    }
}
