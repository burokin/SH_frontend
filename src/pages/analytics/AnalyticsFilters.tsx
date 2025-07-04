import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Button, Drawer, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import type { Dayjs } from 'dayjs';

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

  const filtersContent = (
    <Space
      direction={isMobile ? 'vertical' : 'horizontal'}
      size={isMobile ? 16 : 8}
      style={{ width: '100%' }}
    >
      <RangePicker
        value={localFilters.dateRange}
        onChange={(val) =>
          setLocalFilters((f) => ({
            ...f,
            dateRange: val as [Dayjs | null, Dayjs | null],
          }))
        }
        style={{ minWidth: 180 }}
      />
      <Select
        placeholder="Ресторан"
        value={localFilters.restaurant}
        onChange={(val) => setLocalFilters((f) => ({ ...f, restaurant: val }))}
        style={{ minWidth: 140 }}
        options={restaurantOptions}
        allowClear
      />
      {isMobile && (
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={handleReset}>Сбросить</Button>
          <Button type="primary" onClick={handleApply}>
            Применить
          </Button>
        </Space>
      )}
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
          placement="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          height={340}
          bodyStyle={{ padding: 16 }}
        >
          {filtersContent}
        </Drawer>
      </>
    );
  }

  return <div className="analytics-filters">{filtersContent}</div>;
};

export default AnalyticsFilters;
