export type Call = {
  id: number;
  businessUnit: string;
  address: string;
  date: string;
  time: string;
  topic: string;
  staffer: { id: number; role: string; name: string };
  transcription: string;
  scriptCompliance: number;
  scriptErrors: string[];
  numberNegations: number;
  negations: string[];
  audioUrl: string;
  downloadAudioUrl: string;
};

export interface CallsData {
  total: number;
  page: number;
  pageSize: number;
  calls: Call[];
}
