import { fetchResumeById } from "@/features/resume-builder/services/resume-service";
import GuidedWizard from "@/features/resume-builder/components/wizard/guided-wizard";
// import FullEditor from "@/features/resume-builder/components/editor/full-editor"; // will implement next
import { notFound } from "next/navigation";

export default async function ResumeEditorPage({ params }: { params: { id: string } }) {
  const resume = await fetchResumeById(params.id);
  if (!resume) notFound();

  const isWizard = resume.resume_type === 'general' && (!resume.resume_sections || resume.resume_sections.length === 0);

  if (isWizard) {
     return <GuidedWizard resume={resume} />;
  }

  // Placeholder until FullEditor is built
  return <div className="p-8"><h1 className="text-2xl font-bold">Full Editor Loading...</h1><pre className="mt-4 p-4 bg-muted rounded">{JSON.stringify(resume, null, 2)}</pre></div>;
  // return <FullEditor resume={resume} />;
}
