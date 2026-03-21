import { NextResponse } from 'next/server';
import { fetchResumeById } from '@/features/resume-builder/services/resume-service';
import { generateResumePdfStream } from '@/features/resume-builder/services/pdf-service';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const resume = await fetchResumeById(params.id);
        if (!resume) {
            return new NextResponse("Resume not found", { status: 404 });
        }

        const stream = await generateResumePdfStream(resume);

        return new NextResponse(stream as unknown as ReadableStream, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${(resume.title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return new NextResponse("Internal Server Error generating PDF", { status: 500 });
    }
}
