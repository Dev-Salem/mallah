import { NextResponse } from "next/server";
import { z } from "zod";
import { seedRoadmaps, ROADMAP_FILE_BY_PATH_ID, type RoadmapPathId } from "@/features/roadmap/services/roadmap-seed-service";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const pathIdEnum = Object.keys(ROADMAP_FILE_BY_PATH_ID) as [RoadmapPathId, ...RoadmapPathId[]];
const fileEnum = Object.values(ROADMAP_FILE_BY_PATH_ID) as [
    (typeof ROADMAP_FILE_BY_PATH_ID)[RoadmapPathId],
    ...(typeof ROADMAP_FILE_BY_PATH_ID)[RoadmapPathId][]
];

const seedRequestSchema = z.object({
    pathIds: z.array(z.enum(pathIdEnum)).optional(),
    files: z.array(z.enum(fileEnum)).optional(),
}).refine(value => (value.pathIds?.length ?? 0) > 0 || (value.files?.length ?? 0) > 0, {
    message: "Provide at least one path id or file to seed.",
});

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const adminDb = getSupabaseAdmin();
        const { data: admin } = await adminDb
            .from("admins")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (!admin) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const payload = seedRequestSchema.parse(await request.json());
        const results = await seedRoadmaps(payload, adminDb);
        const success = results.every(result => result.status === "success");

        return NextResponse.json(
            {
                success,
                results,
            },
            { status: success ? 200 : 207 }
        );
    } catch (error: any) {
        console.error("Seeding API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
