import { useState, useEffect } from 'react';
import {
  Button,
  Drawer,
  Form,
  Select,
  Slider,
  Space,
  Row,
  Col,
  Badge,
  Popover,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { useDebounce } from 'use-debounce';

const staffers = [
  { id: 1, name: 'Иванов И.И.' },
  { id: 2, name: 'Петрова А.С.' },
  { id: 3, name: 'Сидоров А.А.' },
];
const topics = ['Бронирование', 'Доставка', 'Вопрос по меню', 'Отмена брони'];

interface FilterValues {
  address?: string;
  stafferId?: number[];
  topic?: string[];
  compliance?: [number, number];
}

interface CallsFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  filters: FilterValues;
  onReset: () => void;
}

export const CallsFilters = ({
  onFilterChange,
  filters,
  onReset,
}: CallsFiltersProps) => {
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [debouncedCallback] = useDebounce(onFilterChange, 500);

  useEffect(() => {
    form.setFieldsValue(filters);
  }, [filters, form]);

  const handleValuesChange = (
    _: Partial<FilterValues>,
    allValues: FilterValues
  ) => {
    if (!isMobile) {
      debouncedCallback(allValues);
    }
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
    if (isMobile) {
      setDrawerVisible(false);
    }
  };

  const handleApplyMobile = () => {
    onFilterChange(form.getFieldsValue());
    setDrawerVisible(false);
  };

  const getActiveFilterCount = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address, ...otherFilters } = filters;
    let count = 0;
    if (otherFilters.stafferId?.length) count++;
    if (otherFilters.topic?.length) count++;
    if (
      otherFilters.compliance &&
      (otherFilters.compliance[0] !== 0 || otherFilters.compliance[1] !== 11)
    )
      count++;
    return count;
  };
  const activeFilterCount = getActiveFilterCount();

  const filtersContent = (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleValuesChange}
      initialValues={{ compliance: [0, 11] }}
    >
      <Row gutter={16}>
        <Col span={isMobile ? 24 : 12}>
          <Form.Item name="stafferId" label="Сотрудник">
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите сотрудника"
              options={staffers.map((s) => ({ label: s.name, value: s.id }))}
            />
          </Form.Item>
        </Col>
        <Col span={isMobile ? 24 : 12}>
          <Form.Item name="topic" label="Тема">
            <Select
              mode="multiple"
              allowClear
              placeholder="Выберите тему"
              options={topics.map((t) => ({ label: t, value: t }))}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="compliance" label="Соблюдение скрипта">
            <Slider
              range
              min={0}
              max={11}
              marks={{ 0: '0', 11: '11' }}
              defaultValue={[0, 11]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button onClick={handleReset} style={{ width: '100%' }}>
          Сбросить
        </Button>
      </Form.Item>
    </Form>
  );

  if (isMobile) {
    return (
      <>
        <Badge count={activeFilterCount}>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ width: '100%' }}
          >
            Фильтры
          </Button>
        </Badge>
        <Drawer
          title="Фильтры"
          placement="bottom"
          height="80%"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          extra={
            <Space>
              <Button onClick={handleReset}>Сбросить</Button>
              <Button type="primary" onClick={handleApplyMobile}>
                Применить
              </Button>
            </Space>
          }
        >
          {filtersContent}
        </Drawer>
      </>
    );
  }

  // Desktop Popover
  return (
    <Popover
      content={filtersContent}
      title="Фильтры"
      trigger="click"
      placement="bottomRight"
      overlayStyle={{ width: '600px' }}
    >
      <Badge count={activeFilterCount}>
        <Button icon={<FilterOutlined />}>Фильтры</Button>
      </Badge>
    </Popover>
  );
};
