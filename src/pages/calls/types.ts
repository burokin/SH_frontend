export interface Call {
  id: number;
  callNumber: string;
  businessUnit: string;
  address: string;
  date: string;
  time: string;
  topic: string;
  staffer: {
    id: number;
    role: string;
    name: string;
  };
  transcription: string;
  scriptCompliance: number;
  scriptErrors: string[];
  numberNegations: number;
  negations: string[];
  audioUrl: string;
  downloadAudioUrl: string;
}

export interface CallsData {
  calls: Call[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterValues {
  address?: string;
  stafferId?: number[];
  topic?: string[];
  compliance?: [number, number];
  dateRange?: [string, string];
  search?: string;
}

export interface CallsFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  filters: FilterValues;
  onReset: () => void;
  calls: Call[];
}

export interface CallsListProps {
  calls: Call[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export interface CallsTableProps {
  calls: Call[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  search?: string;
  visibleColumns: string[];
  columnOrder: string[];
}
