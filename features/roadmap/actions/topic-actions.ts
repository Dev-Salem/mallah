'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Topic } from '../types';

export async function getTopicAction(topicId: string): Promise<Topic | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { data: topicData, error } = await supabase
        .from('topics')
        .select(`
            *,
            resources:topic_resources (*),
            skills:topic_skills (
                skills (*)
            )
        `)
        .eq('topic_id', topicId)
        .single();

    if (error || !topicData) {
        console.error('Error fetching topic:', error);
        return null;
    }

    // Get user progress
    const { data: progressData } = await supabase
        .from('user_progress')
        .select('status')
        .eq('user_id', user.id)
        .eq('topic_id', topicId)
        .maybeSingle();

    const sortedResources = (topicData.resources || []).sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index);
    const mappedSkills = (topicData.skills || [])
        .map((ts: { skills: unknown }) => ts.skills)
        .filter(Boolean);

    return {
        ...topicData,
        resources: sortedResources,
        skills: mappedSkills,
        user_status: progressData?.status || 'not_started'
    } as Topic;
}

export async function markTopicCompleteAction(topicId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Upsert user_progress
    const { error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: user.id,
            topic_id: topicId,
            status: 'completed',
            completed_at: new Date().toISOString()
        }, { onConflict: 'user_id, topic_id' });

    if (error) {
        console.error('Error marking topic complete:', error);
        return { success: false, error: error.message };
    }

    // Handle skill acquisition
    const { data: topicSkills } = await supabase
        .from('topic_skills')
        .select('skill_id')
        .eq('topic_id', topicId);

    if (topicSkills && topicSkills.length > 0) {
        const skillIds = topicSkills.map(ts => ts.skill_id);
        const { data: existingSkills } = await supabase
            .from('user_skills')
            .select('skill_id, level')
            .eq('user_id', user.id)
            .in('skill_id', skillIds);
            
        const existingSkillMap = new Map(existingSkills?.map(s => [s.skill_id, s.level]) || []);
        
        const finalSkillUpserts = topicSkills.map(ts => {
            const currentLevel = existingSkillMap.get(ts.skill_id);
            let nextLevel = 'beginner';
            if (currentLevel === 'beginner') nextLevel = 'intermediate';
            if (currentLevel === 'intermediate' || currentLevel === 'advanced') nextLevel = currentLevel; // Don't downgrade
            
            return {
                user_id: user.id,
                skill_id: ts.skill_id,
                level: currentLevel ? nextLevel : 'beginner',
                source: 'roadmap',
                last_updated_at: new Date().toISOString()
            };
        });

        await supabase.from('user_skills').upsert(finalSkillUpserts, { onConflict: 'user_id, skill_id' });
    }

    revalidatePath('/dashboard', 'layout');
    return { success: true };
}

export async function getAdjacentTopics(topicId: string): Promise<{ previousTopicId: string | null; nextTopicId: string | null }> {
    const supabase = await createClient();

    // Get the current topic to find its stage_id and order_index
    const { data: currentTopic, error: topicError } = await supabase
        .from('topics')
        .select('stage_id, order_index')
        .eq('topic_id', topicId)
        .single();

    if (topicError || !currentTopic) {
        return { previousTopicId: null, nextTopicId: null };
    }

    // Get all topics in the same stage, ordered by order_index
    const { data: stageTopics, error: stageError } = await supabase
        .from('topics')
        .select('topic_id, order_index')
        .eq('stage_id', currentTopic.stage_id)
        .order('order_index', { ascending: true });

    if (stageError || !stageTopics) {
        return { previousTopicId: null, nextTopicId: null };
    }

    const currentIndex = stageTopics.findIndex(t => t.topic_id === topicId);

    return {
        previousTopicId: currentIndex > 0 ? stageTopics[currentIndex - 1].topic_id : null,
        nextTopicId: currentIndex < stageTopics.length - 1 ? stageTopics[currentIndex + 1].topic_id : null,
    };
}

export async function getTopicBreadcrumb(topicId: string): Promise<{ pathName: string; stageTitle: string; topicPosition: number; totalTopicsInStage: number } | null> {
    const supabase = await createClient();

    // Get topic -> stage -> path
    const { data: topicData, error } = await supabase
        .from('topics')
        .select('order_index, stage_id')
        .eq('topic_id', topicId)
        .single();

    if (error || !topicData) return null;

    const { data: stageData, error: stageError } = await supabase
        .from('stages')
        .select('title, path_id')
        .eq('stage_id', topicData.stage_id)
        .single();

    if (stageError || !stageData) return null;

    const { data: pathData, error: pathError } = await supabase
        .from('paths')
        .select('name')
        .eq('path_id', stageData.path_id)
        .single();

    if (pathError || !pathData) return null;

    // Count topics in this stage
    const { count } = await supabase
        .from('topics')
        .select('topic_id', { count: 'exact', head: true })
        .eq('stage_id', topicData.stage_id);

    return {
        pathName: pathData.name,
        stageTitle: stageData.title,
        topicPosition: topicData.order_index,
        totalTopicsInStage: count || 0,
    };
}
