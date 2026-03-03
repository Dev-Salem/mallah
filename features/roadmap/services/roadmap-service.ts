import { createClient } from '@/lib/supabase/server';
import { RoadmapData, Stage, Topic, Project } from '../types';

export class RoadmapService {
    static async getUserRoadmap(userId: string): Promise<RoadmapData | null> {
        const supabase = await createClient();

        // 1. Get user's current path
        const { data: learner } = await supabase
            .from('learners')
            .select('current_path_id')
            .eq('id', userId)
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
                    resources:topic_resources (*)
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
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((topic: any) => {
                    // Sort resources
                    const sortedResources = (topic.resources || []).sort((a: any, b: any) => a.order_index - b.order_index);

                    return {
                        ...topic,
                        resources: sortedResources,
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
                previousStageProjectCompleted = project.user_status === 'completed';
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

        return {
            path_id: pathId,
            stages
        };
    }
}
