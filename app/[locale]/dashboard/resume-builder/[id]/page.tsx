import { fetchResumeById } from "@/features/resume-builder/services/resume-service";
import FullEditor from "@/features/resume-builder/components/editor/full-editor";
import { notFound } from "next/navigation";

export default async function ResumeEditorPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const resume = await fetchResumeById(params.id);
  if (!resume) notFound();

  return <FullEditor resume={resume} />;
}
