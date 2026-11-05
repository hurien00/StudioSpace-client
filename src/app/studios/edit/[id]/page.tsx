import { Suspense } from "react";
import EditStudioClient from "./EditStudioClient";
import PrivateRoute from "@/components/PrivateRoute";

interface EditStudioPageProps {
  params: Promise<{ id: string }>;
}

export default function EditStudioPage({ params }: EditStudioPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[75vh] flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-sm font-bold">
            Loading edit page...
          </p>
        </div>
      }
    >
      <EditStudioContent params={params} />
    </Suspense>
  );
}

async function EditStudioContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <PrivateRoute>
      <EditStudioClient studioId={resolvedParams.id} />
    </PrivateRoute>
  );
}