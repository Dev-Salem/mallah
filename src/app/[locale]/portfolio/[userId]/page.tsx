import { getPublicPortfolio } from "@/features/skills-hub/services/skills-hub-service";
import { PublicPortfolioView } from "@/features/skills-hub/components/PublicPortfolioView";
import { notFound } from "next/navigation";

interface PortfolioPageProps {
  params: Promise<{ userId: string }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { userId } = await params;
  const model = await getPublicPortfolio(userId);

  if (!model) {
    notFound();
  }

  return <PublicPortfolioView data={model} />;
}

