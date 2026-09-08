export type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';
export type SyncFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual';
export type TemplateCategory = 'income_expense' | 'budget' | 'cashflow' | 'tax' | 'pnl' | 'custom';
export type PermissionLevel = 'view' | 'edit' | 'owner';

export interface ColumnMappingItem {
  sourceColumn: string;
  targetField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  isRequired: boolean;
  isReadOnly?: boolean;
}

export interface SheetDataFilters {
  dateRange: 'all' | 'last_30_days' | 'this_month' | 'this_year' | 'custom';
  categories: string[];
  accounts: string[];
  minAmount?: number;
  maxAmount?: number;
  transactionStatus: 'all' | 'completed' | 'pending';
}

export interface SharedUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  permission: PermissionLevel;
  addedAt: string;
}

export interface SyncedSheetItem {
  id: string;
  googleSheetId: string;
  sheetTitle: string;
  sheetUrl: string;
  sheetTabName: string;
  syncFrequency: SyncFrequency;
  isActive: boolean;
  bidirectional: boolean;
  lastSyncAt: string | null;
  nextSyncAt: string | null;
  syncStatus: SyncStatus;
  lastError: string | null;
  rowCount: number;
  templateId?: string;
  templateCategory?: TemplateCategory;
  filters: SheetDataFilters;
  columnMappings: ColumnMappingItem[];
  sharedUsers: SharedUser[];
  createdAt: string;
}

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
  recommendedFrequency: SyncFrequency;
  isPopular?: boolean;
  usageCount: number;
}

export interface SyncHistoryEntry {
  id: string;
  sheetId: string;
  sheetTitle: string;
  timestamp: string;
  status: 'success' | 'partial' | 'failed';
  rowsAdded: number;
  rowsUpdated: number;
  rowsDeleted: number;
  durationMs: number;
  triggeredBy: 'auto_cron' | 'manual_user' | 'webhook';
  errorMessage?: string;
  dataHash?: string;
}

export interface GoogleAccountInfo {
  isConnected: boolean;
  email: string;
  name: string;
  avatarUrl: string;
  connectedAt: string;
  lastUsedAt: string;
  autoSyncEnabled: boolean;
  quotaUsedPercent: number;
  grantedScopes: string[];
}
