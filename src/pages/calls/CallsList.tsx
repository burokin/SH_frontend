import { useRef, useCallback } from 'react';
import { Spin, Empty } from 'antd';
import { CallCard } from './CallCard';
import type { CallsListProps } from './types';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';

export const CallsList = ({
  calls,
  onLoadMore,
  hasMore,
  isLoading,
}: CallsListProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
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

  if (!isLoading && calls.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="По заданным фильтрам данные не найдены"
        />
      </div>
    );
  }

  if (isLoading && calls.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {calls.map((call, index) => {
        const isLastElement = index === calls.length - 1;
        return (
          <CallCard
            ref={isLastElement ? lastCallRef : null}
            key={call.id}
            call={call}
            isMobile={isMobile}
          />
        );
      })}

      {isLoading && calls.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      )}
    </div>
  );
};
