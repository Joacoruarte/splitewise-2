import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function GroupsPageSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>

        <Skeleton className="h-10 w-32" />
      </div>
      {/* Control Panel Skeleton */}
      <div className="space-y-4">
        {/* Search and Filter Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 flex flex-1 pl-10" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Groups List Skeleton */}
      <div className="space-y-4">
        {/* Groups Grid/List */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Group Image */}
                  <Skeleton className="h-24 w-24 shrink-0 rounded-md" />

                  <div className="flex-1 space-y-3">
                    {/* Title and Description */}
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 3 }).map((_, tagIndex) => (
                        <Skeleton key={tagIndex} className="h-5 w-16 rounded-full" />
                      ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {/* Avatars */}
                          <div className="flex -space-x-2">
                            {Array.from({ length: 3 }).map((_, avatarIndex) => (
                              <Skeleton
                                key={avatarIndex}
                                className="h-8 w-8 rounded-full border-2 border-background"
                              />
                            ))}
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Action Button */}
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
