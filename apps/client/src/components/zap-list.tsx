"use client";

import { useEffect, useRef } from "react";
import { useZaps } from "@/hooks/useZaps";
import { ZapCard } from "@/components/zap-card";
import { Button } from "@/components/ui/button";
import { CreateZapButton } from "./create-zap-button";

export function ZapList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useZaps(12);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading zaps...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error loading zaps: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Extract all zaps from all pages
  const allZaps = data?.pages.flatMap((page) => page.zaps) || [];

  if (allZaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 mb-4">No zaps found</p>
        <CreateZapButton/>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allZaps.map((zap) => (
          <ZapCard key={zap.id} zap={zap} />
        ))}
      </div>

      {/* Load more trigger */}
      <div
        ref={loadMoreRef}
        className="flex justify-center my-8"
      >
        {isFetchingNextPage ? (
          <p className="text-sm text-gray-500">Loading more...</p>
        ) : hasNextPage ? (
          <Button 
            variant="outline" 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            Load More
          </Button>
        ) : (
          allZaps.length > 0 && (
            <p className="text-sm text-gray-500">No more zaps to load</p>
          )
        )}
      </div>
    </div>
  );
} 