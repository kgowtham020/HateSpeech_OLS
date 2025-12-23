export enum ClassLabel {
  HATE_SPEECH = 'Hate Speech',
  OFFENSIVE_LANGUAGE = 'Offensive Language',
  NORMAL = 'Normal Speech'
}

export interface PredictionResult {
  label: ClassLabel;
  confidence: number;
  explanation: string;
}

export interface DatasetRow {
  id: number;
  text: string;
  processedText: string;
  label: string;
}

export interface MetricData {
  name: string;
  value: number;
}

export interface ComparisonData {
  metric: string;
  withOLS: number;
  withoutOLS: number;
}
