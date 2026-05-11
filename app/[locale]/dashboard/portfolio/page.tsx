import { getPrivatePortfolio, getSkillsCatalog } from '@/features/portfolio';
import { PortfolioHeader, ProjectsSection, SkillsSection } from '@/features/portfolio/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from 'next-intl/server';

export default async function PortfolioPage({
    searchParams,
}: {
    searchParams?: Promise<{ project?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const [data, catalog, t] = await Promise.all([
        getPrivatePortfolio(),
        getSkillsCatalog(),
        getTranslations('PortfolioHub')
    ]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <PortfolioHeader profile={data.profile} />

            <Tabs defaultValue="projects" className="w-full">
                <TabsList className="mb-6 bg-background/50 border border-primary/10">
                    <TabsTrigger value="projects" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        {t('tabs.projects')}
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        {t('tabs.skills')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="mt-0 outline-none">
                    <ProjectsSection
                        projects={data.projects}
                        catalog={catalog}
                        initialOpenProjectId={resolvedSearchParams?.project ?? null}
                    />
                </TabsContent>

                <TabsContent value="skills" className="mt-0 outline-none">
                    <SkillsSection skills={data.skills} catalog={catalog} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
