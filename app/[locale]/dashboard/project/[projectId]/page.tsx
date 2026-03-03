import { getTranslations } from "next-intl/server";
import { getProjectAction } from "@/features/roadmap/actions/project-actions";
import { ProjectViewerView } from "@/features/roadmap/components/ProjectViewerView";
import { redirect } from "next/navigation";

interface ProjectPageProps {
    params: {
        locale: string;
        projectId: string;
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { projectId, locale } = await params;

    const project = await getProjectAction(projectId);

    if (!project) {
        redirect(`/${locale}/dashboard/roadmap`);
    }

    return (
        <div className="h-full w-full">
            <ProjectViewerView project={project} />
        </div>
    );
}
