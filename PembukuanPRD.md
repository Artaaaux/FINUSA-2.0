PROJECT NAME: PEMBUKUAN (Financial Management \& Bookkeeping Feature)

VERSION: 1.0 - MVP

DATE: 2024

STATUS: Pre-Development



═══════════════════════════════════════════════════════════



1. FEATURE OVERVIEW

═══════════════════════════════════════════════════════════



Feature Name: Pembukuan - Transaction Management \& Bookkeeping System

Parent Project: FINUSA (Finance Nusantara)

Purpose: Menyediakan sistem pembukuan yang mudah digunakan untuk mencatat semua transaksi keuangan (income \& expense) secara terstruktur, dengan kategori yang fleksibel dan tools untuk reconciliation

Target Users:

* Mahasiswa (track daily expenses \& income)
* UMKM Owners (business accounting, invoice tracking)
* Individu yang ingin organized financial records

Core Goals:

* Membuat pencatatan transaksi menjadi cepat \& mudah
* Support multiple entry methods (manual, bulk import, recurring)
* Provide accurate financial records untuk reporting
* Simplify reconciliation dengan bank statements
* Organize transactions dengan flexible categorization
* Enable audit trail \& transaction history

Related Features:

* Monitor Keuangan (displays data dari pembukuan)
* Save Money (link transactions to savings goals)
* AI Chat (insights dari pembukuan data)

Phase: 3.2 - Main App Pages

Status: Design Phase

Priority: HIGH (Core feature - foundation untuk other features)



═══════════════════════════════════════════════════════════



2. USER STORIES \& REQUIREMENTS

═══════════════════════════════════════════════════════════



2.1 PRIMARY USER STORIES

US-1: Quick Add Transaction
"As a user, I want to quickly record a transaction with minimal effort
so I can log expenses/income without friction"

AC:
✓ Fast entry form: amount, category, note (3 fields)
✓ Pre-selected today as date
✓ Default account selector (use last used)
✓ One-tap submit (auto-save)
✓ Success toast notification
✓ Show transaction added confirmation
✓ Option to add another immediately
✓ Load in <1 second



US-2: Detailed Transaction Entry
"As a user, I want to add detailed transaction information
when I need to record comprehensive financial records"

AC:
✓ Full form with all fields: date, type (income/expense), amount, account, category
✓ Optional fields: description, tags, receipt attachment, notes
✓ Set transaction status (pending/completed)
✓ Link to savings goal (optional)
✓ Recurring transaction setup
✓ Form validation with error messages
✓ Auto-save draft functionality
✓ Duplicate detection (warn if similar transaction already exists)



US-3: Edit \& Delete Transactions
"As a user, I want to modify or remove recorded transactions
to correct mistakes or update information"

AC:
✓ Edit transaction (all fields editable)
✓ Delete transaction with confirmation
✓ Show confirmation dialog for destructive actions
✓ Audit trail: show edit history (optional)
✓ Maintain transaction status on edit
✓ Update related records (goals, budgets)
✓ Soft delete option (mark as deleted, not removed)



US-4: Transaction Categorization
"As a user, I want to organize transactions into categories
and create custom categories for my specific needs"

AC:
✓ Pre-defined categories (food, transport, utilities, salary, etc)
✓ Create custom category with name, icon, color
✓ Edit category details
✓ Delete unused category
✓ Assign multiple tags per transaction
✓ Categorize in bulk (select multiple transactions)
✓ Auto-categorize based on merchant/description
✓ Category suggestions on entry



US-5: Recurring Transactions
"As a user, I want to set up recurring transactions
to automatically log recurring income/expense"

AC:
✓ Create recurring entry (daily, weekly, bi-weekly, monthly, yearly)
✓ Set start date \& end date (optional)
✓ Set recurrence pattern (e.g., every 1st \& 15th)
✓ View recurring schedule
✓ Edit recurring template
✓ Skip specific occurrence without affecting series
✓ Cancel recurrence
✓ Auto-apply on schedule date
✓ Notify user before/after occurrence



US-6: Bulk Transaction Import
"As a user (especially UMKM), I want to import multiple transactions
from CSV or bank statements to avoid manual entry"

AC:
✓ CSV upload \& parsing
✓ Map CSV columns to transaction fields
✓ Preview imported transactions before confirming
✓ Validation: check for duplicates, invalid data
✓ Show import summary (X transactions imported, Y rejected)
✓ Edit individual transactions if needed
✓ Add notes/tags to imported batch
✓ Support multiple file formats (CSV, Excel, OFX)
✓ Duplicate detection (check existing transactions)



US-7: Transaction Search \& Filter
"As a user, I want to find specific transactions easily
using various search and filter criteria"

AC:
✓ Full-text search by description/merchant
✓ Filter by: date range, category, amount range, account, type (income/expense)
✓ Filter by: status (pending/completed), tags
✓ Multiple simultaneous filters
✓ Save filter presets
✓ Sort by: date, amount, category
✓ Advanced search options
✓ Clear all filters option
✓ Search results count
✓ Faceted search display



US-8: Bank Reconciliation
"As a user/UMKM, I want to reconcile my recorded transactions
with actual bank statements to ensure accuracy"

AC:
✓ Upload bank statement (CSV/PDF)
✓ Match bank transactions with recorded transactions
✓ Show unmatched transactions (from bank \& from app)
✓ Mark transactions as reconciled
✓ Reconciliation report with date \& summary
✓ Show reconciliation history
✓ Identify discrepancies (amount mismatch, missing transactions)
✓ Reconciliation status indicator per account



US-9: Receipt \& Document Attachment
"As a user, I want to attach receipts/invoices to transactions
for complete record-keeping and audit trail"

AC:
✓ Upload image of receipt/invoice
✓ Upload PDF document
✓ Store up to X documents per transaction
✓ Preview attached images/documents
✓ Delete attachment
✓ Auto-extract data from receipt (OCR - future)
✓ Download attachment
✓ View attachment history



US-10: Multi-Account Management
"As a user with multiple accounts/wallets, I want to manage transactions
across different accounts and see consolidated view"

AC:
✓ Record transaction in specific account
✓ Transfer between accounts
✓ View account balance (automatically updated)
✓ Account summary: income, expense, balance
✓ Filter transactions by account
✓ Reconcile per account
✓ Account statement export
✓ Multiple currency support (future)



US-11: Transaction Status \& Pending Management
"As a user, I want to track transaction status (pending vs completed)
for accurate financial position"

AC:
✓ Mark transaction as pending on entry
✓ Change status to completed
✓ Filter by status
✓ Pending transactions listed separately (optional)
✓ Show pending amount in balance calculation
✓ Pending transaction reminder
✓ Show reconciliation impact of pending items



US-12: Transaction Tags \& Notes
"As a user, I want to add flexible tags and notes to transactions
for better organization and context"

AC:
✓ Add multiple tags per transaction
✓ Create custom tags
✓ Manage tag list
✓ Filter by tag
✓ Tag suggestions based on history
✓ Add detailed notes/description
✓ Search in tags \& notes
✓ Show tag cloud



US-13: Transaction Templates
"As a user with frequent recurring payments, I want to create transaction templates
to speed up entry for similar transactions"

AC:
✓ Save transaction as template
✓ View template list
✓ Use template to create transaction (pre-fill)
✓ Edit template
✓ Delete template
✓ Template suggestions based on patterns
✓ Categorize templates



US-14: Transaction Reporting \& Export
"As a user, I want to export transaction data for accounting, taxes,
or external analysis"

AC:
✓ Export to CSV
✓ Export to Excel (formatted)
✓ Export to PDF (formatted report)
✓ Custom date range
✓ Select columns to export
✓ Filter before export (category, account, etc)
✓ Include/exclude pending transactions
✓ Summary statistics in export
✓ Account statement format option



US-15: Mobile-Optimized Transaction Entry
"As a mobile user, I want optimized entry interface
for recording transactions on the go"

AC:
✓ Large touch targets (48px min)
✓ Single-column form layout
✓ Numeric keypad for amount
✓ Quick category picker (tap-to-select)
✓ Bottom sheet for modals
✓ Swipe to delete
✓ Voice input for amount (future)
✓ Camera access for receipt (future)



═══════════════════════════════════════════════════════════



3. PAGE STRUCTURE \& COMPONENTS

═══════════════════════════════════════════════════════════



3.1 MAIN LAYOUT

/app/dashboard/pembukuan/page.tsx
├── Header
│   ├── Title: "Pembukuan"
│   ├── Account selector (dropdown)
│   ├── Add Transaction Button (prominent)
│   └── Filter/Search toggle
├── Body
│   ├── Quick Entry Section (Sticky, optional)
│   │   └── Mini form: amount, category, note
│   ├── Filter \& Search Bar
│   │   ├── Search box (text search)
│   │   ├── Date range picker
│   │   ├── Category filter
│   │   ├── Type filter (income/expense)
│   │   ├── Status filter (pending/completed)
│   │   ├── Account filter
│   │   └── Advanced filters (show/hide)
│   ├── Summary Stats Section
│   │   ├── Period Income
│   │   ├── Period Expense
│   │   ├── Net (Income - Expense)
│   │   └── Period selector (month/year/custom)
│   ├── Transaction List
│   │   ├── Grouped by date (optional)
│   │   ├── Transaction items with:
│   │   │   - Date \& time
│   │   │   - Category icon
│   │   │   - Description
│   │   │   - Amount (color-coded)
│   │   │   - Status badge (if pending)
│   │   │   - Attachment indicator (if receipt)
│   │   ├── Pagination or infinite scroll
│   │   └── Empty state
│   └── Modals
│       ├── Add Transaction Modal (detailed)
│       ├── Quick Add Modal
│       ├── Transaction Detail Modal
│       ├── Bulk Import Modal
│       ├── Category Management Modal
│       ├── Recurring Transaction Modal
│       ├── Reconciliation Modal
│       ├── Receipt Upload Modal
│       └── Export Modal
└── Footer
└── Action buttons (Import, Export, Reconcile)



3.1b SECONDARY PAGE: Category Management

/app/dashboard/pembukuan/categories/page.tsx
├── Header
│   ├── Title: "Categories"
│   ├── Add Category Button
│   └── Search/filter
├── Body
│   ├── Default Categories Section
│   │   ├── Income categories
│   │   ├── Expense categories
│   │   └── (Read-only or can customize)
│   ├── Custom Categories Section
│   │   ├── List of custom categories
│   │   └── Edit/Delete options per category
│   ├── Category Detail View
│   │   ├── Category name, icon, color
│   │   ├── Transaction count
│   │   ├── Total spent/earned
│   │   └── Last used date
│   └── Category Statistics
│       ├── Most used categories
│       └── Monthly spending by category
└── Footer



3.1c SECONDARY PAGE: Recurring Transactions

/app/dashboard/pembukuan/recurring/page.tsx
├── Header
│   ├── Title: "Recurring Transactions"
│   ├── Add Recurring Button
│   └── Filter (active/paused)
├── Body
│   ├── List of recurring transactions
│   │   ├── Transaction name
│   │   ├── Amount
│   │   ├── Frequency
│   │   ├── Next occurrence
│   │   ├── Status (active/paused/ended)
│   │   └── Edit/Delete buttons
│   ├── Schedule view (calendar)
│   │   └── Show upcoming occurrences
│   └── History of generated transactions
└── Footer



3.1d SECONDARY PAGE: Reconciliation

/app/dashboard/pembukuan/reconciliation/page.tsx
├── Header
│   ├── Title: "Reconciliation"
│   ├── Account selector
│   └── Upload Statement Button
├── Body
│   ├── Current Reconciliation Status
│   │   ├── Last reconciled date
│   │   ├── Reconciliation status (balanced/unbalanced)
│   │   ├── Unreconciled amount
│   │   └── Unmatched transaction count
│   ├── Statement Upload Section
│   │   └── Drag \& drop area
│   ├── Matching Section
│   │   ├── Bank transactions list
│   │   ├── App transactions list
│   │   ├── Manual matching interface
│   │   └── Auto-match results
│   ├── Discrepancy Report
│   │   ├── Amount mismatches
│   │   ├── Date discrepancies
│   │   ├── Missing transactions (bank vs app)
│   │   └── Duplicate detection
│   └── Reconciliation Summary
│       ├── Period covered
│       ├── Transactions matched
│       ├── Closing balance
│       └── Export reconciliation report
└── Footer



3.2 KEY COMPONENTS

Component: TransactionItem
Purpose: Display single transaction in list
Props:

* transaction: Transaction
* isSelected?: boolean
* onSelect?: () => void
* onClick: () => void
* onEdit?: () => void
* onDelete?: () => void
Displays:
* Date \& time
* Category icon \& name
* Description/merchant
* Amount (formatted, color-coded)
* Status badge
* Attachment indicator
* Account (if multi-account view)

Component: QuickAddForm
Purpose: Fast transaction entry
Props:

* onSubmit: (transaction: QuickTransaction) => void
* onCancel?: () => void
* defaultAccount?: Account
Fields:
* Amount input (large, numeric)
* Category selector (grid view)
* Note input (single line)
* Type toggle (income/expense)

Component: DetailedTransactionForm
Purpose: Complete transaction entry
Props:

* transaction?: Transaction (for edit)
* onSubmit: (transaction: TransactionDTO) => void
* onCancel: () => void
Fields:
* Date \& time picker
* Type (income/expense/transfer)
* Amount
* Account selector
* Category selector
* Description
* Status (pending/completed)
* Tags input
* Receipt upload
* Notes

Component: CategoryManager
Purpose: Create/edit/delete categories
Props:

* categories: Category\[]
* onSave: (category: Category) => void
* onDelete: (categoryId: string) => void
Display:
* Category list with icons, colors
* Edit/delete actions
* Create new category form

Component: TransactionFilter
Purpose: Advanced filtering
Props:

* onFilter: (filters: FilterState) => void
* filters: FilterState
Display:
* Date range picker
* Category multi-select
* Amount range slider
* Account selector
* Status checkbox
* Type selector

Component: ReconciliationViewer
Purpose: Bank reconciliation interface
Props:

* bankTransactions: Transaction\[]
* appTransactions: Transaction\[]
* onMatch: (bankId, appId) => void
* onUnmatch: (matchId) => void
Display:
* Split view: bank vs app
* Match status indicators
* Discrepancy highlights
* Match/unmatch controls

Component: BulkImportPreview
Purpose: Preview before importing
Props:

* importedTransactions: Transaction\[]
* duplicates: Transaction\[]
* onConfirm: () => void
* onCancel: () => void
Display:
* Transaction list preview
* Duplicate warning
* Summary stats
* Column mapping info

Component: ReceiptUpload
Purpose: Attach receipts to transaction
Props:

* transactionId: string
* onUpload: (file: File) => void
* onDelete: (attachmentId: string) => void
Display:
* Upload area (drag \& drop)
* Attachment list with thumbnails
* Preview modal



Component: TransactionSummaryCard
Purpose: Quick stats for period
Props:

* period: DateRange
* data: TransactionSummary
Display:
* Total income (formatted)
* Total expense (formatted)
* Net amount
* Period indicator
* Previous period comparison



Component: CategoryBadge
Purpose: Category display badge
Props:

* category: Category
* size?: 'small' | 'medium' | 'large'
Display:
* Icon
* Color
* Category name
* Hover tooltip (optional)



═══════════════════════════════════════════════════════════



4. DATA MODELS \& DATABASE SCHEMA

═══════════════════════════════════════════════════════════



4.1 EXISTING TABLES (to be used)

Table: transactions

* id: UUID (PK)
* user\_id: UUID (FK)
* account\_id: UUID (FK)
* category\_id: UUID (FK)
* amount: DECIMAL (required)
* type: ENUM ('income', 'expense', 'transfer')
* description: STRING
* date: TIMESTAMP (required)
* status: ENUM ('pending', 'completed') (default: 'completed')
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP
* tags: JSONB (array of tag strings)
* metadata: JSONB (flexible storage)

Table: categories

* id: UUID (PK)
* user\_id: UUID (FK) (nullable for defaults)
* name: STRING (required)
* icon: STRING (emoji or icon name)
* color: STRING (hex color)
* type: ENUM ('income', 'expense')
* is\_default: BOOLEAN
* is\_active: BOOLEAN
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: accounts

* id: UUID (PK)
* user\_id: UUID (FK)
* name: STRING (required)
* type: ENUM ('cash', 'bank', 'credit\_card', 'e\_wallet', 'business')
* balance: DECIMAL
* currency: STRING (default: 'IDR')
* institution: STRING (optional)
* is\_active: BOOLEAN
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP



4.2 NEW TABLES

Table: recurring\_transactions

* id: UUID (PK)
* user\_id: UUID (FK)
* account\_id: UUID (FK)
* category\_id: UUID (FK)
* template\_name: STRING
* amount: DECIMAL
* type: ENUM ('income', 'expense', 'transfer')
* description: STRING
* frequency: ENUM ('daily', 'weekly', 'bi-weekly', 'monthly', 'yearly', 'custom')
* recurrence\_pattern: JSONB (flexible pattern: e.g., {"month": \[1, 15]} for 1st and 15th)
* start\_date: DATE
* end\_date: DATE (nullable)
* next\_occurrence\_date: DATE
* is\_active: BOOLEAN
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: transaction\_attachments

* id: UUID (PK)
* transaction\_id: UUID (FK)
* file\_name: STRING
* file\_path: STRING (in Supabase storage)
* file\_type: STRING (image/jpeg, application/pdf, etc)
* file\_size: INT
* s3\_url: STRING (or Supabase storage URL)
* uploaded\_at: TIMESTAMP
* metadata: JSONB (optional: OCR data, etc)

Table: transaction\_templates

* id: UUID (PK)
* user\_id: UUID (FK)
* template\_name: STRING
* account\_id: UUID (FK)
* category\_id: UUID (FK)
* amount: DECIMAL (optional - can be null for variable)
* type: ENUM ('income', 'expense', 'transfer')
* description: STRING
* usage\_count: INT (default: 0)
* last\_used\_at: TIMESTAMP (nullable)
* created\_at: TIMESTAMP

Table: reconciliation\_records

* id: UUID (PK)
* account\_id: UUID (FK)
* user\_id: UUID (FK)
* reconciliation\_date: TIMESTAMP
* opening\_balance: DECIMAL
* closing\_balance: DECIMAL
* period\_start: DATE
* period\_end: DATE
* matched\_count: INT
* unmatched\_count: INT
* discrepancy\_amount: DECIMAL
* status: ENUM ('in\_progress', 'completed', 'verified')
* notes: TEXT
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: reconciliation\_matches

* id: UUID (PK)
* reconciliation\_id: UUID (FK)
* app\_transaction\_id: UUID (FK)
* bank\_transaction\_id: STRING (from uploaded statement)
* matched\_at: TIMESTAMP
* confidence\_score: DECIMAL (0-1, for auto-matching)
* manual\_match: BOOLEAN
* created\_at: TIMESTAMP

Table: transaction\_imports

* id: UUID (PK)
* user\_id: UUID (FK)
* import\_date: TIMESTAMP
* file\_name: STRING
* total\_records: INT
* successful\_count: INT
* failed\_count: INT
* duplicate\_count: INT
* import\_notes: TEXT
* metadata: JSONB (mapping info, etc)
* created\_at: TIMESTAMP

Table: transaction\_audit\_log

* id: UUID (PK)
* transaction\_id: UUID (FK)
* user\_id: UUID (FK)
* action: ENUM ('created', 'updated', 'deleted', 'reconciled')
* old\_values: JSONB
* new\_values: JSONB
* reason: STRING (optional)
* ip\_address: STRING (optional)
* created\_at: TIMESTAMP



4.3 API RESPONSE MODELS

CreateTransaction Request:
{
accountId: string,
categoryId: string,
amount: number,
type: 'income' | 'expense' | 'transfer',
description: string,
date: ISO8601,
status: 'pending' | 'completed',
tags?: string\[],
notes?: string,
linkedGoalId?: string
}

GetTransactions Request Query:
{
page?: number,
pageSize?: number,
filters?: {
dateRange?: { start: ISO8601, end: ISO8601 },
categories?: string\[],
accounts?: string\[],
type?: 'income' | 'expense' | 'all',
status?: 'pending' | 'completed',
tags?: string\[],
amountRange?: { min: number, max: number },
search?: string
},
sort?: {
field: 'date' | 'amount' | 'category',
order: 'asc' | 'desc'
}
}

GetTransactionsSummary Response:
{
period: {
start: ISO8601,
end: ISO8601
},
summary: {
totalIncome: number,
totalExpense: number,
netAmount: number,
transactionCount: number,
byCategory: { \[categoryId]: number }\[]
},
comparison?: {
previousPeriod: {
totalIncome: number,
totalExpense: number,
percentChange: number
}
}
}

BulkImportTransactions Request:
{
file: File,
accountId: string,
mappings: {
dateColumn: string,
amountColumn: string,
descriptionColumn: string,
categoryColumn?: string,
typeColumn?: string
},
skipDuplicates?: boolean
}

BulkImportTransactions Response:
{
importId: string,
importedCount: number,
skippedCount: number,
duplicateCount: number,
failedRecords: { row: number, error: string }\[],
preview: Transaction\[]
}

GetReconciliationStatus Response:
{
accountId: string,
lastReconciled: ISO8601 | null,
status: 'balanced' | 'unbalanced',
unreconciliedAmount: number,
unmatchedBankTransactions: number,
unmatchedAppTransactions: number,
pendingTransactionImpact: number
}



═══════════════════════════════════════════════════════════



5. UI/UX SPECIFICATIONS

═══════════════════════════════════════════════════════════



5.1 DESIGN SYSTEM COMPLIANCE

Color Usage:
✓ Primary (Blue #2563EB): Income, CTA buttons, positive values
✓ Accent (Purple #9333EA): Selected items, highlights
✓ Success (Green #10B981): Positive amounts, completed status
✓ Danger (Red #EF4444): Expense, negative amounts, alerts
✓ Warning (Orange #F59E0B): Pending status, caution
✓ Neutral (Gray #6B7280): Neutral amounts, disabled states
✓ Background (Light #FAFAF9): Card backgrounds

Amount Color Coding:
✓ Income: Green (#10B981)
✓ Expense: Red (#EF4444)
✓ Transfer: Blue (#2563EB)
✓ Pending: Orange (#F59E0B)

Typography (Nunito):
✓ Page Title: H1 (40px, weight 700)
✓ Section Title: H2 (28px, weight 700)
✓ Card Title: H3 (20px, weight 700)
✓ Amount Display: 18px, weight 600 (for numbers)
✓ Body Text: 15px, weight 400
✓ Small Label: 13px, weight 500
✓ Helper text: 12px, weight 400

Spacing \& Layout:
✓ Card padding: 16-20px
✓ Form field spacing: 12-16px
✓ Section margin: 24-32px
✓ Grid gap: 16-20px
✓ Button height: 44-48px



5.2 RESPONSIVE BREAKPOINTS

Desktop (1440px):

* 2-column layout (filter + transactions list)
* Full form display
* Hover effects on transaction rows
* Side-by-side reconciliation view

Tablet (768px):

* Single column main layout
* Filters in collapsible section
* Touch-friendly spacing (48px targets)
* Simplified reconciliation view

Mobile (375px):

* Single column everything
* Collapsed filters with toggle
* Large touch targets (48-56px)
* Bottom sheet modals
* Numeric keypad optimized for amount entry
* Swipe actions



5.3 TRANSACTION ITEM DISPLAY

Desktop View:
Layout (table row):
- Checkbox (for bulk actions)
- Date (left, small) | Description (center, bold) | Category (center) | Amount (right, large) | Status (small badge)
Hover:
- Background highlight
- Show edit/delete buttons (right side)
Click:
- Expand row for details or open detail modal

Tablet View:
Layout (compact row):
- Date | Category icon | Description (truncated) | Amount
Swipe:
- Left swipe: Edit/Delete options

Mobile View:
Layout (card):
- Category icon \& name (top left)
- Description (top right)
- Amount (large, bottom right, color-coded)
- Date \& status (small, bottom left)
Tap:
- Open transaction detail modal
Swipe:
- Right: Mark complete/pending
- Left: Delete/More options

Transaction Item Colors:

* Income: Green amount, blue background subtle
* Expense: Red amount, light red background
* Pending: Orange indicator, slightly dimmed
* Completed: Normal styling
* Transfer: Blue amount, purple tint



5.4 QUICK ADD FORM

Layout (Sticky/Modal):
Desktop:
- Horizontal: Amount field | Category grid | Note | Type toggle | Submit
- Located at top of transaction list
- Sticky on scroll

Mobile:
- Vertical stack
- Bottom sheet modal
- Large touch targets
- Amount field (50px height, numeric keypad)
- Category grid (4-5 per row, 60px buttons)

Fields:

1. Amount Input

   * Placeholder: "0"
   * Focused: Show numeric keypad
   * Format: Show ₹ prefix
   * Size: Extra large (mobile)
2. Category Selector

   * Grid view: Icons + labels
   * Most used categories at top
   * "More categories" link to show all
   * Quick color indicator
3. Type Toggle

   * Income / Expense (clearly separated)
   * Default: Expense
   * Visual state change
4. Note Field

   * Single line input
   * Placeholder: "Note (optional)"
   * Character limit: 100
5. Submit Button

   * Text: "Add"
   * Size: Large (56px height on mobile)
   * Loading state: Spinner + "Adding..."
   * Success: Toast notification + slide to dismiss



5.5 DETAILED FORM FIELDS

Form Layout:

* Vertical stack
* Max width: 600px
* Sections: Basic, Additional, Attachments

Basic Section:

1. Date \& Time Picker

   * Default: Today
   * Time: Optional
2. Type Selector (Income/Expense/Transfer)

   * Affects available categories
3. Amount Input

   * Numeric only
   * Required
   * Validation: > 0
4. Account Selector

   * Dropdown with account balances
   * Show account type icon
5. Category Selector

   * Dropdown or grid (design choice)
   * Show color preview
   * Create category link

Additional Section:
6. Description/Merchant
- Optional
- Autocomplete suggestions
7. Status Toggle
- Pending / Completed
- Default: Completed
8. Tags Input
- Add multiple tags
- Suggestions from history
9. Linked Goal (Optional)
- Dropdown of active goals
- Contribute to goal progress

Attachments Section:
10. Receipt Upload
- Drag \& drop area
- Click to browse
- Show preview thumbnails

Buttons:

* Save/Update (primary)
* Cancel (secondary)
* Delete (danger - only on edit)
* Save as Template (optional link)

Validation:

* Amount: Required, > 0
* Date: Must be today or past
* Category: Required
* Account: Required
* Inline error messages (red text below field)
* Disable submit until valid



5.6 TRANSACTION FILTERING \& SEARCH

Search Box:

* Full width at top
* Placeholder: "Search by description, merchant, or amount..."
* Real-time search (debounced 300ms)
* Clear button when text entered
* Search results counter

Date Range Picker:

* Preset buttons: Today, This Week, This Month, Last Month, YTD, Custom
* Custom: Start \& end date picker
* Visual indicator of selected range
* Highlight in transactions list

Category Filter:

* Multi-select dropdown
* Checkboxes for each category
* Icons \& color dots
* "Select All" / "Clear All" options
* Show count selected

Type Filter:

* Radio buttons or tabs: All, Income, Expense, Transfer
* Visual indication of selected type

Status Filter:

* Checkbox: Show Pending
* Default: Both pending \& completed

Account Filter:

* Multi-select if multiple accounts
* Single selector if only one account

Amount Range (Optional):

* Slider: Min - Max
* Input fields for exact amounts
* Show ₹ formatting

Advanced Filters (Toggle):

* Tags filter
* Merchant filter
* Description contains
* Any custom filters

Filter Display:

* Show active filter count
* "Clear All Filters" button (prominent when filters applied)
* Visual chips showing active filters with X to remove



5.7 CATEGORY MANAGEMENT UI

Category List View:

* Grid or list (design choice)
* Per category:

  * Icon (emoji or SVG)
  * Color preview square
  * Category name
  * Transaction count
  * Total amount (optional)
  * Last used date (optional)
  * Edit/Delete buttons

Create Category Form:

* Modal or inline
* Fields:

  1. Category name (text input)
  2. Icon selector (emoji picker or icon library)
  3. Color picker (circular palette or hex input)
  4. Type: Income/Expense (radio)
* Preview of final badge
* Save/Cancel buttons

Edit Category:

* Same form as create
* Show usage count (warning if used)
* Bulk reassign transactions option (if deleting)



5.8 BULK IMPORT INTERFACE

Step 1: File Upload

* Drag \& drop area (or click to browse)
* Supported formats: CSV, Excel (XLS/XLSX), OFX
* Show file size \& upload progress
* Preview first few rows

Step 2: Column Mapping

* Show CSV columns as headers
* Dropdown for each column to map to transaction fields
* Auto-detect columns based on header names
* Required mappings: Date, Amount
* Optional: Category, Description, Type, Status

Step 3: Options

* Skip duplicates (checkbox)
* Default category (if not in file)
* Default account (required)
* Set all to pending/completed (option)

Step 4: Preview

* Show parsed transactions in table format
* Highlight errors (red row)
* Show duplicate warnings (yellow)
* Pagination for large imports
* Summary: X transactions ready to import, Y duplicates, Z errors

Step 5: Confirmation

* Final review
* Confirm button (prominent)
* Cancel option
* Show success: "X transactions imported successfully"



5.9 RECONCILIATION INTERFACE

Split View Layout:
Left Side (Bank Transactions):
- Upload bank statement section (top)
- List of bank transactions
- Each row: Date | Merchant | Amount | Status (matched/unmatched)
- Click to select for matching

Right Side (App Transactions):
- Filtered to account \& period
- List of app transactions
- Same columns as bank side
- Color: Green (matched), Orange (unmatched)

Matching Interface:

* Drag \& drop transactions to match
* Auto-match suggestion (click to accept)
* Click to manually match
* Unmatch option (if already matched)

Reconciliation Status:

* Summary at top: Balanced / Unbalanced
* Show discrepancies clearly
* Warnings for:

  * Amount mismatch
  * Date difference > 3 days
  * Missing from app/bank

Reconciliation Actions:

* Mark as reconciled (checkbox)
* Create missing transaction (for unmatched)
* Save reconciliation (archive record)
* Reconciliation report generation



═══════════════════════════════════════════════════════════



6. FEATURE SPECIFICATIONS

═══════════════════════════════════════════════════════════



6.1 QUICK ADD TRANSACTION

Purpose: Minimal-friction transaction logging for daily use

Flow:

1. User enters amount
2. Selects category (predefined icons)
3. Adds optional note
4. Taps "Add"
5. Transaction saved, confirmation shown
6. Option to add another or close

Behavior:

* Pre-select today's date
* Use last used account as default
* Default to "Expense" type
* Auto-focus amount field on open
* One-tap submit (no confirmation dialog)
* Success toast with "Undo" option (1-second window)

Mobile Optimization:

* Full-screen bottom sheet
* Numeric keypad integration
* Large category buttons (tap-friendly)
* Thumb-reachable controls



6.2 DETAILED TRANSACTION ENTRY

Purpose: Complete record-keeping with all metadata

Supports:

* Income, Expense, Transfer types
* Manual entry
* Template-based entry
* Recurring setup
* Attachment upload
* Status (pending/completed)
* Tags \& notes
* Goal linking

Validation Rules:

* Amount: Must be > 0
* Date: Must be today or earlier
* Category: Required
* Account: Required
* Type \& Category must match (income category for income type)

Duplicate Detection:

* If similar transaction found:

  * Same amount, date, category within 1 day
  * Show warning: "Found similar transaction from \[date]"
  * Option to skip or confirm
  * Never block, just warn



6.3 CATEGORIZATION SYSTEM

Default Categories:

Income Categories:

* Salary (💰)
* Freelance/Side Income (💼)
* Bonus (🎁)
* Investment Returns (📈)
* Gifts (🎀)
* Refund (↩️)
* Other Income (❓)

Expense Categories:

* Food \& Dining (🍽️)
* Transport \& Travel (🚗)
* Utilities \& Bills (🏠)
* Entertainment (🎬)
* Health \& Medical (⚕️)
* Shopping (🛍️)
* Education (📚)
* Work \& Office (💻)
* Subscriptions (📱)
* Gym \& Sports (⚽)
* Personal Care (💅)
* Charity \& Gifts (🎁)
* Taxes \& Insurance (📋)
* Business Expenses (🏢)
* Other Expense (❓)

Custom Categories:

* Users can create unlimited custom categories
* Choose from emoji library or upload icon
* Pick custom color
* Set as income or expense type
* Reorder/hide unused categories



6.4 RECURRING TRANSACTIONS

Setup:

* From transaction detail: "Make Recurring"
* From recurring page: "Add Recurring"
* Template with pattern definition

Frequency Options:

* Daily
* Weekly (specify day)
* Bi-weekly
* Monthly (specify date: 1st, 15th, last day, etc.)
* Yearly (specify date)
* Custom pattern (advanced)

Pattern Examples:

* Every 1st and 15th (bi-monthly paycheck)
* Every last Friday (monthly meeting)
* Every month on variable date (auto-adjust for short months)

Schedule Display:

* Calendar view showing next 12 occurrences
* Timeline view with dates
* List view with details

Recurrence Management:

* Edit template (future \& past option)
* Skip single occurrence (doesn't affect series)
* End recurring (set end date)
* Pause recurring (temporary disable)
* Resume paused recurring

Auto-Create:

* Automatically create transaction on scheduled date
* Notification before creation (optional)
* Notification after creation
* Link to recurring template for reference



6.5 BULK IMPORT WORKFLOW

Supported Formats:

* CSV (most common)
* Excel (.xlsx, .xls)
* OFX (Open Financial Exchange)
* Bank-specific formats (future)

Import Process:

1. Upload file
2. Specify account
3. Map columns
4. Set options (skip duplicates, etc)
5. Preview imported transactions
6. Confirm import

Duplicate Prevention:

* Check for exact match: same date, amount, category
* Check for similar match: date range ±2 days, amount within ±100
* Show duplicates in preview
* Option to skip duplicates or import anyway
* Track import source to prevent re-import

Error Handling:

* Show parse errors (invalid date, amount format, etc)
* Highlight problem rows
* Option to skip error rows and continue
* Detailed error report

Post-Import:

* Summary: X imported, Y skipped, Z errors
* Option to review/edit imported transactions
* Bulk edit: adjust category for imported batch
* Add tags: label imported transactions with source/date

Auto-Categorization:

* Use merchant name to suggest category
* Learn from user's historical patterns
* Option to accept/modify suggestion



6.6 BANK RECONCILIATION

Purpose: Verify app transactions match bank statements

Workflow:

1. Select account \& date range
2. Upload bank statement
3. System auto-matches transactions
4. User reviews \& corrects mismatches
5. Reconciliation complete (or notes discrepancies)

Auto-Matching Logic:

* Exact match: Same date, amount, merchant
* Fuzzy match: Similar date (±3 days), amount (±tolerance)
* Confidence score: Show confidence level
* Manual override: User can reject auto-match

Match Display:

* Checkmark: Matched successfully
* Question mark: Unmatched
* X: Rejected match (can re-match)
* Confidence indicators for auto-matches

Discrepancy Resolution:
For each unmatched transaction:

1. Identify reason (missing in app, missing in bank, amount mismatch)
2. Offer fix options:

   * Create transaction in app
   * Adjust existing transaction
   * Mark as pending (for in-transit)
   * Note discrepancy

Reconciliation Report:

* Date range
* Account name \& balance
* Opening balance (previous reconciliation)
* Closing balance (current)
* Reconciled transactions count
* Unreconciled amount
* Discrepancies (if any)
* Signed/certified option

Reconciliation Records:

* Store each reconciliation (date, status, notes)
* View reconciliation history
* Export reconciliation reports



6.7 RECEIPT \& DOCUMENT ATTACHMENT

Upload Options:

* Camera (mobile): Take photo of receipt
* File upload: Select image/PDF from device
* Drag \& drop (desktop): Drop file to add

Supported Formats:

* Images: JPEG, PNG, WebP
* Documents: PDF
* Files up to 5MB

Storage:

* Upload to Supabase storage
* Generate thumbnail preview
* Store metadata (upload date, size, format)

Display:

* Show thumbnail in transaction detail
* Click to full view (modal or new page)
* Download option
* Delete option

OCR (Future):

* Extract data from receipt image
* Suggest amount, merchant, date
* Auto-populate transaction fields
* Manual review \& approval before saving

Multiple Attachments:

* Store up to 5 documents per transaction
* List with thumbnails
* Date uploaded indicator



6.8 TRANSACTION TEMPLATES

Creation:

* From existing transaction: "Save as Template"
* Manual creation: "New Template"

Template Fields:

* Name (e.g., "Monthly Rent", "Weekly Groceries")
* Amount (required)
* Account
* Category
* Description/merchant
* Tags
* Type (income/expense/transfer)

Usage:

* Click template to create new transaction (pre-filled)
* Modify fields as needed
* Save
* Track usage count

Smart Suggestions:

* Suggest templates for common patterns
* "Use template?" suggestion based on entered amount/category
* Keyboard shortcut or voice command (future)

Template Management:

* List all templates
* Sort by: Recent, Frequency, Name
* Edit template
* Delete template
* Mark as favorite/quick access



6.9 TRANSACTION FILTERS \& SEARCH

Full-Text Search:

* Search description, merchant name, notes
* Real-time results
* Highlights matching text
* Search results: "X results found"

Quick Filters:

* Today / This Week / This Month / Custom Date
* Income / Expense / All
* By Category (multi-select)
* By Account

Advanced Filters:

* Amount range (slider or input)
* Status (pending, completed)
* Tags (multi-select)
* Merchant name contains
* Has attachment
* Created date range

Filter Combinations:

* Supports multiple filters simultaneously
* AND logic between filter types
* Filter results update in real-time
* Show applied filters as chips

Save Filters:

* Save filter preset with name
* Recall saved filter (single click)
* Manage saved filters (edit, delete)



6.10 TRANSACTION EXPORT

Export Formats:

1. CSV - Standard format, compatible with Excel

   * Include all relevant fields
   * Option to include/exclude columns
2. Excel - Formatted worksheet

   * Column headers
   * Color coding (income/expense)
   * Summary section
3. PDF - Formatted report

   * Header: Account name, date range
   * Summary statistics
   * Transaction table
   * Graphs/charts
   * Signature/certification area

Export Options:

* Date range selector
* Include/exclude pending transactions
* Select which columns to export
* Include summary/statistics
* Include charts (PDF only)
* Export all or filtered results

Filename Format:

* "Pembukuan\_\[AccountName]*\[StartDate]*\[EndDate].csv"
* Automatically generated

Privacy:

* Include account balance (option)
* Mask sensitive data (option)
* No export of deleted transactions



═══════════════════════════════════════════════════════════



7. TECHNICAL IMPLEMENTATION

═══════════════════════════════════════════════════════════



7.1 FILE STRUCTURE

src/app/dashboard/pembukuan/
├── page.tsx                          # Main transaction list page
├── layout.tsx
├── loading.tsx
├── error.tsx
├── categories/
│   ├── page.tsx                      # Category management page
│   ├── loading.tsx
│   └── error.tsx
├── recurring/
│   ├── page.tsx                      # Recurring transactions page
│   ├── loading.tsx
│   └── error.tsx
├── reconciliation/
│   ├── page.tsx                      # Bank reconciliation page
│   ├── loading.tsx
│   └── error.tsx
│
├── components/
│   ├── transaction-list.tsx
│   ├── transaction-item.tsx
│   ├── quick-add-form.tsx
│   ├── detailed-form/
│   │   ├── transaction-form.tsx
│   │   ├── form-sections.tsx
│   │   └── form-validation.tsx
│   ├── modals/
│   │   ├── quick-add-modal.tsx
│   │   ├── transaction-detail-modal.tsx
│   │   ├── category-manager-modal.tsx
│   │   ├── bulk-import-modal.tsx
│   │   ├── reconciliation-modal.tsx
│   │   └── receipt-upload-modal.tsx
│   ├── filters/
│   │   ├── transaction-filter-bar.tsx
│   │   ├── date-range-picker.tsx
│   │   ├── category-filter.tsx
│   │   └── advanced-filters.tsx
│   ├── reconciliation/
│   │   ├── reconciliation-split-view.tsx
│   │   ├── reconciliation-matcher.tsx
│   │   ├── reconciliation-report.tsx
│   │   └── discrepancy-viewer.tsx
│   ├── import/
│   │   ├── import-uploader.tsx
│   │   ├── column-mapper.tsx
│   │   ├── import-preview.tsx
│   │   └── import-status.tsx
│   ├── categories/
│   │   ├── category-manager.tsx
│   │   ├── category-card.tsx
│   │   ├── category-form.tsx
│   │   └── category-stats.tsx
│   ├── recurring/
│   │   ├── recurring-list.tsx
│   │   ├── recurring-item.tsx
│   │   ├── recurring-form.tsx
│   │   ├── recurring-schedule.tsx
│   │   └── recurring-calendar.tsx
│   ├── summary/
│   │   ├── transaction-summary.tsx
│   │   └── summary-card.tsx
│   └── attachments/
│       ├── receipt-upload.tsx
│       ├── attachment-preview.tsx
│       └── attachment-list.tsx
│
├── hooks/
│   ├── useTransactions.ts
│   ├── useCreateTransaction.ts
│   ├── useEditTransaction.ts
│   ├── useDeleteTransaction.ts
│   ├── useTransactionFilters.ts
│   ├── useCategories.ts
│   ├── useRecurringTransactions.ts
│   ├── useBulkImport.ts
│   ├── useReconciliation.ts
│   ├── useAttachments.ts
│   └── useTransactionTemplates.ts
│
└── types/
├── transaction.ts
├── category.ts
├── recurring.ts
├── reconciliation.ts
└── import.ts

src/lib/services/
├── transaction.service.ts
├── category.service.ts
├── recurring.service.ts
├── reconciliation.service.ts
├── import.service.ts
├── attachment.service.ts
└── template.service.ts

src/shared/
├── types/
│   └── pembukuan.types.ts
└── constants/
├── default-categories.ts
└── validation-rules.ts



7.2 KEY HOOKS TO CREATE

useTransactions():

* Fetch transactions with filters
* Pagination support
* TanStack Query caching
* Returns: { transactions, isLoading, error, refetch, hasMore }

useCreateTransaction():

* Handle transaction creation
* Validation
* File upload for attachments
* Returns: { createTransaction, isPending, isSuccess, error }

useTransactionFilters():

* Manage filter state
* Apply filters to list
* Save filter presets
* Returns: { filters, setFilters, clearFilters, filteredTransactions }

useCategories():

* Fetch all categories
* Create/update/delete category
* Categorize transactions
* Returns: { categories, createCategory, updateCategory, deleteCategory }

useRecurringTransactions():

* Fetch recurring transactions
* Create/update/delete recurring
* Manage recurrence patterns
* Returns: { recurringTransactions, createRecurring, updateRecurring }

useBulkImport():

* Handle file upload
* Parse CSV/Excel
* Map columns
* Preview \& confirm import
* Returns: { uploadFile, mapColumns, previewImport, confirmImport }

useReconciliation():

* Upload bank statement
* Auto-match transactions
* Handle manual matching
* Generate report
* Returns: { uploadStatement, autoMatch, manualMatch, saveReconciliation }

useAttachments():

* Upload file to storage
* Preview attachment
* Delete attachment
* Returns: { uploadFile, deleteFile, preview }

useTransactionTemplates():

* Manage transaction templates
* Suggest templates
* Create from template
* Returns: { templates, createTemplate, useTemplate }



7.3 API ENDPOINTS NEEDED

GET /api/pembukuan/transactions

* Query: filters, sort, pagination
* Returns: PaginatedTransactions

POST /api/pembukuan/transactions

* Body: CreateTransactionDTO
* Returns: Transaction

GET /api/pembukuan/transactions/:id

* Returns: Transaction with details

PUT /api/pembukuan/transactions/:id

* Body: UpdateTransactionDTO
* Returns: Transaction

DELETE /api/pembukuan/transactions/:id

* Returns: Success message

GET /api/pembukuan/transactions/summary

* Query: dateRange, filters
* Returns: TransactionSummary

POST /api/pembukuan/transactions/bulk-import

* Body: FormData with file
* Returns: ImportPreview

POST /api/pembukuan/transactions/bulk-import/confirm

* Body: { importId, confirmations }
* Returns: ImportResult

GET /api/pembukuan/categories

* Query: type (income/expense)
* Returns: Category\[]

POST /api/pembukuan/categories

* Body: CreateCategoryDTO
* Returns: Category

PUT /api/pembukuan/categories/:id

* Body: Category updates
* Returns: Category

DELETE /api/pembukuan/categories/:id

* Returns: Success message

GET /api/pembukuan/recurring

* Query: status (active/paused/ended)
* Returns: RecurringTransaction\[]

POST /api/pembukuan/recurring

* Body: CreateRecurringDTO
* Returns: RecurringTransaction

PUT /api/pembukuan/recurring/:id

* Body: RecurringTransaction updates
* Returns: RecurringTransaction

DELETE /api/pembukuan/recurring/:id

* Returns: Success message

GET /api/pembukuan/reconciliation/status

* Query: accountId
* Returns: ReconciliationStatus

POST /api/pembukuan/reconciliation/upload

* Body: FormData with statement file
* Returns: StatementTransactions

POST /api/pembukuan/reconciliation/auto-match

* Body: { appTransactions, bankTransactions }
* Returns: MatchResults

POST /api/pembukuan/reconciliation/save

* Body: ReconciliationRecord
* Returns: ReconciliationRecord

POST /api/pembukuan/attachments

* Body: FormData with file
* Returns: Attachment with storage URL

DELETE /api/pembukuan/attachments/:id

* Returns: Success message

GET /api/pembukuan/templates

* Returns: TransactionTemplate\[]

POST /api/pembukuan/transactions/export

* Query: format (csv/pdf/excel), filters
* Returns: File download



7.4 STATE MANAGEMENT

Zustand Store for Pembukuan:

```typescript
interface PembukuanStore {
  // State
  transactions: Transaction\[]
  filters: FilterState
  selectedTransaction?: Transaction
  categories: Category\[]
  recurringTransactions: RecurringTransaction\[]
  templates: TransactionTemplate\[]
  
  // Pagination
  page: number
  pageSize: number
  total: number
  
  // Actions
  setTransactions: (transactions: Transaction\[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setFilters: (filters: FilterState) => void
  clearFilters: () => void
  setSelectedTransaction: (transaction: Transaction) => void
  setCategories: (categories: Category\[]) => void
  addCategory: (category: Category) => void
  setRecurringTransactions: (recurring: RecurringTransaction\[]) => void
}
```



7.5 PERFORMANCE OPTIMIZATIONS

Data Fetching:
✓ TanStack Query caching (3 min stale time for transactions)
✓ Pagination (20-50 items per page)
✓ Lazy load transaction list
✓ Debounce search (300ms)
✓ Infinite scroll option for mobile

Rendering:
✓ Memoize transaction items (React.memo)
✓ Virtual scrolling for large lists (>100 transactions)
✓ useMemo for derived calculations
✓ Lazy load modals (split code)

File Uploads:
✓ Compress images on client before upload
✓ Show upload progress
✓ Chunk large files (for future)
✓ Validate file type \& size client-side

Form:
✓ Debounce form input (300ms)
✓ Local draft saving
✓ Lazy load form sections (if complex)



7.6 TESTING STRATEGY

Unit Tests:

* Transaction calculations (income/expense totals)
* Filter logic \& combinations
* Date calculations (recurring patterns)
* Validation rules
* CSV parsing logic

Component Tests:

* QuickAddForm: Submit, validation
* TransactionItem: Display, interactions
* CategoryManager: CRUD operations
* BulkImport: Preview, confirmation

Integration Tests:

* Create transaction → See in list
* Setup recurring → Auto-generate on schedule
* Import CSV → Parse \& preview correctly
* Reconcile → Match transactions correctly
* Export → Generate valid file

E2E Tests:

* Complete transaction workflow
* Bulk import flow
* Reconciliation process
* Category management



7.7 SECURITY \& PRIVACY

Row Level Security:
✓ Users can only access their own transactions
✓ Implement RLS on all tables
✓ Verify user\_id on mutations

Data Protection:
✓ File uploads: Validate type, size, contents
✓ Amount inputs: Sanitize \& validate
✓ CSV imports: Scan for malicious content
✓ Audit trail: Log all modifications

File Storage:
✓ Store receipts in Supabase storage
✓ Set appropriate access levels
✓ Set expiry on temporary files
✓ Encrypt sensitive PDFs (bank statements)



═══════════════════════════════════════════════════════════



8. PHASE TIMELINE \& MILESTONES

═══════════════════════════════════════════════════════════



Phase 3.2 Development Timeline:

Week 1: Setup \& Core Components

* Create page structures
* Setup database models
* Build core components (transaction item, list, summary)
* Setup hooks \& store
* Deliverable: Basic transaction list working

Week 2: Transaction Management

* Implement quick add form
* Implement detailed form
* Implement edit/delete functionality
* Connect to backend API
* Deliverable: Full transaction CRUD working

Week 3: Categories \& Recurring

* Implement category management
* Implement category filtering
* Implement recurring transactions
* Auto-generate recurring occurrences
* Deliverable: Categories \& recurring functional

Week 4: Advanced Features

* Implement bulk import
* Implement reconciliation
* Implement receipt upload
* Implement transaction templates
* Deliverable: All advanced features working

Week 5: Polish \& Optimization

* Mobile responsiveness
* Performance optimization
* Error handling
* Testing \& QA
* Deliverable: Production ready



Milestones:
M1: Basic transaction list (EOW1)
M2: Transaction CRUD complete (EOW2)
M3: Categories \& recurring working (EOW3)
M4: Advanced features complete (EOW4)
M5: QA ready \& optimized (EOW5)



═══════════════════════════════════════════════════════════



9. SUCCESS METRICS \& ACCEPTANCE CRITERIA

═══════════════════════════════════════════════════════════



Performance Metrics:
✓ Transaction list load: <2 seconds
✓ Quick add submit: <500ms
✓ Lighthouse score: 90+
✓ Core Web Vitals: Passing
✓ Search results: <300ms (debounced)

Functional Metrics:
✓ All 15 user stories implemented
✓ Quick add: Submit in <3 taps
✓ Detailed form: Full validation working
✓ Categorization: Auto \& manual working
✓ Recurring: Creation \& auto-generation working
✓ Bulk import: CSV/Excel parsing correct
✓ Reconciliation: Auto-matching accurate
✓ Export: All 3 formats generating valid files
✓ Filters: All combinations working
✓ Mobile: All features accessible

Quality Metrics:
✓ TypeScript: No errors (strict mode)
✓ Type coverage: >90%
✓ Unit test coverage: >80%
✓ No console errors
✓ Accessibility: WCAG AA
✓ Responsive all breakpoints

User Experience:
✓ Animations smooth (60 FPS)
✓ Loading states visible
✓ Error messages clear
✓ Empty states helpful
✓ Keyboard navigation working
✓ Mobile: Thumb-reachable controls



Acceptance Criteria:
✓ Transaction list displays in <2 seconds
✓ Quick add works in <1 second
✓ Can create/edit/delete transactions
✓ Can add/manage categories
✓ Can setup recurring transactions
✓ Can import CSV/Excel
✓ Can reconcile with bank statement
✓ Can export in all formats
✓ All filters working
✓ Responsive (1440px, 768px, 375px)
✓ No TypeScript errors
✓ Mobile UX optimized



═══════════════════════════════════════════════════════════



10. DEPENDENCIES \& ASSUMPTIONS

═══════════════════════════════════════════════════════════



External Dependencies:
✓ Supabase (database, auth, storage)
✓ TanStack Query (data fetching/caching)
✓ React Hook Form (form management)
✓ Zod or Yup (form validation)
✓ Recharts (optional - for charts)
✓ Shadcn/UI components
✓ Framer Motion (animations)
✓ Lucide React (icons)
✓ Next.js 15 \& TypeScript
✓ Tailwind CSS

Libraries for Imports:
✓ papaparse (CSV parsing)
✓ xlsx (Excel parsing)
✓ file-saver (export functionality)
✓ jspdf (PDF generation)

Assumptions:
✓ User authentication implemented
✓ Account/wallet system ready
✓ Database setup complete
✓ File storage (Supabase) configured
✓ User has multiple accounts capability
✓ Currency: IDR (configurable for future)
✓ Timezone: Local user timezone

Future Enhancements (Out of MVP):
✓ Receipt OCR (extract data from images)
✓ Voice input (speak amount \& category)
✓ Mobile camera integration (take receipt photo)
✓ Bank API integration (auto-sync transactions)
✓ Invoice generation
✓ Multi-currency support
✓ AI categorization (ML-based)
✓ Transaction notes with AI analysis
✓ Mobile app sync



═══════════════════════════════════════════════════════════



11. NOTES FOR IMPLEMENTATION

═══════════════════════════════════════════════════════════



Default Categories Icons \& Colors:

Income:

* Salary: 💰 #10B981
* Freelance: 💼 #3B82F6
* Bonus: 🎁 #F59E0B
* Investment: 📈 #8B5CF6
* Gifts: 🎀 #EC4899
* Refund: ↩️ #6366F1
* Other: ❓ #6B7280

Expense:

* Food: 🍽️ #FF6B6B
* Transport: 🚗 #4ECDC4
* Utilities: 🏠 #45B7D1
* Entertainment: 🎬 #F7DC6F
* Health: ⚕️ #BB8FCE
* Shopping: 🛍️ #F8B88B
* Education: 📚 #52C41A
* Work: 💻 #1890FF
* Subscriptions: 📱 #DA70D6
* Gym: ⚽ #13C2C2
* Personal: 💅 #EB2F96
* Charity: 🎁 #FFC069
* Taxes: 📋 #8F0000
* Business: 🏢 #1890FF
* Other: ❓ #BDC3C7



Validation Rules:

Amount:

* Must be > 0
* Max: 9,999,999,999 (9.9 billion)
* Decimal: 2 places allowed
* Show error: "Amount must be greater than 0"

Date:

* Must be today or in past
* Show error: "Date cannot be in the future"
* Default: Today

Category:

* Must match transaction type (income category for income)
* Must be from user's category list
* Show error: "Please select a valid category"

Account:

* Must be active account
* Must belong to user
* Show error: "Please select an account"



Transaction Calculations:

Total Income (Period):
= SUM(transactions WHERE type='income' AND date in period)

Total Expense (Period):
= SUM(transactions WHERE type='expense' AND date in period)

Net Amount (Period):
= Total Income - Total Expense

Balance (Account):
= Initial Balance + SUM(all transactions for account)

Average Daily Spending:
= Total Expense / Days in Period

Recurring Impact (Monthly):
= SUM(recurring transaction amounts FOR month)



Mobile-First Tips:
✓ Quick add as primary entry method
✓ Full screen modals (bottom sheet)
✓ Large buttons (48-56px height)
✓ Numeric keypad for amount
✓ Swipe actions for delete/archive
✓ One-handed operation for common tasks
✓ Test on actual devices

Accessibility Checklist:
✓ Semantic HTML
✓ ARIA labels on all inputs
✓ Color + icon/text for type indication
✓ Contrast: 4.5:1 minimum
✓ Focus indicators visible
✓ Keyboard navigation complete
✓ Loading states announced
✓ Error messages linked to fields
✓ Form fields labeled



Naming Conventions (FINUSA):
✓ Components: PascalCase (TransactionItem, QuickAddForm)
✓ Files: kebab-case (transaction-item.tsx)
✓ Hooks: camelCase (useTransactions)
✓ Constants: UPPER\_SNAKE\_CASE
✓ Types: PascalCase (Transaction, Category)



═══════════════════════════════════════════════════════════



12. GLOSSARY

═══════════════════════════════════════════════════════════



Transaction:

* Single income or expense record
* Contains: date, amount, category, account, description, status

Income:

* Money received (salary, bonus, refund, gifts)
* Positive transaction type

Expense:

* Money spent (shopping, bills, subscriptions)
* Negative transaction type

Transfer:

* Money moved between own accounts
* Does not affect net wealth (internal only)

Category:

* Classification for transactions
* Can be default or custom
* Organized as income or expense

Recurring Transaction:

* Transaction that repeats on schedule
* Examples: Monthly rent, weekly groceries, annual insurance
* Auto-generates transactions on specified dates

Reconciliation:

* Process of matching app transactions with bank statements
* Ensures accuracy of financial records
* Identifies discrepancies

Reconciled:

* Transaction that has been matched with bank statement
* Marked as verified \& accurate

Unreconciled:

* Transaction not yet matched with bank statement
* Waiting for bank confirmation

Pending Transaction:

* Transaction recorded but not yet completed
* Example: Check written but not cleared
* May not count toward balance (configurable)

Completed Transaction:

* Transaction fully processed \& cleared
* Counts toward final balance

Template:

* Pre-filled transaction record
* Speeds up data entry for similar transactions
* Can be reused multiple times

Attachment:

* Receipt, invoice, or supporting document
* Attached to transaction for record-keeping
* Can be image or PDF

Bulk Import:

* Loading multiple transactions at once
* Usually from CSV or bank export
* Faster than manual entry

Duplicate:

* Transaction that already exists in system
* Detected during import or entry
* Prevents data duplication

Discrepancy:

* Mismatch between app transaction and bank record
* Could be: amount difference, date difference, or missing
* Requires investigation \& correction

Quick Add:

* Fast transaction entry interface
* Minimal fields: amount, category, note
* Designed for mobile \& frequent use

Detailed Entry:

* Complete transaction form
* All fields available
* Used for complex transactions



═══════════════════════════════════════════════════════════

