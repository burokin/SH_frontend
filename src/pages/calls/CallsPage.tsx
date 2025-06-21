import { useEffect, useState, useCallback } from 'react';
import { Typography, Input, Row, Col } from 'antd';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { getCalls } from '../../shared/api';
import { LOCAL_STORAGE_KEYS } from '../../shared/utils/constants';
import { useDebounce } from 'use-debounce';
import { CallsTable } from './CallsTable';
import { CallsList } from './CallsList';
import { CallsFilters } from './CallsFilters';
import './CallsPage.scss';
import type { CallsData } from './types';

const { Title } = Typography;

const PAGE_SIZE = 20;

interface FilterValues {
  address?: string;
  stafferId?: number[];
  topic?: string[];
  compliance?: [number, number];
}

export const CallsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CallsData>({
    calls: [],
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useLocalStorage<FilterValues>(
    LOCAL_STORAGE_KEYS.CALLS_FILTERS,
    {}
  );
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchCalls = useCallback(
    async (pageNum: number, currentFilters: FilterValues) => {
      setLoading(true);

      try {
        const response = await getCalls({
          page: pageNum,
          pageSize: PAGE_SIZE,
          ...currentFilters,
        });
        setData((prev) => ({
          ...response,
          calls:
            pageNum === 1 ? response.calls : [...prev.calls, ...response.calls],
        }));
      } catch (error) {
        console.error('Failed to fetch calls:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const [debouncedFetch] = useDebounce(fetchCalls, 300);

  useEffect(() => {
    if (page === 1) {
      debouncedFetch(page, filters);
    } else {
      fetchCalls(page, filters);
    }
  }, [page, filters, fetchCalls, debouncedFetch]);

  const handleFilterChange = useCallback(
    (newFilters: Omit<FilterValues, 'address'>) => {
      setPage(1);
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    (address: string) => {
      setPage(1);
      setFilters((prev) => ({ ...prev, address }));
    },
    [setFilters]
  );

  const handleResetFilters = useCallback(() => {
    setPage(1);
    setFilters({});
  }, [setFilters]);

  const loadMoreItems = useCallback(() => {
    if (loading || data.calls.length >= data.total) return;
    setPage((prevPage) => prevPage + 1);
  }, [loading, data.total, data.calls.length]);

  const hasMore = data.calls.length < data.total;

  return (
    <div className="calls-page">
      <Title level={2} className="dashboard-title">
        Журнал звонков
      </Title>

      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Input.Search
            placeholder="Поиск по адресу"
            onSearch={handleSearchChange}
            onChange={(e) => handleSearchChange(e.target.value)}
            value={filters.address || ''}
            allowClear
          />
        </Col>
        <Col flex="none">
          <CallsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </Col>
      </Row>

      {isMobile ? (
        <CallsList
          calls={data.calls}
          onLoadMore={loadMoreItems}
          hasMore={hasMore}
          isLoading={loading}
        />
      ) : (
        <CallsTable
          calls={data.calls}
          loading={loading}
          onLoadMore={loadMoreItems}
          hasMore={hasMore}
        />
      )}
    </div>
  );
};
