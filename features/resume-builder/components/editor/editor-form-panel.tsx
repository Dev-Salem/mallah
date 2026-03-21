import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditorFormPanel({ initialSections, onUpdate }: { initialSections: any[], onUpdate: (data: any[]) => void }) {
    // In a full implementation this maintains the hook-form states for 7 sections.
    return (
        <section className="flex-1 overflow-y-auto p-6 bg-slate-50/50 relative">
            <div className="max-w-3xl mx-auto space-y-8 pb-12">
                <Card className="shadow-sm border-2">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground border border-dashed border-slate-300 p-8 rounded text-center bg-white cursor-not-allowed">
                            Personal info inputs will be generated here...
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="shadow-sm border-2">
                    <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-xl">Professional Summary</CardTitle>
                        <Button variant="outline" size="sm" className="h-8">AI Improve</Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground border border-dashed border-slate-300 p-8 rounded text-center bg-white">
                            Textarea for Summary (Tip: aim for 20+ words to boost ATS)
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="shadow-sm border-2">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <CardTitle className="text-xl">Experience / Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground border border-dashed border-slate-300 p-8 rounded text-center bg-white">
                            List of past experiences or projects pulled from Mallah profile.
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="shadow-sm border-2">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <CardTitle className="text-xl">Technical Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                         <p className="text-sm text-muted-foreground border border-dashed border-slate-300 p-8 rounded text-center bg-white">
                            Checkboxes for Skills from the Roadmap
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
