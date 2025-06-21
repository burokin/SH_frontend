import { useEffect, useState } from 'react';
import { Spin, Typography, Pagination } from 'antd';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { getCalls } from '../../shared/api';
import { CallsTable } from './CallsTable';
import { CallsList } from './CallsList';
import './CallsPage.scss';
import type { CallsData } from './types';

const { Title } = Typography;

export const CallsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CallsData | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const isMobile = useMediaQuery('(max-width: 768px)');

  const fetchCalls = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const response = await getCalls({ page, pageSize });
      setData(response);
      setPagination((prev) => ({
        ...prev,
        current: response.page,
        pageSize: response.pageSize,
        total: response.total,
      }));
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize }));
  };

  if (loading || !data) {
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

  return (
    <div className="calls-page">
      <Title level={2} className="dashboard-title">
        Журнал звонков
      </Title>

      {/* TODO: Filters will be here */}

      {isMobile ? (
        <CallsList calls={data.calls} />
      ) : (
        <CallsTable calls={data.calls} />
      )}

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        style={{ marginTop: '24px', textAlign: 'center' }}
      />
    </div>
  );
};
