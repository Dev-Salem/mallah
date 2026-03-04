import { getPublicPortfolio } from '@/features/portfolio';
import { PortfolioHeader, ProjectsSection, SkillsSection } from '@/features/portfolio/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export default async function PublicPortfolioPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const [data, t] = await Promise.all([
        getPublicPortfolio(params.slug),
        getTranslations('PortfolioHub')
    ]);

    if (!data) notFound();

    return (
        <div className="min-h-screen bg-background">
            {/* minimal header */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo size={24} className="text-primary" />
                        <span className="font-mono font-black uppercase text-foreground">Mallah</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 pt-24 pb-12 space-y-8">
                <PortfolioHeader profile={data.profile} isPublicView={true} />

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
                        <ProjectsSection projects={data.projects} catalog={[]} isPublicView={true} />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0 outline-none">
                        <SkillsSection skills={data.skills} catalog={[]} isPublicView={true} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
