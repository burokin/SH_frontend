import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Button, Drawer, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import type { Dayjs } from 'dayjs';
import ru_RU from 'antd/es/date-picker/locale/ru_RU';
import 'dayjs/locale/ru';
import dayjs from 'dayjs';

export interface AnalyticsFiltersValues {
  dateRange: [Dayjs | null, Dayjs | null];
  restaurant?: string;
  staffer?: string;
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersValues;
  onChange: (filters: AnalyticsFiltersValues) => void;
  onReset: () => void;
  restaurantOptions: { label: string; value: string }[];
}

const { RangePicker } = DatePicker;

const today = dayjs();
const yesterday = today.subtract(1, 'day');
const weekAgo = today.subtract(6, 'day');
const monthAgo = today.subtract(29, 'day');

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onChange,
  onReset,
  restaurantOptions,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onChange(localFilters);
    setDrawerOpen(false);
  };

  const handleReset = () => {
    onReset();
    setDrawerOpen(false);
  };

  const handleQuickRange = (range: [dayjs.Dayjs, dayjs.Dayjs]) => {
    setLocalFilters((f) => ({ ...f, dateRange: range }));
    onChange({ ...localFilters, dateRange: range });
  };

  const filtersContent = isMobile ? (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Select
        placeholder="Ресторан"
        value={localFilters.restaurant}
        onChange={(val) => setLocalFilters((f) => ({ ...f, restaurant: val }))}
        style={{ minWidth: 140 }}
        options={restaurantOptions}
        allowClear
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <DatePicker
          value={localFilters.dateRange[0]}
          onChange={(date) => {
            const newRange: [Dayjs | null, Dayjs | null] = [
              date,
              localFilters.dateRange[1],
            ];
            setLocalFilters((f) => ({ ...f, dateRange: newRange }));
            if (date && newRange[1]) {
              onChange({ ...localFilters, dateRange: newRange });
            }
          }}
          placeholder="Начало"
          format="DD.MM.YYYY"
          locale={ru_RU}
          style={{ flex: 1, minWidth: 0 }}
          disabledDate={(current) => {
            const end = localFilters.dateRange[1];
            return (
              (end ? current && current > end : false) ||
              (current && current > today)
            );
          }}
        />
        <DatePicker
          value={localFilters.dateRange[1]}
          onChange={(date) => {
            const newRange: [Dayjs | null, Dayjs | null] = [
              localFilters.dateRange[0],
              date,
            ];
            setLocalFilters((f) => ({ ...f, dateRange: newRange }));
            if (date && newRange[0]) {
              onChange({ ...localFilters, dateRange: newRange });
            }
          }}
          placeholder="Конец"
          format="DD.MM.YYYY"
          locale={ru_RU}
          style={{ flex: 1, minWidth: 0 }}
          disabledDate={(current) => {
            const start = localFilters.dateRange[0];
            return (
              (start ? current && current < start : false) ||
              (current && current > today)
            );
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          size="small"
          onClick={() => handleQuickRange([yesterday, yesterday])}
        >
          Вчера
        </Button>
        <Button size="small" onClick={() => handleQuickRange([weekAgo, today])}>
          Неделя
        </Button>
        <Button
          size="small"
          onClick={() => handleQuickRange([monthAgo, today])}
        >
          Месяц
        </Button>
      </div>
    </Space>
  ) : (
    <Space
      direction="horizontal"
      size={8}
      style={{ width: '100%', display: 'flex', alignItems: 'start' }}
    >
      <Select
        placeholder="Ресторан"
        value={localFilters.restaurant}
        onChange={(val) => setLocalFilters((f) => ({ ...f, restaurant: val }))}
        style={{ minWidth: 140 }}
        options={restaurantOptions}
        allowClear
      />
      <div>
        <RangePicker
          value={localFilters.dateRange}
          onChange={(val) => {
            setLocalFilters((f) => ({
              ...f,
              dateRange: val as [Dayjs | null, Dayjs | null],
            }));
            if (val && val[0] && val[1]) {
              onChange({
                ...localFilters,
                dateRange: val as [Dayjs | null, Dayjs | null],
              });
            }
          }}
          style={{ minWidth: 180 }}
          locale={ru_RU}
          format="DD.MM.YYYY"
          disabledDate={(current) => current && current > today}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button
            size="small"
            onClick={() => handleQuickRange([yesterday, yesterday])}
          >
            Вчера
          </Button>
          <Button
            size="small"
            onClick={() => handleQuickRange([weekAgo, today])}
          >
            Неделя
          </Button>
          <Button
            size="small"
            onClick={() => handleQuickRange([monthAgo, today])}
          >
            Месяц
          </Button>
        </div>
      </div>
    </Space>
  );

  if (isMobile) {
    return (
      <>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setDrawerOpen(true)}
          style={{ marginBottom: 12 }}
        >
          Фильтры
        </Button>
        <Drawer
          title="Фильтры"
          placement="top"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          height={340}
          bodyStyle={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1 }}>{filtersContent}</div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 24,
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={handleReset}>Сбросить</Button>
            <Button type="primary" onClick={handleApply}>
              Применить
            </Button>
          </div>
        </Drawer>
      </>
    );
  }

  return <div className="analytics-filters">{filtersContent}</div>;
};

export default AnalyticsFilters;
