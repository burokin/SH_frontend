import { useRef, useCallback } from 'react';
import { Spin } from 'antd';
import { CallCard } from './CallCard';
import type { Call } from './types';

interface CallsListProps {
  calls: Call[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export const CallsList = ({
  calls,
  onLoadMore,
  hasMore,
  isLoading,
}: CallsListProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCallRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, onLoadMore]
  );

  return (
    <div>
      {calls.map((call, index) => {
        const isLastElement = index === calls.length - 1;
        return (
          <CallCard
            ref={isLastElement ? lastCallRef : null}
            key={call.id}
            call={call}
          />
        );
      })}

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      )}
    </div>
  );
};
