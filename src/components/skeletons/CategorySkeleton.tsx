import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const CategoryCardSkeleton = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 text-center">
        <div className="mb-3 flex justify-center">
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
};

export const CategoryGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
};
