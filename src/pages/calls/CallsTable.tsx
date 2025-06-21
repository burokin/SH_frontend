import { Table, Tag, Space, Button, Tooltip, Empty, Spin } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRef, useCallback } from 'react';
import type { Call } from './types';

interface CallsTableProps {
  calls: Call[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

const columns = [
  {
    title: 'Бизнес-юнит',
    dataIndex: 'businessUnit',
    key: 'businessUnit',
    sorter: (a: Call, b: Call) => a.businessUnit.localeCompare(b.businessUnit),
  },
  {
    title: 'Дата и время',
    dataIndex: 'date',
    key: 'date',
    render: (_: string, record: Call) => `${record.date} ${record.time}`,
    sorter: (a: Call, b: Call) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
  {
    title: 'Сотрудник',
    dataIndex: 'staffer',
    key: 'staffer',
    render: (staffer: Call['staffer']) => `${staffer.name} (${staffer.role})`,
  },
  {
    title: 'Тема',
    dataIndex: 'topic',
    key: 'topic',
    render: (topic: string) => <Tag color="blue">{topic}</Tag>,
  },
  {
    title: 'Соблюдение скрипта',
    dataIndex: 'scriptCompliance',
    key: 'scriptCompliance',
    sorter: (a: Call, b: Call) => a.scriptCompliance - b.scriptCompliance,
    render: (compliance: number) => `${Math.round((compliance / 11) * 100)}%`,
  },
  {
    title: 'Действия',
    key: 'action',
    render: (_: unknown, record: Call) => (
      <Space size="middle">
        <Tooltip title="Прослушать">
          <Button
            shape="circle"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              const audio = new Audio(record.audioUrl);
              audio.play();
            }}
          />
        </Tooltip>
        <Tooltip title="Скачать">
          <Button
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={() => {
              const link = document.createElement('a');
              link.href = record.downloadAudioUrl;
              link.download = `call_${record.id}.mp3`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          />
        </Tooltip>
      </Space>
    ),
  },
];

export const CallsTable = ({
  calls,
  loading,
  onLoadMore,
  hasMore,
}: CallsTableProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  if (!loading && calls.length === 0) {
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

  if (loading && calls.length === 0) {
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
    <>
      <Table
        columns={columns}
        dataSource={calls}
        rowKey="id"
        pagination={false}
      />
      <div ref={sentinelRef} />
      {loading && calls.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      )}
    </>
  );
};
