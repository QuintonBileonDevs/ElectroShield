import { ClientEcosystemPage } from "./ClientEcosystemPage";

export function generateStaticParams() {
  return [
    { slug: "individuals" },
    { slug: "families" },
    { slug: "retailers" },
    { slug: "enterprises" },
    { slug: "burs" },
    { slug: "insurance" },
    { slug: "academic-institutions" },
    { slug: "ewaste" },
    { slug: "repair-centers" },
    { slug: "mno" },
    { slug: "pawn-shops" },
    { slug: "developers" },
    { slug: "police" }
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EcosystemSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ClientEcosystemPage slug={resolvedParams.slug} />;
}
