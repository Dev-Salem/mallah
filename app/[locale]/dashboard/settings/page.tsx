import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getProfileData, ProfileSettingsClient } from "@/features/profile-settings";

export default async function SettingsPage() {
    const data = await getProfileData();
    const locale = await getLocale();

    if ("error" in data) {
        if (data.error === "Not authenticated") {
            redirect(`/${locale}/login`);
        }
        return <div className="p-8 text-destructive font-mono uppercase">Error: {data.error}</div>;
    }

    return <ProfileSettingsClient data={data} />;
}
