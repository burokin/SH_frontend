import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Drawer,
  Form,
  Select,
  Space,
  Row,
  Col,
  Badge,
  Slider,
  DatePicker,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { STAFFERS } from './constants';
import type { Call, FilterValues } from './types';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ru_RU from 'antd/es/date-picker/locale/ru_RU';

interface CallsFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  filters: FilterValues;
  onReset: () => void;
  calls: Call[];
}

export const CallsFilters = ({
  onFilterChange,
  filters,
  onReset,
  calls,
}: CallsFiltersProps) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [localCompliance, setLocalCompliance] = useState<[number, number]>(
    filters.compliance || [0, 100]
  );
  const [rangeValue, setRangeValue] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  // useEffect для десктопной версии (RangePicker)
  useEffect(() => {
    if (!isMobile && (modalVisible || drawerVisible)) {
      setLocalCompliance(filters.compliance || [0, 100]);
      let normalizedRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [
        null,
        null,
      ];
      if (
        Array.isArray(filters.dateRange) &&
        filters.dateRange.length === 2 &&
        filters.dateRange[0] &&
        filters.dateRange[1]
      ) {
        const d0 =
          typeof filters.dateRange[0] === 'string'
            ? dayjs(filters.dateRange[0])
            : filters.dateRange[0];
        const d1 =
          typeof filters.dateRange[1] === 'string'
            ? dayjs(filters.dateRange[1])
            : filters.dateRange[1];
        if (
          dayjs.isDayjs(d0) &&
          dayjs.isDayjs(d1) &&
          d0.isValid() &&
          d1.isValid()
        ) {
          normalizedRange = [d0, d1];
        }
      }
      const normalized = {
        ...filters,
        dateRange: normalizedRange,
      };
      form.setFieldsValue(normalized);
      setRangeValue(normalizedRange);
    }
    // eslint-disable-next-line
  }, [modalVisible, drawerVisible, isMobile]);

  // useEffect для мобильной версии (два одиночных DatePicker)
  useEffect(() => {
    if (isMobile && (modalVisible || drawerVisible)) {
      setLocalCompliance(filters.compliance || [0, 100]);
      const normalized: Record<string, unknown> = { ...filters };
      if (Array.isArray(filters.dateRange)) {
        normalized.dateRange = [
          filters.dateRange[0] ? dayjs(filters.dateRange[0]) : null,
          filters.dateRange[1] ? dayjs(filters.dateRange[1]) : null,
        ];
      } else {
        normalized.dateRange = [null, null];
      }
      form.setFieldsValue(normalized);
    }
    // eslint-disable-next-line
  }, [modalVisible, drawerVisible, isMobile]);

  const handleReset = () => {
    form.resetFields();
    onReset();
    if (isMobile) {
      setDrawerVisible(false);
    } else {
      setModalVisible(false);
    }
  };

  const handleApply = () => {
    form.setFieldsValue({ compliance: localCompliance });
    const values = form.getFieldsValue();
    // Преобразуем dateRange к строкам для фильтрации (YYYY-MM-DD)
    let dateRange: [string | undefined, string | undefined] | undefined =
      undefined;
    if (Array.isArray(values.dateRange) && values.dateRange.length === 2) {
      dateRange = [
        values.dateRange[0] &&
        dayjs.isDayjs(values.dateRange[0]) &&
        values.dateRange[0].isValid()
          ? values.dateRange[0].format('YYYY-MM-DD')
          : undefined,
        values.dateRange[1] &&
        dayjs.isDayjs(values.dateRange[1]) &&
        values.dateRange[1].isValid()
          ? values.dateRange[1].format('YYYY-MM-DD')
          : undefined,
      ];
    }
    onFilterChange({ ...values, dateRange, compliance: localCompliance });
    if (isMobile) {
      setDrawerVisible(false);
    } else {
      setModalVisible(false);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    // address: может быть строкой или массивом
    if (Array.isArray(filters.address) && filters.address.length) count++;
    else if (typeof filters.address === 'string' && filters.address) count++;
    if (filters.stafferId && filters.stafferId.length) count++;
    if (filters.topic && filters.topic.length) count++;
    if (
      filters.compliance &&
      (filters.compliance[0] !== 0 || filters.compliance[1] !== 100)
    ) {
      count++;
    }
    if (
      Array.isArray(filters.dateRange) &&
      filters.dateRange[0] &&
      filters.dateRange[1]
    ) {
      count++;
    }
    return count;
  };
  const activeFilterCount = getActiveFilterCount();

  const addresses = Array.from(new Set(calls.map((c) => c.address))).filter(
    Boolean
  );

  const topics = Array.from(new Set(calls.map((c) => c.topic))).filter(Boolean);

  const handleQuickDate = (type: 'week' | 'month') => {
    const end = dayjs();
    const start =
      type === 'week' ? end.subtract(7, 'day') : end.subtract(1, 'month');
    form.setFieldsValue({ dateRange: [start, end] });
    setRangeValue([start, end]);
    form.validateFields(['dateRange']);
  };

  const filtersContent = isMobile ? (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={() => {}}
      initialValues={{ compliance: [0, 100], dateRange: [null, null] }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form.Item name="address" label="Адрес">
          <Select
            mode="multiple"
            allowClear
            placeholder="Выберите адрес"
            options={addresses.map((a) => ({ label: a, value: a }))}
          />
        </Form.Item>
        <Form.Item name="topic" label="Тема">
          <Select
            mode="multiple"
            allowClear
            placeholder="Выберите тему"
            options={topics.map((t) => ({ label: t, value: t }))}
          />
        </Form.Item>
        <Form.Item name="stafferId" label="Сотрудник">
          <Select
            mode="multiple"
            allowClear
            placeholder="Выберите сотрудника"
            options={STAFFERS.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Form.Item>
        <Form.Item label="Дата звонка">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Form.Item name={['dateRange', 0]} noStyle>
              <DatePicker
                style={{ flex: 1, minWidth: 0 }}
                placeholder="Начало"
                format="DD.MM.YY"
                allowClear
                locale={ru_RU}
                disabledDate={(current) => {
                  const end = form.getFieldValue(['dateRange', 1]);
                  const today = dayjs().endOf('day');
                  return (
                    (end ? current && current > dayjs(end) : false) ||
                    (current && current > today)
                  );
                }}
                inputReadOnly
              />
            </Form.Item>
            <span>—</span>
            <Form.Item name={['dateRange', 1]} noStyle>
              <DatePicker
                style={{ flex: 1, minWidth: 0 }}
                placeholder="Конец"
                format="DD.MM.YY"
                allowClear
                locale={ru_RU}
                disabledDate={(current) => {
                  const start = form.getFieldValue(['dateRange', 0]);
                  const today = dayjs().endOf('day');
                  return (
                    (start ? current && current < dayjs(start) : false) ||
                    (current && current > today)
                  );
                }}
                inputReadOnly
              />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button size="small" onClick={() => handleQuickDate('week')}>
              За неделю
            </Button>
            <Button size="small" onClick={() => handleQuickDate('month')}>
              За месяц
            </Button>
          </div>
        </Form.Item>
        <Form.Item name="compliance" label="Соблюдение инструкции (%)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                minWidth: 32,
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {localCompliance[0]}%
            </span>
            <Slider
              range
              min={0}
              max={100}
              value={localCompliance}
              onChange={(val) => setLocalCompliance(val as [number, number])}
              style={{ flex: 1, maxWidth: 220 }}
              tipFormatter={(v) => `${v}%`}
            />
            <span
              style={{
                minWidth: 32,
                textAlign: 'left',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {localCompliance[1]}%
            </span>
          </div>
        </Form.Item>
      </div>
    </Form>
  ) : (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={() => {}}
      initialValues={{ compliance: [0, 100], dateRange: [null, null] }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="address" label="Адрес">
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите адрес"
              options={addresses.map((a) => ({ label: a, value: a }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="topic" label="Тема">
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите тему"
              options={topics.map((t) => ({ label: t, value: t }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="stafferId" label="Сотрудник">
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите сотрудника"
              options={STAFFERS.map((s) => ({ label: s.name, value: s.id }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="dateRange" label="Дата звонка">
            <DatePicker.RangePicker
              value={rangeValue}
              onChange={(dates) => {
                setRangeValue(
                  dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]
                );
                form.setFieldsValue({ dateRange: dates });
              }}
              style={{ width: '100%' }}
              format="DD.MM.YY"
              locale={ru_RU}
              allowClear
              disabledDate={(current) => {
                const today = dayjs().endOf('day');
                return current && current > today;
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button size="small" onClick={() => handleQuickDate('week')}>
                За неделю
              </Button>
              <Button size="small" onClick={() => handleQuickDate('month')}>
                За месяц
              </Button>
            </div>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="compliance" label="Соблюдение инструкции (%)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  minWidth: 32,
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {localCompliance[0]}%
              </span>
              <Slider
                range
                min={0}
                max={100}
                value={localCompliance}
                onChange={(val) => setLocalCompliance(val as [number, number])}
                style={{ flex: 1, maxWidth: 220 }}
                tipFormatter={(v) => `${v}%`}
              />
              <span
                style={{
                  minWidth: 32,
                  textAlign: 'left',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {localCompliance[1]}%
              </span>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      <Badge count={activeFilterCount}>
        <Button
          icon={<FilterOutlined />}
          onClick={() => {
            if (isMobile) {
              setDrawerVisible(true);
            } else {
              setModalVisible(true);
            }
          }}
          style={{ width: isMobile ? '30px' : '32px' }}
        />
      </Badge>
      <Modal
        title="Фильтры"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          <Space>
            <Button onClick={handleReset}>Сбросить</Button>
            <Button type="primary" onClick={handleApply}>
              Применить
            </Button>
          </Space>
        }
        destroyOnHidden
        width={600}
      >
        {filtersContent}
      </Modal>
      <Drawer
        title="Фильтры"
        placement="bottom"
        height="80%"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={handleReset}>Сбросить</Button>
            <Button type="primary" onClick={handleApply}>
              Применить
            </Button>
          </Space>
        }
        destroyOnHidden
      >
        {filtersContent}
      </Drawer>
    </>
  );
};
