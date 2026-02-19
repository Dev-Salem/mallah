import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getUserResumes, getResumeDetail } from "@/features/resume-builder/services/resume-service";
import { ResumeBuilderClient } from "@/features/resume-builder/components/ResumeBuilderClient";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function ResumePage({ searchParams }: Props) {
  const locale = await getLocale();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const params = await searchParams;
  const resumes = await getUserResumes(user.id);

  let activeResume = null;
  if (params.id) {
    activeResume = await getResumeDetail(params.id);
  } else if (resumes.length > 0) {
    activeResume = await getResumeDetail(resumes[0].id);
  }

  return <ResumeBuilderClient resumes={resumes} activeResume={activeResume} />;
}
