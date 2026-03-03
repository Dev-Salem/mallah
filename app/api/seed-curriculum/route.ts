import { NextResponse } from "next/server";
import { RoadmapParser } from "@/features/roadmap/services/roadmap-parser";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const supabase = await createClient();
        const roadmapsDir = path.join(process.cwd(), "docs", "mallah-roadmap-and-topic-viewer");
        const files = [
            "frontend-roadmap.md",
            "fullstack-roadmap.md",
            "cybersecurity-roadmap.md",
            "datascience-roadmap.md"
        ];

        const results = [];

        for (const file of files) {
            const filePath = path.join(roadmapsDir, file);
            if (!fs.existsSync(filePath)) {
                results.push({ file, status: "error", message: "File not found" });
                continue;
            }

            const content = fs.readFileSync(filePath, "utf-8");
            const { pathId, stages } = RoadmapParser.parseMarkdown(content);

            await RoadmapParser.syncToDatabase(pathId, stages, supabase);
            results.push({ file, pathId, stages: stages.length, status: "success" });
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Seeding API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
