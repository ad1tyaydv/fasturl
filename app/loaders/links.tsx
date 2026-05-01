import { Skeleton } from "@/components/ui/skeleton"


export function SkeletonLoader() {
  
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-4" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="flex justify-end w-full mb-4 mt-2">
         <Skeleton className="h-10 w-full sm:w-[280px] rounded-lg" />
      </div>

      <div className="flex flex-col w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-4 px-4 border-b border-border/60 w-full">
            
            <div className="flex items-center gap-4 w-[45%] min-w-0 pr-4">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="flex flex-col gap-3 w-full">
                <Skeleton className="h-4 w-3/4 max-w-[200px]" />
                <Skeleton className="h-3 w-1/2 max-w-[150px]" />
              </div>
            </div>

            <div className="w-[15%] shrink-0">
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex items-center justify-end gap-5 w-[20%] shrink-0">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-5 w-5 rounded-sm" />
            </div>

            <div className="w-[20%] flex justify-end shrink-0">
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}