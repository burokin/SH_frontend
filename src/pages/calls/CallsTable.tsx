import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import type { Call } from './types';

interface CallsTableProps {
  calls: Call[];
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

export const CallsTable = ({ calls }: CallsTableProps) => {
  return (
    <Table
      columns={columns}
      dataSource={calls}
      rowKey="id"
      pagination={false}
    />
  );
};
