import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <div className="w-full h-64 rounded-xl bg-muted/20 animate-pulse" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOS Card Skeleton */}
         <Card className="h-80 flex flex-col items-center justify-center space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-32 rounded-full" />
         </Card>

         {/* Timer Card Skeleton */}
         <Card className="h-80 flex flex-col items-center justify-center space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-32 rounded-full" />
         </Card>
      </div>
      
      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
             <Card key={i} className="h-32 p-4 space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
             </Card>
        ))}
      </div>
    </div>
  );
}
