import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const CartItemSkeleton = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image */}
          <Skeleton className="w-full sm:w-24 md:w-28 h-24 md:h-28 rounded-lg flex-shrink-0" />
          
          <div className="flex-1 space-y-3">
            {/* Title and delete */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
            
            {/* Quantity and total */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-12 ml-auto" />
                <Skeleton className="h-7 w-24" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CartSummarySkeleton = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export const CartPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        <div className="space-y-6">
          <CartSummarySkeleton />
        </div>
      </div>
    </div>
  );
};
