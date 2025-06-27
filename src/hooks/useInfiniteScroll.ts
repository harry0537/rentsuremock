import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export function useInfiniteScroll({ hasNextPage, loading, onLoadMore }: UseInfiniteScrollProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        onLoadMore();
      }
    });

    if (element) observer.current.observe(element);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [element, loading, hasNextPage, onLoadMore]);

  return setElement;
} 