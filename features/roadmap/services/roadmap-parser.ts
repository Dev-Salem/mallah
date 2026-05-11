import { SupabaseClient } from '@supabase/supabase-js';

export interface ParsedResource {
    type: "VIDEO" | "ARTICLE" | "INTERNAL_TEXT" | "CERT";
    title: string;
    url?: string;
    content?: string;
    provider?: string;
    costType?: "free" | "paid" | "discounted";
    costNote?: string;
}

export interface ParsedTopic {
    orderIndex: number;
    title: string;
    type: string;
    estimatedTime: number;
    estimatedTimeText: string;
    difficulty: string;
    description: string;
    practicalOutput: string;
    learningObjectives: string[];
    coreRequirements: string[];
    evaluationCriteria: string[];
    stretchGoals: string[];
    employerSignal: string;
    effortPlanning: number;
    effortBuilding: number;
    effortPolish: number;
    skills: Array<{ id: string; name: string; category: string; level: string }>;
    resources: ParsedResource[];
}

export interface ParsedStage {
    orderIndex: number;
    title: string;
    topics: ParsedTopic[];
}

export interface ParsedCertificateSuggestion {
    id: string;
    stageLabel: string;
    afterText?: string;
    title: string;
    provider: string;
    url: string;
    costLabel?: string;
    costNote?: string;
    whyNow?: string;
}

const DASH_PATTERN = /(?:—|–|â€”|â€“)/;

function parseHeadingParts(value: string): { orderLabel: string; title: string } | null {
    const match = value.match(/^(.+?)\s*(?:—|–|â€”|â€“)\s*(.+)$/);
    if (!match) return null;

    return {
        orderLabel: match[1].trim(),
        title: match[2].trim(),
    };
}

function splitDashSegments(value: string): string[] {
    return value.split(DASH_PATTERN).map(part => part.trim()).filter(Boolean);
}

function parseMinutes(estimatedTimeText: string): number {
    const hrsRangeMatch = estimatedTimeText.match(/(\d+\.?\d*)\s*(?:-|—|–|â€”|â€“)\s*(\d+\.?\d*)\s*hrs?/i);
    const singleHrMatch = estimatedTimeText.match(/(\d+\.?\d*)\s*hrs?/i);
    const minRangeMatch = estimatedTimeText.match(/(\d+)\s*(?:-|—|–|â€”|â€“)\s*(\d+)\s*mins?/i);
    const minMatch = estimatedTimeText.match(/(\d+)\s*mins?/i);

    if (hrsRangeMatch) {
        const minVal = parseFloat(hrsRangeMatch[1]);
        const maxVal = parseFloat(hrsRangeMatch[2]);
        return Math.round(((minVal + maxVal) / 2) * 60);
    }

    if (singleHrMatch) {
        return Math.round(parseFloat(singleHrMatch[1]) * 60);
    }

    if (minRangeMatch) {
        const minVal = parseInt(minRangeMatch[1], 10);
        const maxVal = parseInt(minRangeMatch[2], 10);
        return Math.round((minVal + maxVal) / 2);
    }

    if (minMatch) {
        return parseInt(minMatch[1], 10);
    }

    const simpleDigits = estimatedTimeText.match(/(\d+)/);
    return simpleDigits ? parseInt(simpleDigits[1], 10) : 0;
}

function normalizeDifficulty(value: string): 'beginner' | 'intermediate' | 'advanced' {
    const normalized = value.toLowerCase();
    if (normalized.includes("advanced")) return "advanced";
    if (normalized.includes("intermediate")) return "intermediate";
    return "beginner";
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function extractInlineValue(block: string, labelPattern: string): string | undefined {
    const escaped = labelPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = block.match(new RegExp(`\\*\\*${escaped}:\\*\\*\\s*([^\\n]+)`, "i"));
    return match?.[1]?.trim();
}

function normalizeCostData(costLine?: string, explicitCostNote?: string): Pick<ParsedCertificateSuggestion, "costLabel" | "costNote"> {
    if (!costLine && !explicitCostNote) {
        return {};
    }

    const normalizedCostLine = costLine?.replace(/`/g, "").trim();
    const parts = normalizedCostLine ? splitDashSegments(normalizedCostLine) : [];
    const rawCostLabel = parts[0] || normalizedCostLine || undefined;
    const inlineCostNote = parts.slice(1).join(" - ").trim() || undefined;

    return {
        costLabel: rawCostLabel?.replace(/_/g, " "),
        costNote: explicitCostNote?.replace(/`/g, "").trim() || inlineCostNote,
    };
}

export class RoadmapParser {
    static parseMarkdown(content: string): { pathId: string; stages: ParsedStage[] } {
        const normalizedContent = content.replace(/\r\n/g, "\n");
        const pathIdMatch = normalizedContent.match(/\*\*Path ID:\*\* `(.+?)`/);
        const pathId = pathIdMatch ? pathIdMatch[1] : "unknown";

        const stages: ParsedStage[] = [];
        const rawStages = normalizedContent.split(/\n## Stage |^## Stage /m).slice(1);

        rawStages.forEach((sectionContent, sIdx) => {
            const firstLineBreak = sectionContent.indexOf("\n");
            if (firstLineBreak === -1) return;

            const firstLine = sectionContent.substring(0, firstLineBreak).trim();
            if (firstLine.includes("Certificate Suggestion")) return;
            if (firstLine.startsWith("[N]")) return;

            const parts = parseHeadingParts(firstLine);
            if (!parts) return;

            const stageTitle = parts.title;
            const stageOrder = parseInt(parts.orderLabel, 10) || (sIdx + 1);

            if (stages.some(stage => stage.orderIndex === stageOrder)) {
                throw new Error(`[Parser] Duplicate stage order ${stageOrder} detected in path ${pathId}`);
            }

            const sectionBody = sectionContent.substring(firstLineBreak);
            const topics: ParsedTopic[] = [];
            const rawTopics = sectionBody.split(/\n### Topic |^### Topic /m).slice(1);

            rawTopics.forEach((topicSection, topicIdx) => {
                const topicFirstLineBreak = topicSection.indexOf("\n");
                if (topicFirstLineBreak === -1) return;

                const topicFirstLine = topicSection.substring(0, topicFirstLineBreak).trim();
                const topicParts = parseHeadingParts(topicFirstLine);
                if (!topicParts) return;

                const topicTitle = topicParts.title;
                const topicOrder = topicIdx + 1;
                if (topics.some(topic => topic.orderIndex === topicOrder)) {
                    throw new Error(`[Parser] Duplicate topic order ${topicOrder} detected in path ${pathId}, stage ${stageOrder}`);
                }

                const body = topicSection.substring(topicFirstLineBreak);
                const type = body.match(/\*\*Type:\*\* (.+)/)?.[1]?.trim() || "lesson";
                const estimatedTimeText = body.match(/\*\*Estimated Time:\*\* (.+)/)?.[1]?.trim() || "";
                const estimatedTime = estimatedTimeText ? parseMinutes(estimatedTimeText) : 0;
                const difficulty = normalizeDifficulty(body.match(/\*\*Difficulty:\*\* (.+)/)?.[1]?.trim() || "beginner");
                const description = body.match(/\*\*Description:\*\* ([\s\S]+?)(?=\n\n|\n\*\*)/)?.[1]?.trim() || "";
                const practicalOutput = body.match(/\*\*(Practical Output|Requirements):\*\* ([\s\S]+?)(?=\n\n|\n---|\n###|\n\*\*)/i)?.[2]?.trim() || "";

                const learningObjectives = body.match(/\*\*Learning Objectives:\*\*([\s\S]+?)(?=\n\n|\n\*\*)/i)?.[1]
                    ?.trim()
                    .split("\n")
                    .map(line => line.replace(/^- /, "").trim())
                    .filter(Boolean) || [];

                const coreRequirements = body.match(/\*\*(Core Requirements|Requirements):\*\*([\s\S]+?)(?=\n\n|\n\*\*)/i)?.[2]
                    ?.trim()
                    .split("\n")
                    .map(line => line.replace(/^- /, "").trim())
                    .filter(Boolean) || [];

                const evaluationCriteria = body.match(/\*\*Evaluation Criteria:\*\*([\s\S]+?)(?=\n\n|\n\*\*)/i)?.[1]
                    ?.trim()
                    .split("\n")
                    .map(line => line.replace(/^- /, "").trim())
                    .filter(Boolean) || [];

                const stretchGoals = body.match(/\*\*Stretch Goals:\*\*([\s\S]+?)(?=\n\n|\n\*\*)/i)?.[1]
                    ?.trim()
                    .split("\n")
                    .map(line => line.replace(/^- /, "").trim())
                    .filter(Boolean) || [];

                const employerSignal = body.match(/\*\*Employer Signal:\*\*([\s\S]+?)(?=\n\n|\n\*\*)/i)?.[1]
                    ?.replace(/^"|"$/g, "")
                    .trim() || "";

                const effortPlanning = parseInt(body.match(/\*\*Planning:\*\* (\d+)%/i)?.[1] || "0", 10);
                const effortBuilding = parseInt(body.match(/\*\*Building:\*\* (\d+)%/i)?.[1] || "0", 10);
                const effortPolish = parseInt(body.match(/\*\*Polish:\*\* (\d+)%/i)?.[1] || "0", 10);

                const skills: ParsedTopic["skills"] = [];
                const skillsMatch = body.match(/\*\*Skills (Unlocked|Demonstrated):\*\*([\s\S]+?)(?=\n\n|\n---|\n###|\n\*\*Resources:)/i);
                if (skillsMatch) {
                    const skillLines = skillsMatch[2].trim().split("\n");
                    skillLines.forEach(line => {
                        const match = line.match(/- (.+?) \(`(.+?)`\)\s*(?:—|–|â€”|â€“)\s*`(.+?)`/);
                        if (!match) return;

                        const cleanName = match[1].trim().replace(/\*+/g, "").trim();
                        skills.push({
                            name: cleanName,
                            id: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""),
                            category: match[2],
                            level: match[3],
                        });
                    });
                }

                const resources: ParsedResource[] = [];
                const resourcesMatch = body.match(/\*\*Resources:\*\*([\s\S]+)/);
                if (resourcesMatch) {
                    const resourceBlock = resourcesMatch[1].split(/\n---|###/)[0].trim();
                    resourceBlock.split("\n").forEach(line => {
                        const cleanLine = line.trim();

                        if (cleanLine.includes("[VIDEO]")) {
                            const parts = splitDashSegments(cleanLine);
                            resources.push({
                                type: "VIDEO",
                                title: parts[0].replace("- [VIDEO] ", "").trim(),
                                url: parts[parts.length - 1]?.trim(),
                            });
                            return;
                        }

                        if (cleanLine.includes("[ARTICLE]")) {
                            const parts = splitDashSegments(cleanLine);
                            resources.push({
                                type: "ARTICLE",
                                title: parts[0].replace("- [ARTICLE] ", "").trim(),
                                url: parts[parts.length - 1]?.trim(),
                            });
                            return;
                        }

                        if (cleanLine.includes("[INTERNAL_TEXT]")) {
                            resources.push({
                                type: "INTERNAL_TEXT",
                                title: "Mallah Context",
                                content: cleanLine.replace("- [INTERNAL_TEXT] ", "").trim(),
                            });
                            return;
                        }

                        if (cleanLine.includes("[CERT]")) {
                            const parts = splitDashSegments(cleanLine);
                            resources.push({
                                type: "CERT",
                                title: parts[0].replace("- [CERT] ", "").trim(),
                                provider: parts[1]?.trim(),
                                url: parts[2]?.trim(),
                                costType: (parts[3]?.trim() as ParsedResource["costType"]) || undefined,
                                costNote: parts[4]?.trim(),
                                content: parts[4]?.trim(),
                            });
                        }
                    });
                }

                topics.push({
                    orderIndex: topicOrder,
                    title: topicTitle,
                    type,
                    estimatedTime,
                    estimatedTimeText,
                    difficulty,
                    description,
                    practicalOutput,
                    learningObjectives,
                    coreRequirements,
                    evaluationCriteria,
                    stretchGoals,
                    employerSignal,
                    effortPlanning,
                    effortBuilding,
                    effortPolish,
                    skills,
                    resources,
                });
            });

            if (topics.length > 0) {
                stages.push({
                    orderIndex: stageOrder,
                    title: stageTitle,
                    topics,
                });
            }
        });

        return { pathId, stages };
    }

    static parseCertificateSuggestions(content: string): ParsedCertificateSuggestion[] {
        const normalizedContent = content.replace(/\r\n/g, "\n");
        const certificateSectionMatch = normalizedContent.match(/\n## Certificate Suggestions\s*([\s\S]+)/i);
        if (!certificateSectionMatch) {
            return [];
        }

        const certificateSection = certificateSectionMatch[1];
        const rawBlocks = `\n${certificateSection}`.split(/\n### /m).slice(1);
        const suggestions: ParsedCertificateSuggestion[] = [];

        rawBlocks.forEach(rawBlock => {
            const firstLineBreak = rawBlock.indexOf("\n");
            if (firstLineBreak === -1) return;

            const heading = rawBlock.substring(0, firstLineBreak).trim();
            if (!heading.toLowerCase().includes("certificate suggestion")) return;

            const body = rawBlock.substring(firstLineBreak);
            const afterText = body.match(/\*\(After:\s*([^)]+)\)\*/i)?.[1]?.trim();
            const certificatePattern = /\*\*Certificate(?:\s+\d+)?:\*\*\s*([^\n]+)\n([\s\S]*?)(?=\n\*\*Certificate(?:\s+\d+)?:\*\*|\n---|\n### |\n## |\s*$)/gi;
            let certificateMatch: RegExpExecArray | null;
            let certificateIndex = 0;

            while ((certificateMatch = certificatePattern.exec(body)) !== null) {
                certificateIndex += 1;

                const detailsBlock = certificateMatch[2];
                const provider = extractInlineValue(detailsBlock, "Provider");
                const url = extractInlineValue(detailsBlock, "URL");
                const costLine = extractInlineValue(detailsBlock, "Cost");
                const explicitCostNote = extractInlineValue(detailsBlock, "cost_note");
                const whyNow = detailsBlock.match(/\*\*Why now:\*\*\s*([\s\S]*?)(?=\n\*\*[A-Za-z]|\n---|\n### |\n## |\s*$)/i)?.[1]?.trim();
                const { costLabel, costNote } = normalizeCostData(costLine, explicitCostNote);

                if (!provider || !url) {
                    continue;
                }

                const title = certificateMatch[1].trim();
                suggestions.push({
                    id: `${slugify(heading)}_${certificateIndex}_${slugify(title)}`,
                    stageLabel: heading.replace(/\s*Certificate Suggestion\s*$/i, "").trim(),
                    afterText,
                    title,
                    provider,
                    url,
                    costLabel,
                    costNote,
                    whyNow,
                });
            }
        });

        return suggestions;
    }

    static async syncToDatabase(pathId: string, stages: ParsedStage[], supabase: SupabaseClient) {
        console.log(`[Sync] Starting sequential sync for path: ${pathId}`);

        for (const stage of stages) {
            console.log(`[Sync]   Syncing stage: ${stage.title}`);
            const { data: stageRow, error: stageError } = await supabase
                .from("stages")
                .upsert({
                    path_id: pathId,
                    title: stage.title,
                    order_index: stage.orderIndex,
                    difficulty_level: "beginner",
                }, { onConflict: "path_id, order_index" })
                .select("stage_id")
                .single();

            if (stageError) {
                throw new Error(`[Sync] Stage ${stage.title} failed: ${stageError.message}`);
            }

            for (const topic of stage.topics) {
                let topicType = "lesson";
                const normalizedType = topic.type.toLowerCase();
                if (normalizedType.includes("capstone")) topicType = "project_capstone";
                else if (normalizedType.includes("project")) topicType = "project_milestone";
                else if (normalizedType.includes("concept")) topicType = "concept";
                else if (normalizedType.includes("lab")) topicType = "lesson_lab";

                const { data: topicRow, error: topicError } = await supabase
                    .from("topics")
                    .upsert({
                        stage_id: stageRow.stage_id,
                        title: topic.title,
                        summary: topic.description,
                        topic_type: topicType,
                        estimated_time_min: topic.estimatedTime,
                        estimated_time_text: topic.estimatedTimeText,
                        difficulty_level: topic.difficulty as 'beginner' | 'intermediate' | 'advanced',
                        order_index: topic.orderIndex,
                    }, { onConflict: "stage_id, order_index" })
                    .select("topic_id")
                    .single();

                if (topicError) {
                    throw new Error(`[Sync] Topic ${topic.title} failed: ${topicError.message}`);
                }

                await supabase.from("topic_resources").delete().eq("topic_id", topicRow.topic_id);
                if (topic.resources.length > 0) {
                    const resourcePayloads = topic.resources.map((resource, index) => ({
                        topic_id: topicRow.topic_id,
                        resource_type: resource.type,
                        title: resource.title,
                        url: resource.url,
                        content: resource.content,
                        provider: resource.provider,
                        cost_type: resource.costType,
                        cost_note: resource.costNote,
                        order_index: index + 1,
                    }));

                    const { error: resourceError } = await supabase.from("topic_resources").insert(resourcePayloads);
                    if (resourceError) {
                        throw new Error(`[Sync] Resources for ${topic.title} failed: ${resourceError.message}`);
                    }
                }

                await supabase.from("topic_skills").delete().eq("topic_id", topicRow.topic_id);
                const uniqueSkills = Array.from(new Map(topic.skills.map(skill => [skill.id, skill])).values());

                for (const skill of uniqueSkills) {
                    const { error: skillError } = await supabase.from("skills").upsert({
                        skill_id: skill.id,
                        name: skill.name,
                        category: skill.category,
                    }, { onConflict: "skill_id" });

                    if (skillError) {
                        throw new Error(`[Sync] Skill ${skill.name} failed: ${skillError.message}`);
                    }

                    const { error: topicSkillError } = await supabase.from("topic_skills").upsert({
                        topic_id: topicRow.topic_id,
                        skill_id: skill.id,
                    }, { onConflict: "topic_id, skill_id" });

                    if (topicSkillError) {
                        throw new Error(`[Sync] Skill link ${skill.name} failed: ${topicSkillError.message}`);
                    }
                }

                if (topicType === "project_milestone" || topicType === "project_capstone") {
                    const { data: projectRow, error: projectError } = await supabase
                        .from("projects")
                        .upsert({
                            stage_id: stageRow.stage_id,
                            title: topic.title,
                            description: topic.practicalOutput || topic.description,
                            overview: topic.description || null,
                            difficulty_level: topic.difficulty as 'beginner' | 'intermediate' | 'advanced',
                            learning_objectives: topic.learningObjectives,
                            core_requirements: topic.coreRequirements,
                            evaluation_criteria: topic.evaluationCriteria,
                            quality_signals: topic.evaluationCriteria,
                            stretch_goals: topic.stretchGoals,
                            employer_signal: topic.employerSignal,
                            effort_planning: topic.effortPlanning ? `${topic.effortPlanning}%` : null,
                            effort_building: topic.effortBuilding ? `${topic.effortBuilding}%` : null,
                            effort_polish: topic.effortPolish ? `${topic.effortPolish}%` : null,
                        }, { onConflict: "stage_id, title" })
                        .select("project_id")
                        .single();

                    if (projectError) {
                        throw new Error(`[Sync] Project ${topic.title} failed: ${projectError.message}`);
                    }

                    await supabase.from("project_skills").delete().eq("project_id", projectRow.project_id);
                    if (uniqueSkills.length > 0) {
                        const projectSkillPayloads = uniqueSkills.map(skill => ({
                            project_id: projectRow.project_id,
                            skill_id: skill.id,
                        }));

                        const { error: projectSkillError } = await supabase.from("project_skills").insert(projectSkillPayloads);
                        if (projectSkillError) {
                            throw new Error(`[Sync] Project skills for ${topic.title} failed: ${projectSkillError.message}`);
                        }
                    }
                }
            }
        }

        console.log(`[Sync] Path ${pathId} successfully seeded.`);
    }
}
