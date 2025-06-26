import { useEffect, useState, useCallback, useMemo } from 'react';
import { Typography, Input, Menu, Button, Drawer } from 'antd';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { getCalls } from '../../shared/api';
import { LOCAL_STORAGE_KEYS } from '../../shared/utils/constants';
import { useDebounce } from 'use-debounce';
import { CallsTable } from './CallsTable';
import { CallsList } from './CallsList';
import { CallsFilters } from './CallsFilters';
import './CallsPage.scss';
import type { CallsData, FilterValues, Call as BaseCall } from './types';
import { SortDescendingOutlined, SettingOutlined } from '@ant-design/icons';
import { DEFAULT_COLUMN_KEYS } from './constants';
import { SettingsModal } from './CallsTable';
import { SearchBar } from 'antd-mobile';
import { SearchOutline } from 'antd-mobile-icons';

const { Title } = Typography;

const PAGE_SIZE = 20;

// Временный тип для данных с backend без callNumber
interface RawCall extends Omit<BaseCall, 'callNumber'> {
  callNumber?: string;
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
  const [searchPhrase, setSearchPhrase] = useState('');
  const [mobileSort, setMobileSort] = useState<
    'date-desc' | 'date-asc' | 'compliance-desc' | 'compliance-asc'
  >('date-desc');
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useLocalStorage<string[]>(
    'calls_table_columns',
    DEFAULT_COLUMN_KEYS
  );
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    'calls_table_column_order',
    DEFAULT_COLUMN_KEYS
  );

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
            pageNum === 1
              ? (response.calls as RawCall[]).map((call) => ({
                  ...call,
                  callNumber: call.callNumber || String(call.id),
                }))
              : [
                  ...prev.calls,
                  ...(response.calls as RawCall[]).map((call) => ({
                    ...call,
                    callNumber: call.callNumber || String(call.id),
                  })),
                ],
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

  const handleResetFilters = useCallback(() => {
    setPage(1);
    setFilters({});
  }, [setFilters]);

  const loadMoreItems = useCallback(() => {
    if (loading || data.calls.length >= data.total) return;
    setPage((prevPage) => prevPage + 1);
  }, [loading, data.total, data.calls.length]);

  const hasMore = data.calls.length < data.total;

  // Имитация поиска по нарушениям, отрицаниям и номеру звонка
  const filteredCalls = useMemo(() => {
    let result = !searchPhrase
      ? data.calls
      : data.calls.filter(
          (call) =>
            call.callNumber
              .toLowerCase()
              .includes(searchPhrase.toLowerCase()) ||
            call.negations.some((n) =>
              n.toLowerCase().includes(searchPhrase.toLowerCase())
            ) ||
            call.scriptErrors.some((e) =>
              e.toLowerCase().includes(searchPhrase.toLowerCase())
            )
        );
    if (isMobile) {
      result = [...result];
      if (mobileSort === 'date-desc') {
        result.sort((a, b) => b.date.localeCompare(a.date));
      } else if (mobileSort === 'date-asc') {
        result.sort((a, b) => a.date.localeCompare(b.date));
      } else if (mobileSort === 'compliance-desc') {
        result.sort((a, b) => b.scriptCompliance - a.scriptCompliance);
      } else if (mobileSort === 'compliance-asc') {
        result.sort((a, b) => a.scriptCompliance - b.scriptCompliance);
      }
    }
    return result;
  }, [data.calls, searchPhrase, isMobile, mobileSort]);

  useEffect(() => {
    if (isMobile && sortDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, sortDrawerOpen]);

  return (
    <div className="calls-page">
      <Title level={2} className="dashboard-title">
        Журнал звонков
      </Title>

      {isMobile ? (
        <>
          <div
            className="calls-toolbar"
            style={{ alignItems: 'center', gap: 8, display: 'flex' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                icon={
                  <SortDescendingOutlined
                    style={{
                      color: mobileSort !== 'date-desc' ? '#1677ff' : undefined,
                    }}
                  />
                }
                style={{ width: 30 }}
                onClick={() => {
                  setSortDrawerOpen(true);
                }}
              />
              <CallsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                calls={data.calls}
              />
            </div>
            <SearchBar
              value={searchPhrase}
              onChange={setSearchPhrase}
              placeholder="Поиск по номеру, нарушениям и отрицаниям"
              showCancelButton={false}
              style={{
                flex: 1,
                '--height': '36px',
                '--border-radius': '8px',
                '--background': '#f5f5f5',
                minWidth: 0,
              }}
              icon={<SearchOutline />}
            />
          </div>
          <Drawer
            title="Сортировка"
            placement="bottom"
            height="auto"
            onClose={() => setSortDrawerOpen(false)}
            open={sortDrawerOpen}
            destroyOnHidden
            extra={
              <Button
                onClick={() => {
                  setMobileSort('date-desc');
                  setSortDrawerOpen(false);
                }}
                style={{ marginRight: 8 }}
              >
                Сбросить
              </Button>
            }
          >
            <Menu
              selectedKeys={[mobileSort]}
              onClick={({ key }) => {
                setMobileSort(key as typeof mobileSort);
                setSortDrawerOpen(false);
              }}
              items={[
                { key: 'date-desc', label: 'Сначала новые' },
                { key: 'date-asc', label: 'Сначала старые' },
                { key: 'compliance-desc', label: 'Сначала высокий % скрипта' },
                { key: 'compliance-asc', label: 'Сначала низкий % скрипта' },
              ]}
            />
          </Drawer>
          <CallsList
            calls={filteredCalls}
            onLoadMore={loadMoreItems}
            hasMore={hasMore}
            isLoading={loading}
            searchText={searchPhrase}
          />
        </>
      ) : (
        <>
          <div className="calls-toolbar">
            <Button
              type="default"
              shape="circle"
              icon={<SettingOutlined />}
              className="calls-toolbar__settings"
              onClick={() => setSettingsOpen(true)}
            />
            <div className="calls-toolbar__filters">
              <CallsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                calls={data.calls}
              />
            </div>
            <Input.Search
              placeholder="Поиск по номеру, нарушениям и отрицаниям"
              allowClear
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
              className="calls-toolbar__search"
            />
          </div>
          <SettingsModal
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            open={settingsOpen}
            setOpen={setSettingsOpen}
          />
          <CallsTable
            calls={filteredCalls}
            loading={loading}
            onLoadMore={loadMoreItems}
            hasMore={hasMore}
            search={searchPhrase}
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
          />
        </>
      )}
    </div>
  );
};
