import { DashboardClient } from "../DashboardClient";

export function generateStaticParams() {
  return [
    { slug: "individual" },
    { slug: "individuals" },
    { slug: "family" },
    { slug: "families" },
    { slug: "retailer" },
    { slug: "retailers" },
    { slug: "insurer" },
    { slug: "insurance" },
    { slug: "corporate" },
    { slug: "enterprises" },
    { slug: "developer" },
    { slug: "developers" },
    { slug: "repair_centers" },
    { slug: "repair-centers" },
    { slug: "academic_institutions" },
    { slug: "academic-institutions" },
    { slug: "recycler" },
    { slug: "ewaste" },
    { slug: "mno" },
    { slug: "police" },
    { slug: "burs" },
    { slug: "bocra" },
    { slug: "pawn-shops" }
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <DashboardClient initialSlug={resolvedParams.slug} />;
}
