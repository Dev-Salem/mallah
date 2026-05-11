import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { RoadmapParser } from "./roadmap-parser";

export const ROADMAP_FILE_BY_PATH_ID = {
    frontend: "frontend-roadmap.md",
    fullstack: "fullstack-roadmap.md",
    cybersecurity: "cybersecurity-roadmap.md",
    datascience: "datascience-roadmap.md",
} as const;

export type RoadmapPathId = keyof typeof ROADMAP_FILE_BY_PATH_ID;
type RoadmapFileName = (typeof ROADMAP_FILE_BY_PATH_ID)[RoadmapPathId];

export interface SeedRoadmapsInput {
    pathIds?: RoadmapPathId[];
    files?: RoadmapFileName[];
}

export interface RoadmapSeedResult {
    file: string;
    pathId: string;
    expectedPathId: string;
    parsedStageCount: number;
    parsedTopicCount: number;
    parsedProjectCount: number;
    dbStageCount: number;
    dbTopicCount: number;
    dbProjectCount: number;
    status: "success" | "error";
    message?: string;
}

const ROADMAPS_DIR = path.join(process.cwd(), "docs", "mallah-roadmap-and-topic-viewer");
const KNOWN_PATH_IDS = Object.keys(ROADMAP_FILE_BY_PATH_ID) as RoadmapPathId[];
const KNOWN_FILES = Object.values(ROADMAP_FILE_BY_PATH_ID) as RoadmapFileName[];

function getExpectedPathIdForFile(file: string): RoadmapPathId | null {
    const match = Object.entries(ROADMAP_FILE_BY_PATH_ID).find(([, knownFile]) => knownFile === file);
    return (match?.[0] as RoadmapPathId | undefined) ?? null;
}

function resolveTargets(input: SeedRoadmapsInput): Array<{ pathId: RoadmapPathId; file: RoadmapFileName }> {
    const targets = new Map<RoadmapPathId, RoadmapFileName>();

    for (const pathId of input.pathIds ?? []) {
        if (!KNOWN_PATH_IDS.includes(pathId)) {
            throw new Error(`Unsupported path id: ${pathId}`);
        }
        targets.set(pathId, ROADMAP_FILE_BY_PATH_ID[pathId]);
    }

    for (const file of input.files ?? []) {
        if (!KNOWN_FILES.includes(file)) {
            throw new Error(`Unsupported roadmap file: ${file}`);
        }

        const pathId = getExpectedPathIdForFile(file);
        if (!pathId) {
            throw new Error(`Could not map file to path id: ${file}`);
        }

        targets.set(pathId, file);
    }

    if (targets.size === 0) {
        throw new Error("Provide at least one roadmap path id or file to seed.");
    }

    return Array.from(targets.entries()).map(([pathId, file]) => ({ pathId, file }));
}

async function getPathCounts(supabase: SupabaseClient, pathId: string) {
    const { count: stageCount, error: stageCountError } = await supabase
        .from("stages")
        .select("stage_id", { count: "exact", head: true })
        .eq("path_id", pathId);

    if (stageCountError) {
        throw new Error(`Failed to count stages for ${pathId}: ${stageCountError.message}`);
    }

    const { data: stageRows, error: stageRowsError } = await supabase
        .from("stages")
        .select("stage_id")
        .eq("path_id", pathId);

    if (stageRowsError) {
        throw new Error(`Failed to load stages for ${pathId}: ${stageRowsError.message}`);
    }

    const stageIds = (stageRows ?? []).map(row => row.stage_id);
    if (stageIds.length === 0) {
        return {
            stageCount: stageCount ?? 0,
            topicCount: 0,
            projectCount: 0,
        };
    }

    const { count: topicCount, error: topicCountError } = await supabase
        .from("topics")
        .select("topic_id", { count: "exact", head: true })
        .in("stage_id", stageIds);

    if (topicCountError) {
        throw new Error(`Failed to count topics for ${pathId}: ${topicCountError.message}`);
    }

    const { count: projectCount, error: projectCountError } = await supabase
        .from("projects")
        .select("project_id", { count: "exact", head: true })
        .in("stage_id", stageIds);

    if (projectCountError) {
        throw new Error(`Failed to count projects for ${pathId}: ${projectCountError.message}`);
    }

    return {
        stageCount: stageCount ?? 0,
        topicCount: topicCount ?? 0,
        projectCount: projectCount ?? 0,
    };
}

export async function seedRoadmaps(input: SeedRoadmapsInput, supabase: SupabaseClient): Promise<RoadmapSeedResult[]> {
    const targets = resolveTargets(input);
    const { data: pathRows, error: pathsError } = await supabase
        .from("paths")
        .select("path_id");

    if (pathsError) {
        throw new Error(`Failed to load paths: ${pathsError.message}`);
    }

    const validPathIds = new Set((pathRows ?? []).map(row => row.path_id));
    const results: RoadmapSeedResult[] = [];

    for (const target of targets) {
        const filePath = path.join(ROADMAPS_DIR, target.file);

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Roadmap file not found: ${target.file}`);
            }

            const content = fs.readFileSync(filePath, "utf-8");
            const { pathId, stages } = RoadmapParser.parseMarkdown(content);
            const parsedTopicCount = stages.reduce((total, stage) => total + stage.topics.length, 0);
            const parsedProjectCount = stages.reduce(
                (total, stage) => total + stage.topics.filter(topic => {
                    const normalizedType = topic.type.toLowerCase();
                    return normalizedType.includes("project") || normalizedType.includes("capstone");
                }).length,
                0
            );

            if (pathId !== target.pathId) {
                throw new Error(`Parsed path id "${pathId}" does not match expected path id "${target.pathId}"`);
            }

            if (!validPathIds.has(pathId)) {
                throw new Error(`Parsed path id "${pathId}" does not exist in public.paths`);
            }

            if (stages.length === 0 || parsedTopicCount === 0) {
                throw new Error(`Parsed roadmap is empty for ${target.file}`);
            }

            await RoadmapParser.syncToDatabase(pathId, stages, supabase);
            const dbCounts = await getPathCounts(supabase, pathId);

            results.push({
                file: target.file,
                pathId,
                expectedPathId: target.pathId,
                parsedStageCount: stages.length,
                parsedTopicCount,
                parsedProjectCount,
                dbStageCount: dbCounts.stageCount,
                dbTopicCount: dbCounts.topicCount,
                dbProjectCount: dbCounts.projectCount,
                status: "success",
            });
        } catch (error) {
            results.push({
                file: target.file,
                pathId: target.pathId,
                expectedPathId: target.pathId,
                parsedStageCount: 0,
                parsedTopicCount: 0,
                parsedProjectCount: 0,
                dbStageCount: 0,
                dbTopicCount: 0,
                dbProjectCount: 0,
                status: "error",
                message: error instanceof Error ? error.message : "Unknown seeding error",
            });
        }
    }

    return results;
}
