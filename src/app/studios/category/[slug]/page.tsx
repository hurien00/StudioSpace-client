import { Suspense } from "react";
import CategoryClientContent from "./categoryClientContent";

export async function generateStaticParams() {
  return [
    { slug: "photo-studio" },
    { slug: "film-stage" },
    { slug: "podcast-lounge" },
    { slug: "music-suite" },
    { slug: "workshop" },
  ];
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground animate-pulse text-lg">
            Loading category studios...
          </p>
        </div>
      }
    >
      <CategoryWrapper params={params} />
    </Suspense>
  );
}

async function CategoryWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <CategoryClientContent slug={slug} />;
}