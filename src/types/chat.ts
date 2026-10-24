export interface HsnResult {
  hsnCode: string;
  description: string;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  condition: string | null;
  score: number;
  source: string;
}

export interface ChatResponse {
  answer: string;
  results: HsnResult[];
  needsVerification: boolean;
  method?: string;
  disclaimer?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  results?: HsnResult[];
  disclaimer?: string;
  method?: string;
  timestamp?: string;
  query?: string;
}

export interface CategoryPreset {
  label: string;
  icon: string;
  query: string;
}
