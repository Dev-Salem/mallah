import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  changePassword,
  getProfile,
  rerunRecommendation,
  updateAIPrefs,
  updateLearningPrefs,
  updateProfile,
} from "@/features/profile/services/profile-service";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) redirect(`/${locale}/login`);
  const userId = user.id;

  const profile = await getProfile(userId);

  async function updateProfileAction(formData: FormData) {
    "use server";
    await updateProfile(userId, {
      first_name: String(formData.get("first_name") ?? ""),
      last_name: String(formData.get("last_name") ?? ""),
      background_type: String(formData.get("background_type") ?? ""),
      primary_goal: String(formData.get("primary_goal") ?? ""),
    });
  }

  async function updateLearningAction(formData: FormData) {
    "use server";
    await updateLearningPrefs(userId, {
      weekly_hours_category: String(formData.get("weekly_hours_category") ?? "4-7") as "0-3" | "4-7" | "8-12" | "13+",
    });
  }

  async function updateAIAction(formData: FormData) {
    "use server";
    await updateAIPrefs(userId, {
      ai_language_pref: String(formData.get("ai_language_pref") ?? "EN") as "AR" | "EN" | "MIX",
      ai_detail_level: String(formData.get("ai_detail_level") ?? "Balanced") as "Short" | "Balanced" | "Detailed",
    });
  }

  async function passwordAction(formData: FormData) {
    "use server";
    await changePassword(userId, {
      old_password: String(formData.get("old_password") ?? ""),
      new_password: String(formData.get("new_password") ?? ""),
      confirm_password: String(formData.get("confirm_password") ?? ""),
    });
  }

  async function reassessAction() {
    "use server";
    await rerunRecommendation(userId);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-white font-black">Profile & Settings</h1>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">Profile</h2>
        <form action={updateProfileAction} className="grid md:grid-cols-2 gap-3">
          <input name="first_name" defaultValue={profile.first_name ?? ""} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" placeholder="First name" />
          <input name="last_name" defaultValue={profile.last_name ?? ""} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" placeholder="Last name" />
          <input name="background_type" defaultValue={profile.background_type ?? ""} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" placeholder="Background type" />
          <input name="primary_goal" defaultValue={profile.primary_goal ?? ""} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" placeholder="Primary goal" />
          <div className="md:col-span-2">
            <Button>Save Profile</Button>
          </div>
        </form>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">Learning Preferences</h2>
        <form action={updateLearningAction} className="flex gap-3 items-center">
          <select name="weekly_hours_category" defaultValue={profile.weekly_hours_category ?? "4-7"} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200">
            <option value="0-3">0-3</option>
            <option value="4-7">4-7</option>
            <option value="8-12">8-12</option>
            <option value="13+">13+</option>
          </select>
          <Button>Save Learning Prefs</Button>
        </form>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">AI Preferences</h2>
        <form action={updateAIAction} className="grid md:grid-cols-2 gap-3">
          <select name="ai_language_pref" defaultValue={profile.ai_language_pref ?? "EN"} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200">
            <option value="AR">Arabic</option>
            <option value="EN">English</option>
            <option value="MIX">Mix</option>
          </select>
          <select name="ai_detail_level" defaultValue={profile.ai_detail_level ?? "Balanced"} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200">
            <option value="Short">Short</option>
            <option value="Balanced">Balanced</option>
            <option value="Detailed">Detailed</option>
          </select>
          <div className="md:col-span-2">
            <Button>Save AI Prefs</Button>
          </div>
        </form>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">Password</h2>
        <form action={passwordAction} className="grid md:grid-cols-3 gap-3">
          <input name="old_password" type="password" placeholder="Current password" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" />
          <input name="new_password" type="password" placeholder="New password" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" />
          <input name="confirm_password" type="password" placeholder="Confirm password" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" />
          <div className="md:col-span-3">
            <Button>Change Password</Button>
          </div>
        </form>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">Controlled Reassessment</h2>
        <p className="text-slate-400 text-sm mb-3">
          Generates a fresh recommendation without automatically changing your active path.
        </p>
        <form action={reassessAction}>
          <Button variant="outline">Re-run Recommendation</Button>
        </form>
      </section>
    </div>
  );
}
