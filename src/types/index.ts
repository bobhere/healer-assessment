export type DimensionKey =
  | 'positioning'
  | 'product'
  | 'content'
  | 'shortVideo'
  | 'sales'
  | 'operations';

export type QuestionType =
  | 'scale'
  | 'single'
  | 'multi'
  | 'boolean'
  | 'text';

export interface OptionItem {
  label: string;
  value: number;
  code?: string;
}

export interface Question {
  id: string;
  title: string;
  helper?: string;
  dimension: DimensionKey;
  type: QuestionType;
  weight: number;
  scaleMax?: number;
  options?: OptionItem[];
  placeholder?: string;
}

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  description: string;
  color: string;
}
