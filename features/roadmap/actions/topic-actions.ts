'use server';

import { createClient } from '@/lib/supabase/server';
import { Topic, TopicResource } from '../types';

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
            resources:topic_resources (*)
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

    const sortedResources = (topicData.resources || []).sort((a: any, b: any) => a.order_index - b.order_index);

    return {
        ...topicData,
        resources: sortedResources,
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

    return { success: true };
}
