export type TemplateCategory = 'income_expense' | 'budget' | 'cashflow' | 'tax' | 'pnl';

export interface SheetTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  categoryLabel: string;
  description: string;
  longDescription: string;
  formulas: string[];
  sampleColumns: string[];
  sampleRows: (string | number)[][];
  chartTypes: string[];
  isPopular?: boolean;
}
