import { useEffect, useState, useCallback } from 'react';
import { Spin, Typography, Pagination } from 'antd';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { getCalls } from '../../shared/api';
import { CallsTable } from './CallsTable';
import { CallsList } from './CallsList';
import './CallsPage.scss';
import type { CallsData } from './types';

const { Title } = Typography;

const PAGE_SIZE = 20;

export const CallsPage = () => {
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [data, setData] = useState<CallsData>({
    calls: [],
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchCalls = async (pageNum: number) => {
    if (pageNum > 1) {
      setMoreLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await getCalls({ page: pageNum, pageSize: PAGE_SIZE });
      setData((prev) => ({
        ...response,
        calls:
          pageNum === 1 ? response.calls : [...prev.calls, ...response.calls],
      }));
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
      setMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const loadMoreItems = useCallback(() => {
    if (moreLoading) return;
    setPage((prevPage) => prevPage + 1);
  }, [moreLoading]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const hasMore = data.calls.length < data.total;

  return (
    <div className="calls-page">
      <Title level={2} className="dashboard-title">
        Журнал звонков
      </Title>

      {/* TODO: Filters will be here */}

      {isMobile ? (
        <CallsList
          calls={data.calls}
          onLoadMore={loadMoreItems}
          hasMore={hasMore}
          isLoading={moreLoading}
        />
      ) : (
        <>
          <CallsTable calls={data.calls} />
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={data.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            style={{ marginTop: '24px', textAlign: 'center' }}
          />
        </>
      )}
    </div>
  );
};
