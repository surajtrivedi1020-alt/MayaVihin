
export type Verdict = 'Real' | 'Fake' | 'Uncertain';
export type MediaType = 'image' | 'video' | 'audio';
export type LogActionType = 'Upload' | 'Analysis' | 'Delete' | 'Error' | 'System';

export interface AgentResult {
  id: string;
  name: string;
  verdict: Verdict;
  confidence: number;
  reasoning: string;
}

export interface AnalysisRecord {
  id: string;
  timestamp: number;
  fileName: string;
  fileSize: number;
  fileType: MediaType;
  thumbnail?: string;
  verdict: Verdict;
  overallConfidence: number;
  agents: AgentResult[];
  explanation: string;
}

export interface SystemLog {
  id: string;
  timestamp: number;
  actionType: LogActionType;
  fileName?: string;
  status: 'Success' | 'Error';
  message: string;
}

export interface AppState {
  history: AnalysisRecord[];
  logs: SystemLog[];
}
