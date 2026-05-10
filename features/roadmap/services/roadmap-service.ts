import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { RoadmapData, Stage, Topic, Project, RoadmapCertificateStage } from '../types';
import { RoadmapParser } from './roadmap-parser';
import { ROADMAP_FILE_BY_PATH_ID } from './roadmap-seed-service';

const ROADMAPS_DIR = path.join(process.cwd(), 'docs', 'mallah-roadmap-and-topic-viewer');

async function loadCertificateStage(pathId: string): Promise<RoadmapCertificateStage | null> {
    const roadmapFile = ROADMAP_FILE_BY_PATH_ID[pathId as keyof typeof ROADMAP_FILE_BY_PATH_ID];
    if (!roadmapFile) {
        return null;
    }

    try {
        const content = await fs.readFile(path.join(ROADMAPS_DIR, roadmapFile), 'utf-8');
        const suggestions = RoadmapParser.parseCertificateSuggestions(content);

        if (suggestions.length === 0) {
            return null;
        }

        return {
            title: 'Certificate Suggestions',
            suggestions,
        };
    } catch (error) {
        console.error(`Failed to load certificate suggestions for ${pathId}:`, error);
        return null;
    }
}

export class RoadmapService {
    static async getUserRoadmap(userId: string): Promise<RoadmapData | null> {
        const supabase = await createClient();

        // 1. Get user's current path
        const { data: learner } = await supabase
            .from('learners')
            .select('current_path_id')
            .eq('user_id', userId)
            .single();

        if (!learner?.current_path_id) return null;

        const pathId = learner.current_path_id;

        // 2. Fetch all stages, topics, and projects for this path
        const { data: stagesData, error: stagesError } = await supabase
            .from('stages')
            .select(`
                *,
                topics (
                    *,
                    resources:topic_resources (*),
                    skills:topic_skills (
                        skills (*)
                    )
                ),
                projects (*)
            `)
            .eq('path_id', pathId)
            .order('order_index', { ascending: true });

        if (stagesError || !stagesData) {
            console.error('Error fetching roadmap:', stagesError);
            return null;
        }

        // 3. Fetch user progress
        const { data: topicProgressData } = await supabase
            .from('user_progress')
            .select('topic_id, status')
            .eq('user_id', userId);

        const { data: projectProgressData } = await supabase
            .from('user_projects')
            .select('project_id, status')
            .eq('user_id', userId);

        const topicProgressMap = new Map(topicProgressData?.map(p => [p.topic_id, p.status]) || []);
        const projectProgressMap = new Map(projectProgressData?.map(p => [p.project_id, p.status]) || []);

        // 4. Assemble the data and calculate unlocks
        let previousStageProjectCompleted = true; // First stage is unlocked by default

        const stages: Stage[] = stagesData.map(stage => {
            // Check if this stage is unlocked
            const isUnlocked = previousStageProjectCompleted;

            // Sort topics
            const sortedTopics = (stage.topics || [])
                .sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
                .map((topic: { resources?: { order_index: number }[], skills?: { skills: unknown }[], topic_id: string } & Record<string, unknown>) => {
                    // Sort resources
                    const sortedResources = (topic.resources || []).sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index);

                    // Extract skills from nested topic_skills relation
                    const mappedSkills = (topic.skills || [])
                        .map((ts: { skills: unknown }) => ts.skills)
                        .filter(Boolean); // Filter out any nulls

                    return {
                        ...topic,
                        resources: sortedResources,
                        skills: mappedSkills,
                        user_status: topicProgressMap.get(topic.topic_id) || 'not_started'
                    } as Topic;
                });

            // Handle project
            let project: Project | null = null;
            if (stage.projects && stage.projects.length > 0) {
                const projData = stage.projects[0];
                project = {
                    ...projData,
                    user_status: projectProgressMap.get(projData.project_id) || 'available'
                } as Project;

                // Set condition for next stage
                previousStageProjectCompleted = project.user_status === 'completed' || project.user_status === 'waiting';
            } else {
                // If no project in this stage, next stage is automatically unlocked
                previousStageProjectCompleted = true;
            }

            return {
                stage_id: stage.stage_id,
                path_id: stage.path_id,
                title: stage.title,
                order_index: stage.order_index,
                difficulty_level: stage.difficulty_level,
                is_unlocked: isUnlocked,
                topics: sortedTopics,
                project
            } as Stage;
        });

        const certificateStage = await loadCertificateStage(pathId);

        return {
            path_id: pathId,
            stages,
            certificateStage,
        };
    }

    static async initializeUserRoadmap(userId: string, pathId: string): Promise<{ success: boolean; error?: string }> {
        const supabase = await createClient();

        // 1. Fetch all stages, topics, and projects for this path
        const { data: stagesData, error: stagesError } = await supabase
            .from('stages')
            .select(`
                stage_id,
                topics (topic_id),
                projects (project_id, is_public_default)
            `)
            .eq('path_id', pathId);

        if (stagesError || !stagesData) {
            console.error('Error fetching roadmap for initialization:', stagesError);
            return { success: false, error: 'Failed to fetch roadmap stages' };
        }

        const topicProgressRows: Record<string, unknown>[] = [];
        const projectProgressRows: Record<string, unknown>[] = [];

        for (const stage of stagesData) {
            if (stage.topics) {
                for (const topic of stage.topics) {
                    topicProgressRows.push({
                        user_id: userId,
                        topic_id: topic.topic_id,
                        status: 'not_started'
                    });
                }
            }
            if (stage.projects) {
                for (const project of stage.projects) {
                    projectProgressRows.push({
                        user_id: userId,
                        project_id: project.project_id,
                        status: 'available',
                        is_public: project.is_public_default ?? true
                    });
                }
            }
        }

        // 2. Perform bulk inserts using upsert/on conflict to avoid duplicates if re-initialized
        if (topicProgressRows.length > 0) {
            const { error: topicError } = await supabase
                .from('user_progress')
                .upsert(topicProgressRows, { onConflict: 'user_id,topic_id', ignoreDuplicates: true });

            if (topicError) {
                console.error('Error initializing topic progress:', topicError);
            }
        }

        if (projectProgressRows.length > 0) {
            const { error: projectError } = await supabase
                .from('user_projects')
                .upsert(projectProgressRows, { onConflict: 'user_id,project_id', ignoreDuplicates: true });

            if (projectError) {
                console.error('Error initializing project progress:', projectError);
            }
        }

        return { success: true };
    }
}
