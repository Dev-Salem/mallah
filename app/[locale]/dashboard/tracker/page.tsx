import { Metadata } from "next";
import { getApplicationsAction } from "@/features/application-tracker/actions/tracker.actions";
import { TrackerContainer } from "@/features/application-tracker/components/TrackerContainer";

export const metadata: Metadata = {
  title: "Application Tracker | Mallah",
  description: "Manage and track your job application pipeline.",
};

export default async function TrackerPage() {
  const applications = await getApplicationsAction();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <TrackerContainer initialApplications={applications} />
    </div>
  );
}
