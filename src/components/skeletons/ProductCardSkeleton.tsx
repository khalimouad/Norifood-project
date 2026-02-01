import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const ProductCardSkeleton = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <Skeleton className="w-full h-32 md:h-48 rounded-t-lg rounded-b-none" />
        
        <div className="p-2 md:p-4 space-y-2 md:space-y-3">
          {/* Title skeleton */}
          <Skeleton className="h-4 md:h-5 w-3/4" />
          <Skeleton className="h-4 md:h-5 w-1/2" />
          
          {/* Price skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 md:h-6 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
