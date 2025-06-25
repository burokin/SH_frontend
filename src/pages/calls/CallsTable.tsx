import { Table, Tag, Empty, Spin, Progress } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useRef, useCallback, useEffect } from 'react';
import { Modal, Checkbox, Button } from 'antd';
import type { Call } from './types';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DEFAULT_COLUMN_KEYS } from './constants';
import type { CallsTableProps } from './types';
import { highlight } from './utils';

dayjs.locale('ru');

const ALL_COLUMNS: ColumnsType<Call> = [
  {
    title: 'Адрес',
    dataIndex: 'address',
    key: 'address',
    width: 180,
  },
  {
    title: 'Дата и время',
    dataIndex: 'date',
    key: 'date',
    render: (_: string, record: Call) =>
      `${dayjs(`${record.date}T${record.time}`).format('DD.MM.YYYY, HH:mm')}`,
    sorter: (a: Call, b: Call) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
    width: 150,
  },
  {
    title: 'Сотрудник',
    dataIndex: 'staffer',
    key: 'staffer',
    render: (staffer: Call['staffer']) => `${staffer.name} (${staffer.role})`,
    width: 170,
  },
  {
    title: 'Тема',
    dataIndex: 'topic',
    key: 'topic',
    render: (topic: string) => <Tag color="blue">{topic}</Tag>,
    width: 120,
  },
  {
    title: 'Соблюдение скрипта',
    dataIndex: 'scriptCompliance',
    key: 'scriptCompliance',
    sorter: (a: Call, b: Call) => a.scriptCompliance - b.scriptCompliance,
    render: (compliance: number) => {
      const percent = Math.round((compliance / 11) * 100);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor={
              compliance / 11 > 0.7
                ? '#52c41a'
                : compliance / 11 > 0.4
                ? '#faad14'
                : '#ff4d4f'
            }
            style={{ minWidth: 100, flex: 1 }}
          />
          <span
            style={{
              minWidth: 32,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              color: '#222',
            }}
          >
            {percent}%
          </span>
        </div>
      );
    },
    width: 180,
  },
  {
    title: 'Отрицания',
    dataIndex: 'negations',
    key: 'negations',
    render: (negations: string[], _: unknown, __: unknown, search?: string) =>
      negations.length
        ? negations.map((n, i) => (
            <Tag color="red" key={i}>
              {highlight(n, search || '')}
            </Tag>
          ))
        : '-',
    width: 180,
  },
  {
    title: 'Нарушения скрипта',
    dataIndex: 'scriptErrors',
    key: 'scriptErrors',
    render: (errors: string[], _: unknown, __: unknown, search?: string) =>
      errors.length
        ? errors.map((e, i) => (
            <Tag color="orange" key={i}>
              {highlight(e, search || '')}
            </Tag>
          ))
        : '-',
    width: 180,
  },
  {
    title: 'Аудио',
    key: 'audio',
    render: (_: unknown, record: Call) => (
      <audio
        src={record.audioUrl}
        controls
        style={{ width: 400, minWidth: 200 }}
        preload="none"
      />
    ),
    width: 400,
  },
];

export const CallsTable = ({
  calls,
  loading,
  onLoadMore,
  hasMore,
  search = '',
  visibleColumns,
  columnOrder,
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

  const validColumnOrder =
    Array.isArray(columnOrder) && columnOrder.length > 0
      ? columnOrder.filter((key) =>
          ALL_COLUMNS.some((col) => String(col.key) === key)
        )
      : ALL_COLUMNS.map((col) => String(col.key));

  const filteredColumns = validColumnOrder
    .map((key) => ALL_COLUMNS.find((col) => String(col.key) === key))
    .filter(
      (col): col is (typeof ALL_COLUMNS)[number] =>
        Boolean(col) && visibleColumns.includes(String(col && col.key))
    )
    .map((col) => {
      if (col.key === 'negations' || col.key === 'scriptErrors') {
        return {
          ...col,
          render: (value: string[], record: Call) =>
            (
              col.render as (
                value: string[],
                record: Call,
                _?: unknown,
                search?: string
              ) => React.ReactNode
            )(value, record, null, search),
        };
      }
      return col;
    });

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
        columns={filteredColumns}
        dataSource={calls}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
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

export function SettingsModal({
  visibleColumns,
  onChange,
  columnOrder,
  setColumnOrder,
  open,
  setOpen,
}: {
  visibleColumns: string[];
  onChange: (checked: string[]) => void;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Синхронизируем columnOrder с ALL_COLUMNS только при монтировании
  useEffect(() => {
    const allKeys = ALL_COLUMNS.map((col) => String(col.key));
    const filtered = Array.isArray(columnOrder)
      ? columnOrder.filter(
          (key, idx, arr) => allKeys.includes(key) && arr.indexOf(key) === idx
        )
      : [];
    allKeys.forEach((key) => {
      if (!filtered.includes(key)) {
        filtered.push(key);
      }
    });
    const isEqual =
      filtered.length === columnOrder.length &&
      filtered.every((k, i) => columnOrder[i] === k);
    if (!isEqual) {
      setColumnOrder(filtered);
    }
    // eslint-disable-next-line
  }, []);

  const validColumnOrder = React.useMemo(() => {
    return Array.isArray(columnOrder)
      ? columnOrder.filter(
          (key, idx, arr) =>
            ALL_COLUMNS.some((col) => String(col.key) === key) &&
            arr.indexOf(key) === idx
        )
      : ALL_COLUMNS.map((col) => String(col.key));
  }, [columnOrder]);

  // Блокируем скролл body при открытом модальном окне
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!Array.isArray(ALL_COLUMNS) || !Array.isArray(columnOrder)) {
    return null;
  }
  // Порядок колонок всегда по validColumnOrder
  const allColumnsOrdered = validColumnOrder
    .map((key) => ALL_COLUMNS.find((col) => String(col.key) === key))
    .filter((col): col is (typeof ALL_COLUMNS)[number] => Boolean(col));

  const handleCheckboxChange = (checked: string[]) => {
    // Только видимость, порядок не меняем
    onChange(checked);
  };

  return (
    <>
      <Button
        icon={<SettingOutlined />}
        shape="circle"
        onClick={() => setOpen(true)}
      />
      <Modal
        title="Настройка колонок"
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        getContainer={false}
        width={600}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              onClick={() => {
                setColumnOrder(DEFAULT_COLUMN_KEYS);
                onChange(DEFAULT_COLUMN_KEYS);
              }}
            >
              Сбросить
            </Button>
          </div>
        }
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (over && active.id !== over.id) {
              const oldIndex = validColumnOrder.indexOf(String(active.id));
              const newIndex = validColumnOrder.indexOf(String(over.id));
              const newOrder = arrayMove(validColumnOrder, oldIndex, newIndex);
              setColumnOrder(newOrder);
            }
          }}
        >
          <SortableContext
            items={validColumnOrder}
            strategy={verticalListSortingStrategy}
          >
            <Checkbox.Group
              value={visibleColumns}
              onChange={handleCheckboxChange}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              {allColumnsOrdered.map((col) => {
                if (!col) return null;
                return (
                  <SortableColumn
                    key={String(col.key)}
                    col={col}
                    visibleColumns={visibleColumns}
                  />
                );
              })}
            </Checkbox.Group>
          </SortableContext>
        </DndContext>
      </Modal>
    </>
  );
}

type SortableColumnProps = {
  col: (typeof ALL_COLUMNS)[number];
  visibleColumns: string[];
};

function SortableColumn({ col, visibleColumns }: SortableColumnProps) {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
    listeners: sortableListeners,
  } = useSortable({ id: String(col.key) });

  const style = {
    display: 'flex',
    alignItems: 'center',
    background: isDragging
      ? '#f0f0f0'
      : visibleColumns.includes(String(col.key))
      ? undefined
      : '#f0f0f0',
    borderRadius: 4,
    marginBottom: 4,
    opacity: visibleColumns.includes(String(col.key)) ? 1 : 0.5,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Checkbox value={String(col.key)} style={{ flex: 1 }}>
        {col.title as React.ReactNode}
      </Checkbox>
      <span
        {...sortableListeners}
        style={{ cursor: 'grab', padding: '0 8px', color: '#aaa' }}
        title="Перетащить"
      >
        ≡
      </span>
    </div>
  );
}
