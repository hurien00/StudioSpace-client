import { Suspense } from "react";
import StudioDetailClient from "./StudioDetailClient";

export default function StudioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[75vh] flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-base font-semibold">
            Loading studio details...
          </p>
        </div>
      }
    >
      <StudioContent params={params} />
    </Suspense>
  );
}

async function StudioContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const studioId = resolvedParams.id;

  return <StudioDetailClient studioId={studioId} />;
}