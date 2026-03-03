import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export interface ParsedResource {
    type: "VIDEO" | "ARTICLE" | "INTERNAL_TEXT" | "CERT";
    title: string;
    url?: string;
    content?: string;
    provider?: string;
}

export interface ParsedTopic {
    orderIndex: number;
    title: string;
    type: string;
    estimatedTime: number;
    difficulty: string;
    description: string;
    practicalOutput: string;
    skills: Array<{ id: string; name: string; category: string; level: string }>;
    resources: ParsedResource[];
}

export interface ParsedStage {
    orderIndex: number;
    title: string;
    topics: ParsedTopic[];
}

export class RoadmapParser {
    static parseMarkdown(content: string): { pathId: string; stages: ParsedStage[] } {
        const pathIdMatch = content.match(/\*\*Path ID:\*\* `(.+?)`/);
        const pathId = pathIdMatch ? pathIdMatch[1] : "unknown";

        const stages: ParsedStage[] = [];
        // Match "Stage X — Title" at start of line
        const rawStages = content.split(/\n## Stage |^## Stage /m).slice(1);

        rawStages.forEach((sectionContent, sIdx) => {
            const firstLineBreak = sectionContent.indexOf("\n");
            if (firstLineBreak === -1) return;

            const firstLine = sectionContent.substring(0, firstLineBreak).trim();
            if (firstLine.includes("Certificate Suggestion")) return;
            if (firstLine.startsWith("[N]")) return;

            const parts = firstLine.split(" — ");
            if (parts.length < 2) return;

            const stageTitle = parts[1].trim();
            const stageOrder = parseInt(parts[0]) || (sIdx + 1);

            // Debug check for duplicate orders within this parsing run
            if (stages.some(s => s.orderIndex === stageOrder)) {
                console.warn(`[Parser] WARNING: Duplicate stage order ${stageOrder} detected in path ${pathId}`);
            }

            const sectionBody = sectionContent.substring(firstLineBreak);
            const topics: ParsedTopic[] = [];
            const rawTopics = sectionBody.split(/\n### Topic |^### Topic /m).slice(1);

            rawTopics.forEach((tSection, tIdx) => {
                const tFirstLineBreak = tSection.indexOf("\n");
                if (tFirstLineBreak === -1) return;

                const tFirstLine = tSection.substring(0, tFirstLineBreak).trim();
                // Format is "X.Y — Title"
                const tParts = tFirstLine.split(" — ");
                if (tParts.length < 2) return;

                const topicTitle = tParts[1].trim();
                const topicOrder = tIdx + 1;
                const body = tSection.substring(tFirstLineBreak);

                const type = body.match(/\*\*Type:\*\* (.+)/)?.[1]?.trim() || "lesson";
                const estTimeMatch = body.match(/\*\*Estimated Time:\*\* (\d+)/);
                const estTime = estTimeMatch ? parseInt(estTimeMatch[1]) : 0;
                const difficulty = body.match(/\*\*Difficulty:\*\* (.+)/)?.[1]?.trim().toLowerCase() || "beginner";

                const descMatch = body.match(/\*\*Description:\*\* ([\s\S]+?)\n\n/);
                const description = descMatch ? descMatch[1].trim() : "";

                const outputMatch = body.match(/\*\*(Practical Output|Requirements):\*\* ([\s\S]+?)(?=\n\n|\n---|\n###)/i);
                const practicalOutput = outputMatch ? outputMatch[2].trim() : "";

                // Parse Skills
                const skills: ParsedTopic["skills"] = [];
                const skillsMatch = body.match(/\*\*Skills (Unlocked|Demonstrated):\*\*([\s\S]+?)(?=\n\n|\n---|\n###|\n\*\*Resources:)/i);
                if (skillsMatch) {
                    const skillLines = skillsMatch[2].trim().split("\n");
                    skillLines.forEach(line => {
                        const m = line.match(/- (.+?) \(`(.+?)`\) — `(.+?)`/);
                        if (m) {
                            const skillName = m[1].trim();
                            const cleanName = skillName.replace(/\*+/g, "").trim();
                            skills.push({
                                name: cleanName,
                                id: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""),
                                category: m[2],
                                level: m[3]
                            });
                        }
                    });
                }

                // Parse Resources
                const resources: ParsedResource[] = [];
                const resMatch = body.match(/\*\*Resources:\*\*([\s\S]+)/);
                if (resMatch) {
                    const resBlock = resMatch[1].split(/\n---|###/)[0].trim();
                    const resLines = resBlock.split("\n");
                    resLines.forEach(line => {
                        const cleanLine = line.trim();
                        if (cleanLine.includes("[VIDEO]")) {
                            const vParts = cleanLine.split(" — ");
                            resources.push({
                                type: "VIDEO",
                                title: vParts[0].replace("- [VIDEO] ", "").trim(),
                                url: vParts[vParts.length - 1].trim()
                            });
                        } else if (cleanLine.includes("[ARTICLE]")) {
                            const aParts = cleanLine.split(" — ");
                            resources.push({
                                type: "ARTICLE",
                                title: aParts[0].replace("- [ARTICLE] ", "").trim(),
                                url: aParts[aParts.length - 1].trim()
                            });
                        } else if (cleanLine.includes("[INTERNAL_TEXT]")) {
                            resources.push({
                                type: "INTERNAL_TEXT",
                                title: "Mallah Context",
                                content: cleanLine.replace("- [INTERNAL_TEXT] ", "").trim()
                            });
                        } else if (cleanLine.includes("[CERT]")) {
                            const cParts = cleanLine.split(" — ");
                            resources.push({
                                type: "CERT",
                                title: cParts[0].replace("- [CERT] ", "").trim(),
                                url: cParts[2]?.trim() || "",
                                content: `Provider: ${cParts[1]?.trim() || "N/A"}`
                            });
                        }
                    });
                }

                topics.push({
                    orderIndex: topicOrder,
                    title: topicTitle,
                    type,
                    estimatedTime: estTime,
                    difficulty,
                    description,
                    practicalOutput,
                    skills,
                    resources
                });
            });

            if (topics.length > 0) {
                stages.push({
                    orderIndex: stageOrder,
                    title: stageTitle,
                    topics
                });
            }
        });

        return { pathId, stages };
    }

    static async syncToDatabase(pathId: string, stages: ParsedStage[], supabase: any) {
        console.log(`[Sync] Starting sequential sync for path: ${pathId}`);
        for (const stage of stages) {
            console.log(`[Sync]   Syncing stage: ${stage.title}`);
            const { data: stageRow, error: sErr } = await supabase
                .from("stages")
                .upsert({
                    path_id: pathId,
                    title: stage.title,
                    order_index: stage.orderIndex,
                    difficulty_level: "beginner"
                }, { onConflict: "path_id, order_index" })
                .select()
                .single();

            if (sErr) throw new Error(`[Sync] Stage ${stage.title} failed: ${sErr.message}`);

            for (const topic of stage.topics) {
                let tType = "lesson";
                const lowType = topic.type.toLowerCase();
                if (lowType.includes("capstone")) tType = "project_capstone";
                else if (lowType.includes("project")) tType = "project_milestone";
                else if (lowType.includes("concept")) tType = "concept";
                else if (lowType.includes("lab")) tType = "lesson_lab";

                const { data: topicRow, error: tErr } = await supabase
                    .from("topics")
                    .upsert({
                        stage_id: stageRow.stage_id,
                        title: topic.title,
                        summary: topic.description,
                        topic_type: tType,
                        estimated_time_min: topic.estimatedTime,
                        difficulty_level: topic.difficulty as any,
                        order_index: topic.orderIndex
                    }, { onConflict: "stage_id, order_index" })
                    .select()
                    .single();

                if (tErr) throw new Error(`[Sync] Topic ${topic.title} failed: ${tErr.message}`);

                // 3. Sync Resources (Sequential)
                await supabase.from("topic_resources").delete().eq("topic_id", topicRow.topic_id);
                if (topic.resources.length > 0) {
                    const payloads = topic.resources.map((r, idx) => ({
                        topic_id: topicRow.topic_id,
                        resource_type: r.type,
                        title: r.title,
                        url: r.url,
                        content: r.content,
                        order_index: idx + 1
                    }));
                    const { error: rErr } = await supabase.from("topic_resources").insert(payloads);
                    if (rErr) throw new Error(`[Sync] Resources for ${topic.title} failed: ${rErr.message}`);
                }

                // 4. Sync Skills (Sequential)
                for (const skill of topic.skills) {
                    const { error: skErr } = await supabase.from("skills").upsert({
                        skill_id: skill.id,
                        name: skill.name,
                        category: skill.category
                    }, { onConflict: "name" });
                    if (skErr) throw new Error(`[Sync] Skill ${skill.name} failed: ${skErr.message}`);

                    const { error: tsErr } = await supabase.from("topic_skills").upsert({
                        topic_id: topicRow.topic_id,
                        skill_id: skill.id
                    }, { onConflict: "topic_id, skill_id" });
                    if (tsErr) throw new Error(`[Sync] Skill link ${skill.name} failed: ${tsErr.message}`);
                }

                // 5. Sync Projects (Sequential)
                if (tType === "project_milestone" || tType === "project_capstone") {
                    const { error: pErr } = await supabase.from("projects").upsert({
                        stage_id: stageRow.stage_id,
                        title: topic.title,
                        description: topic.practicalOutput || topic.description,
                        difficulty_level: topic.difficulty as any
                    }, { onConflict: "stage_id, title" });

                    if (pErr && pErr.code !== "23505") {
                        throw new Error(`[Sync] Project ${topic.title} failed: ${pErr.message}`);
                    }
                }
            }
        }
        console.log(`[Sync] Path ${pathId} successfully seeded.`);
    }
}
