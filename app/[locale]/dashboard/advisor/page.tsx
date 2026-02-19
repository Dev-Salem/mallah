import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getUserSessions, getSessionMessages } from "@/features/career-advisor/services/chat-service";
import { CareerAdvisorClient } from "@/features/career-advisor/components/CareerAdvisorClient";

interface Props {
    searchParams: Promise<{ session?: string }>;
}

export default async function AdvisorPage({ searchParams }: Props) {
    const locale = await getLocale();
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/login`);
    }

    const params = await searchParams;
    const sessions = await getUserSessions(user.id);

    let activeSessionId: string | null = null;
    let initialMessages: any[] = [];

    if (params.session) {
        activeSessionId = params.session;
        initialMessages = await getSessionMessages(params.session);
    } else if (sessions.length > 0) {
        activeSessionId = sessions[0].id;
        initialMessages = await getSessionMessages(sessions[0].id);
    }

    return (
        <CareerAdvisorClient
            sessions={sessions}
            activeSessionId={activeSessionId}
            initialMessages={initialMessages}
        />
    );
}
