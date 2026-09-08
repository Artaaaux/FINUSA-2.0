PROJECT NAME: SAVE MONEY (Savings \& Financial Goals Feature)

VERSION: 1.0 - MVP

DATE: 2024

STATUS: Pre-Development



═══════════════════════════════════════════════════════════



1. FEATURE OVERVIEW

═══════════════════════════════════════════════════════════



Feature Name: Save Money - Goal-Based Savings Tracker \& Planner

Parent Project: FINUSA (Finance Nusantara)

Purpose: Membantu pengguna mengatur tujuan menabung (financial goals), melacak progress, dan memberikan insights untuk mencapai target saving mereka dengan lebih sistematis

Target Users:

* Mahasiswa (saving untuk gadget, liburan, dll)
* UMKM Owners (business savings, emergency fund, expansion fund)
* Individu yang ingin mengelola keuangan lebih terstruktur

Core Goals:

* Membuat menabung lebih terukur \& achievable
* Gamifikasi saving process (milestones, achievements)
* Provide actionable insights untuk accelerate savings
* Automate recurring transfers ke savings account
* Track multiple savings goals simultaneously

Related Features:

* Monitor Keuangan (track balance \& spending)
* AI Chat (savings tips \& personalized recommendations)
* Financial Management (transaction recording)

Phase: 3.4 - Main App Pages

Status: Design Phase



═══════════════════════════════════════════════════════════



2. USER STORIES \& REQUIREMENTS

═══════════════════════════════════════════════════════════



2.1 PRIMARY USER STORIES

US-1: Create Savings Goal
"As a user, I want to create multiple savings goals with specific targets
so I can track progress towards different financial objectives"

AC:
✓ Create new goal with name, target amount, target date
✓ Select goal category (travel, gadget, education, emergency fund, house, etc)
✓ Upload goal image/icon for visual reference
✓ Set priority level (high, medium, low)
✓ Add goal description/notes
✓ Get estimated monthly savings required calculation
✓ Success notification on goal creation



US-2: Goal Progress Tracking
"As a user, I want to see real-time progress on my savings goals
with clear visualization and progress metrics"

AC:
✓ Display progress bar for each goal
✓ Show amount saved vs target amount
✓ Show percentage completed
✓ Show estimated days to completion
✓ Display savings rate needed to reach goal on time
✓ Update progress automatically from transactions



US-3: Goal Dashboard Overview
"As a user, I want to see all my savings goals at a glance
with prioritized view and key metrics"

AC:
✓ Display all active goals as cards
✓ Show goal image, name, target amount, progress
✓ Sort by: priority, deadline, progress
✓ Quick stats: total saving goal, total saved, days remaining
✓ Filter by status: active, completed, abandoned
✓ Quick add goal button
✓ Empty state with call-to-action



US-4: Automated Savings Transfer
"As a user, I want to set up automatic/recurring transfers to my savings account
to make saving effortless and consistent"

AC:
✓ Set up recurring transfer with frequency (weekly, bi-weekly, monthly)
✓ Set transfer amount
✓ Choose source \& destination account
✓ Set start date \& end date (optional)
✓ Enable/disable toggle for recurring transfer
✓ Confirm before setup
✓ Show transfer schedule/timeline
✓ Pause/resume capability



US-5: Goal Details \& History
"As a user, I want to view detailed information about a specific goal
and see transaction history contributing to that goal"

AC:
✓ Display goal details: name, image, description, category
✓ Show target amount, target date, current progress
✓ Display milestone breakdown (optional)
✓ Show all transactions contributing to goal
✓ Show recurring transfer schedule
✓ Display achievement milestones (25%, 50%, 75%, 100%)
✓ Edit goal option (change target, deadline, etc)
✓ Delete goal with confirmation



US-6: Milestone Achievements
"As a user, I want to celebrate milestones when reaching savings targets
to stay motivated and engaged"

AC:
✓ Award badges/achievements at 25%, 50%, 75%, 100%
✓ Show achievement notifications
✓ Confetti/celebratory animation at milestones
✓ Share milestone to (future: social media)
✓ Track all achievements in profile
✓ Display achievement badges on goal cards



US-7: Smart Savings Insights
"As a user, I want to receive personalized insights and recommendations
to help me save more effectively"

AC:
✓ Calculate average monthly savings capacity
✓ Suggest realistic savings targets based on spending patterns
✓ Recommend goals based on typical user profiles
✓ Identify spending categories to cut/reduce
✓ Show "quick wins" (save X by reducing Y category)
✓ Estimate days to reach goal based on current rate
✓ Send weekly/monthly savings insights



US-8: Goal Completion \& Analysis
"As a user, I want to mark goals as completed and analyze
my savings achievements"

AC:
✓ Mark goal as completed
✓ Show completion date \& time taken
✓ Display final statistics (total saved, interest earned if applicable)
✓ Show average monthly savings rate
✓ Suggest next goal based on completion
✓ Move completed goal to archive
✓ Display on profile/achievements



US-9: Goal Comparison \& Benchmarking
"As a user, I want to compare my savings performance with personal targets
and understand if I'm on track"

AC:
✓ Display pace vs target comparison (ahead/on-track/behind)
✓ Show days remaining vs savings needed per day
✓ Visual indicator of goal status
✓ Suggest actions if behind target
✓ Compare actual vs projected savings curve



US-10: Goal Collaboration (Future)
"As a user in a family/group, I want to collaborate on shared savings goals
with other account members"

AC:
✓ Create shared goal (not MVP, future feature)
✓ Invite collaborators
✓ Show contributions from each member
✓ Track collective progress



US-11: Reports \& Export
"As a user, I want to export savings goals and progress data
for record-keeping or analysis"

AC:
✓ Export goal list as CSV/PDF
✓ Export goal progress report
✓ Export transaction history for specific goal
✓ Include charts in PDF export
✓ Custom date range selection



US-12: Mobile Savings Tracking
"As a mobile user, I want to easily track and update savings goals
on the go with optimized interface"

AC:
✓ Mobile-optimized goal cards
✓ Quick add savings amount (fast-track)
✓ Swipeable goal carousel
✓ Push notifications for milestones
✓ Bottom sheet for goal details
✓ One-tap recurring transfer



═══════════════════════════════════════════════════════════



3. PAGE STRUCTURE \& COMPONENTS

═══════════════════════════════════════════════════════════



3.1 MAIN LAYOUT

/app/dashboard/save-money/page.tsx
├── Header
│   ├── Title: "Save Money"
│   ├── Total Savings Summary Widget
│   └── Add Goal Button
├── Body
│   ├── Top Section (Summary Stats)
│   │   ├── Total Savings Card
│   │   ├── Total Goal Target Card
│   │   ├── Completion Rate Card
│   │   └── Savings Rate Card
│   ├── Mid Section (Goals List)
│   │   ├── Filter/Sort Bar
│   │   │   ├── Filter by: Status (active/completed/abandoned)
│   │   │   ├── Sort by: Priority, Deadline, Progress
│   │   │   └── Search goals
│   │   └── Goals Grid/List
│   │       ├── Goal Cards (responsive grid)
│   │       └── Empty state
│   ├── Bottom Section (Insights)
│   │   ├── Savings Insights Widget
│   │   ├── Recommended Actions
│   │   └── Recent Milestones
│   └── Modals
│       ├── Create Goal Modal
│       ├── Goal Details Modal
│       ├── Setup Transfer Modal
│       └── Insights Modal
└── Footer



3.1b SECONDARY PAGE: Goal Detail Page

/app/dashboard/save-money/\[goalId]/page.tsx
├── Header
│   ├── Back button
│   ├── Goal title
│   ├── Edit \& Delete buttons
│   └── Goal image/banner
├── Body
│   ├── Progress Section
│   │   ├── Large progress bar
│   │   ├── Target amount \& current amount
│   │   ├── Percentage \& days remaining
│   │   └── Milestone badges
│   ├── Details Section
│   │   ├── Goal description
│   │   ├── Category \& priority
│   │   ├── Created date \& target date
│   │   └── Status
│   ├── Automation Section
│   │   ├── Recurring transfer setup
│   │   ├── Transfer schedule
│   │   └── Auto-save toggle
│   ├── Analytics Section
│   │   ├── Savings progress chart
│   │   ├── Average savings rate
│   │   └── Projection to target
│   └── Transactions Section
│       ├── All transactions for this goal
│       ├── Filter \& sort options
│       └── Manual entry option
└── Footer



3.2 KEY COMPONENTS

Component: GoalCard
Purpose: Display single goal summary
Props:

* goal: Goal
* onClick: () => void
* onEdit: () => void
* onDelete: () => void
* compact?: boolean
Displays:
* Goal image/icon
* Goal name \& target
* Progress bar with percentage
* Target date \& days remaining
* Milestone badges
* Quick action buttons

Component: GoalProgressBar
Purpose: Visual progress indicator
Props:

* current: number
* target: number
* percentage: number
* showPercentage?: boolean
* showMilestones?: boolean
* milestonePositions?: number\[]
Colors:
* Background: Light gray
* Progress: Blue (#2563EB)
* Milestone markers: Purple (#9333EA)

Component: SavingsInsightCard
Purpose: Display actionable savings tips
Props:

* title: string
* description: string
* action: string
* actionLink?: string
* impact: 'high' | 'medium' | 'low'
* onDismiss?: () => void

Component: CreateGoalForm
Purpose: Modal form for creating new goal
Props:

* onSubmit: (goal: CreateGoalDTO) => void
* onCancel: () => void
* defaultCategory?: string
Fields:
* Goal name
* Target amount
* Target date
* Category selector
* Image upload
* Description
* Priority selector

Component: RecurringTransferSetup
Purpose: Configure automatic savings transfer
Props:

* goalId: string
* onSubmit: (transfer: TransferDTO) => void
* onCancel: () => void
Fields:
* Source account selector
* Destination account selector
* Amount input
* Frequency selector
* Start date
* End date (optional)

Component: MilestoneAchievement
Purpose: Celebration modal when milestone reached
Props:

* milestone: number (25, 50, 75, 100)
* goalName: string
* onContinue: () => void
Display:
* Celebratory animation
* Achievement badge
* Milestone message
* Share button

Component: GoalSummaryWidget
Purpose: Quick stats widget for goal
Props:

* goal: Goal
Displays:
* Current vs target amount
* Percentage complete
* Days remaining
* Required daily/weekly/monthly savings

Component: SavingsInsightsWidget
Purpose: Display actionable insights
Props:

* userId: string
* limit?: number
Displays:
* Top 3-5 insights
* Impact score
* Call-to-action for each insight

Component: GoalStatusBadge
Purpose: Visual status indicator
Props:

* status: 'active' | 'completed' | 'abandoned' | 'on-track' | 'behind'
Colors:
* Active: Blue
* Completed: Green
* Abandoned: Gray
* On-track: Green
* Behind: Orange/Red



═══════════════════════════════════════════════════════════



4. DATA MODELS \& DATABASE SCHEMA

═══════════════════════════════════════════════════════════



4.1 NEW TABLES

Table: savings\_goals

* id: UUID (PK)
* user\_id: UUID (FK)
* name: STRING (required)
* description: TEXT (optional)
* category: ENUM (travel, gadget, education, emergency\_fund, house, car, wedding, business, other)
* target\_amount: DECIMAL (required)
* current\_amount: DECIMAL (default: 0)
* currency: STRING (default: IDR)
* target\_date: DATE (required)
* priority: ENUM (high, medium, low, default: medium)
* status: ENUM (active, completed, abandoned, on-hold, default: active)
* image\_url: STRING (optional)
* created\_at: TIMESTAMP
* completed\_at: TIMESTAMP (nullable)
* updated\_at: TIMESTAMP
* metadata: JSONB (custom fields)

Table: recurring\_transfers

* id: UUID (PK)
* user\_id: UUID (FK)
* goal\_id: UUID (FK) (nullable - can transfer without goal)
* source\_account\_id: UUID (FK)
* destination\_account\_id: UUID (FK)
* amount: DECIMAL (required)
* frequency: ENUM (weekly, bi-weekly, monthly, daily, custom)
* start\_date: DATE (required)
* end\_date: DATE (nullable)
* next\_transfer\_date: DATE
* is\_active: BOOLEAN (default: true)
* last\_transfer\_date: TIMESTAMP (nullable)
* total\_transferred: DECIMAL (default: 0)
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: goal\_milestones

* id: UUID (PK)
* goal\_id: UUID (FK)
* milestone\_percentage: INT (25, 50, 75, 100)
* achieved\_at: TIMESTAMP (nullable)
* notification\_sent: BOOLEAN (default: false)
* created\_at: TIMESTAMP

Table: goal\_transactions

* id: UUID (PK)
* goal\_id: UUID (FK)
* transaction\_id: UUID (FK) (optional, if linked to actual transaction)
* amount: DECIMAL
* contribution\_type: ENUM (recurring\_transfer, manual\_entry, interest, adjustment)
* notes: TEXT (optional)
* created\_at: TIMESTAMP
(This is a junction table linking transactions to goals)

Table: achievements

* id: UUID (PK)
* user\_id: UUID (FK)
* achievement\_type: ENUM (goal\_completed, milestone\_25, milestone\_50, milestone\_75, milestone\_100, consistency\_30day, rapid\_save, etc)
* related\_goal\_id: UUID (FK) (nullable)
* badge\_url: STRING
* earned\_at: TIMESTAMP
* is\_shared: BOOLEAN (default: false)
* shared\_at: TIMESTAMP (nullable)
* created\_at: TIMESTAMP

Table: savings\_insights (Optional - for caching computed insights)

* id: UUID (PK)
* user\_id: UUID (FK)
* insight\_type: ENUM (spending\_reduction, goal\_recommendation, progress\_pace, etc)
* title: STRING
* description: TEXT
* recommended\_action: TEXT
* impact\_score: INT (1-10)
* metadata: JSONB
* created\_at: TIMESTAMP
* expires\_at: TIMESTAMP



4.2 RELATIONSHIP WITH EXISTING TABLES

transactions table (existing):

* Used to: Auto-populate goal savings
* Link: goal\_transactions.transaction\_id → transactions.id
* When user manually categorizes transaction as contributing to goal

accounts table (existing):

* Used to: Source/destination for recurring transfers
* Link: recurring\_transfers.source/destination\_account\_id → accounts.id

categories table (existing):

* Used to: Categorize savings goals (different from transaction categories)
* Link: Custom goal categories stored in goals.category



4.3 API RESPONSE MODELS

GetSaveMoneyDashboard Response:
{
summary: {
totalSavings: number,
totalGoalTarget: number,
activGoalCount: number,
completedGoalCount: number,
averageSavingsRate: number,
overallProgressPercent: number
},
goals: Goal\[],
recentMilestones: Milestone\[],
insights: Insight\[],
upcomingTransfers: RecurringTransfer\[]
}

CreateSavingsGoal Request:
{
name: string,
targetAmount: number,
targetDate: ISO8601,
category: GoalCategory,
priority: 'high' | 'medium' | 'low',
description?: string,
imageFile?: File
}

CreateRecurringTransfer Request:
{
goalId?: string,
sourceAccountId: string,
destinationAccountId: string,
amount: number,
frequency: TransferFrequency,
startDate: ISO8601,
endDate?: ISO8601
}

GetGoalDetail Response:
{
goal: Goal,
milestones: Milestone\[],
recurringTransfer?: RecurringTransfer,
transactions: GoalTransaction\[],
analytics: {
savingsRate: number,
daysRemaining: number,
requiredDailySavings: number,
projectedCompletionDate: ISO8601,
isOnTrack: boolean
}
}

SaveingsInsights Response:
{
insights: Insight\[],
generatedAt: ISO8601,
nextUpdateAt: ISO8601
}
where Insight = {
id: string,
type: InsightType,
title: string,
description: string,
action: string,
impactScore: number,
metadata: object
}



═══════════════════════════════════════════════════════════



5. UI/UX SPECIFICATIONS

═══════════════════════════════════════════════════════════



5.1 DESIGN SYSTEM COMPLIANCE

Color Usage:
✓ Primary (Blue #2563EB): Goal targets, primary CTA
✓ Accent (Purple #9333EA): Achievements, milestones
✓ Success (Green #10B981): Progress, completed goals
✓ Warning (Orange #F59E0B): Goals behind target
✓ Danger (Red #EF4444): Abandoned goals, critical alerts
✓ Progress bar gradient: Blue → Green (on track)
✓ Background (Light #FAFAF9): Card backgrounds

Typography (Nunito):
✓ Page Title: H1 (40px, weight 700)
✓ Goal Name: H2 (24px, weight 700)
✓ Section Title: H3 (20px, weight 600)
✓ Body Text: 15px, weight 400, line-height 1.6
✓ Amount Display: 18px, weight 600 (for numbers)
✓ Small Labels: 13px, weight 500

Spacing \& Layout:
✓ Goal cards: 20px padding, 16px border-radius
✓ Grid gap: 20px (desktop), 16px (tablet/mobile)
✓ Section spacing: 32px
✓ Component padding: 16-24px

Animations:
✓ Progress bar fill: 600ms, easeInOut
✓ Milestone celebration: 1000ms with confetti
✓ Card entrance: 300ms staggered
✓ Milestone badge pop: 400ms with bounce



5.2 RESPONSIVE BREAKPOINTS

Desktop (1440px):

* 3-column grid for goal cards
* Full summary widgets visible
* Insights sidebar on right
* Hover effects on cards
* Detailed charts visible

Tablet (768px):

* 2-column grid for goal cards
* Stacked summary widgets
* Insights in main column below goals
* Touch-friendly spacing
* Simplified charts

Mobile (375px):

* 1-column single card view
* Swipeable goal carousel
* Summary as single compact widget
* Bottom sheet for actions
* Simplified visualizations
* Large touch targets (48px min)



5.3 GOAL CARD DISPLAY

Desktop View:
Layout (vertical):
- Image/icon (top, 200px height)
- Goal name (bold, large)
- Target amount \& current amount
- Progress bar
- Target date \& days remaining
- Status badges (milestones achieved)
- Action buttons (view, edit)

Mobile View:
Layout (compact):
- Small icon (left, 60px)
- Goal name (left, prominent)
- Current/target amount (right, large)
- Mini progress bar (below name)
- Days remaining (small text)
- Tap to expand full view

Card Interactivity:

* Click card → Navigate to goal detail page
* Hover card (desktop) → Show action buttons
* Swipe (mobile) → Carousel through goals
* Quick actions: View, Add Money, Edit



5.4 PROGRESS VISUALIZATION

Primary Progress Bar:

* Width: 100% of container
* Height: 12px
* Background: Light gray (#E5E7EB)
* Progress fill: Blue (#2563EB)
* Border radius: 6px
* Milestone markers: Purple badges at 25%, 50%, 75%, 100%
* Animation: Smooth fill on load/update

Milestone Badges:

* Position: On progress bar at milestones
* Size: 24px diameter
* Design: Circular with badge icon
* Color: Purple (#9333EA) or Gold (#FDB022) for achieved
* Hover: Show milestone detail

Progress Text:

* Format: "₹X,XXX / ₹Y,YYY (XX%)"
* Position: Below progress bar
* Font size: 14px
* Color: Dark gray

Timeline Indicator:

* Show target date vs today
* Format: "XX days left" or "XX days overdue"
* Color: Green if on track, Orange if behind
* Font size: 12px



5.5 SAVINGS INSIGHTS DISPLAY

Insight Cards:
Layout:
- Icon/avatar (left, 40px)
- Title (bold, 16px)
- Description (14px, secondary text)
- Action button or link (right)
- Impact badge (high/medium/low)

Colors by Impact:
- High: Green (#10B981)
- Medium: Blue (#2563EB)
- Low: Gray (#6B7280)

Interactions:
- Click card → See full insight detail
- Dismiss button → Hide insight
- Action button → Take recommended action

Insight Types Display:

1. Spending Reduction
"You spent ₹X,XXX on food this month. Reducing by 20% could add ₹X,XXX/month to savings"
2. Goal Recommendation
"Based on your spending, you could save ₹X,XXX/month. Suggest new goal: \[Goal Name]"
3. Progress Pace
"You're XX% behind target. Increase monthly savings by ₹X,XXX to stay on track"
4. Quick Win
"Cancel unused subscriptions (₹X,XXX/month) to reach goal XX days faster"
5. Consistency Booster
"Set up ₹X,XXX recurring transfer to automate your savings"



5.6 MILESTONE ACHIEVEMENT CELEBRATION

Milestone Popup Modal:

* Centered, overlay background
* Animation: Scale in with confetti
* Content:

  * Large achievement badge (100px)
  * "Congratulations!" text (24px, bold)
  * Milestone message: "You've reached 50% of \[Goal Name]!"
  * Progress stats (total saved, days taken)
  * Achievement badges earned (if applicable)
  * Share button
  * Continue button
* Duration: 3-5 seconds auto-dismiss option
* Animation: Confetti, milestone badge pop

Confetti Animation:

* Duration: 2-3 seconds
* Colors: Purple (#9333EA), Blue (#2563EB), Gold (#FDB022)
* Particles: 30-50
* Trigger: On milestone reached



5.7 CREATE GOAL MODAL

Form Layout:

* Title: "Create New Savings Goal"
* Fields (in order):

  1. Goal name (text input, required)
  2. Goal image upload (drag \& drop, preview)
  3. Category selector (dropdown)
  4. Target amount (currency input, required)
  5. Target date (date picker, required)
  6. Priority (radio buttons)
  7. Description (textarea, optional)
* Buttons: Cancel, Create Goal
* Dynamic help text below amount field showing monthly savings needed

Validation:

* Goal name: Min 3 chars, max 50 chars
* Target amount: Min ₹1,000, realistic max ₹1,000,000,000
* Target date: Must be in future
* Show inline validation errors
* Disable submit if validation fails

Mobile Behavior:

* Bottom sheet modal (not centered)
* Fullscreen on small screens
* Sticky submit buttons at bottom



5.8 RECURRING TRANSFER SETUP

Modal Layout:

* Title: "Set Up Auto-Save"
* Subtitle: "Automatically transfer money to save \[Goal Name]"
* Steps (if wizard-style):
Step 1: Select source account
Step 2: Select destination account
Step 3: Enter amount \& frequency
Step 4: Review \& confirm

Fields:
1. Source account dropdown (with balance)
2. Destination account dropdown
3. Amount input
4. Frequency selector (weekly, bi-weekly, monthly)
5. Start date (date picker)
6. End date (optional, date picker)
7. Next transfer preview

Preview Section:
- "You'll transfer ₹X,XXX every \[frequency]"
- Timeline visual showing transfer schedule (next 3-6 months)
- Total will be saved in X months calculation

Buttons: Cancel, Skip, Confirm Setup

Success State:
- Confirmation message
- Show transfer schedule
- Add another transfer option



═══════════════════════════════════════════════════════════



6. FEATURE SPECIFICATIONS

═══════════════════════════════════════════════════════════



6.1 DASHBOARD SUMMARY SECTION

Summary Stat Cards (4 cards):
Card 1: Total Savings
- Label: "Total Savings"
- Value: Formatted currency (₹X,XXX,XXX)
- Trend: % change vs previous month (if applicable)
- Subtitle: "Across all goals"
- Color: Blue (#2563EB)

Card 2: Total Goal Target
- Label: "Goal Target"
- Value: Formatted currency
- Subtitle: "All active goals combined"
- Color: Purple (#9333EA)

Card 3: Completion Rate
- Label: "Completion Rate"
- Value: Percentage (XX%)
- Formula: (Total Saved / Total Target) \* 100
- Subtitle: "Overall progress"
- Color: Green (#10B981)

Card 4: Average Savings Rate
- Label: "Monthly Savings"
- Value: Formatted currency (₹X,XXX)
- Subtitle: "Average per month"
- Color: Blue (#2563EB)

Responsive:

* Desktop: 4 cards in 1 row
* Tablet: 2 cards per row
* Mobile: 1 card per row (scrollable)



6.2 GOAL CARDS DISPLAY

Each Goal Card Shows:

* Goal image/icon (top, 150-200px height, or smaller on mobile)
* Goal name (bold, 18-20px)
* Category badge (small pill, colored)
* Current amount \& target amount (large, "₹X,XXX / ₹Y,YYY")
* Progress bar with percentage
* Target date (small text, "Target: DD MMM YYYY")
* Days remaining (emphasized, "XXX days left" or "Overdue")
* Milestone badges achieved (if any)
* Status indicator (on-track/behind/completed)
* Quick action buttons:

  * Primary: View Details
  * Secondary: Add Money (fast-track)

Desktop Card Size: 300x400px
Tablet Card Size: 280x380px
Mobile Card Size: Full width, 280px height (compact view)

Card Hover Effects (Desktop):

* Shadow increase
* Slight scale (1.02x)
* Action buttons more visible
* Duration: 200ms

Colors by Status:

* Active on-track: Green header
* Active behind: Orange header
* Completed: Green with checkmark
* Abandoned: Gray with strikethrough



6.3 GOAL DETAIL PAGE

Goal Header Section:

* Large goal image/banner (400x200px on desktop, full width on mobile)
* Goal name overlay (bold, 32px, white text)
* Edit \& Delete buttons (top right)
* Status badge (top left)

Goal Info Section:

* Description (if available)
* Category, Priority, Created date
* Quick stats: Days remaining, Required daily savings, Projected completion date

Large Progress Section:

* Large progress bar (20px height)
* Current / Target amounts below
* Milestone badges interactive (click to see achievement info)
* Comparison bar: Current vs Projected position

Analytics Section:

* Chart 1: Savings progress over time (line chart)
* Chart 2: Contribution sources (if tracking multiple sources)
* Stats:

  * Total saved to date
  * Average monthly savings rate
  * Savings acceleration/deceleration trend
  * Days to reach goal (projected)

Automation Section:

* Recurring transfer info (if set up)
* Show transfer schedule (next 3-6 transfers)
* Edit/pause/resume options
* "Set Up Auto-Save" button (if not setup)

Transactions Section:

* All transactions contributing to goal
* Sortable \& filterable
* Show transaction type (recurring transfer, manual, etc)
* Option to remove transaction from goal

Action Buttons:

* Primary: Add Money (contribute to goal)
* Secondary: Edit Goal
* Tertiary: Set Up Auto-Save
* Danger: Mark as Completed or Abandon



6.4 GOAL FILTERS \& SORTING

Filter Options:

1. Status

   * Active (default)
   * Completed
   * Abandoned
   * On-Hold
   * Multi-select available
2. Category

   * Travel, Gadget, Education, Emergency Fund, House, Car, Wedding, Business, Other
   * Multi-select
3. Priority

   * High, Medium, Low
   * Multi-select
4. Sort Options

   * By Priority (high → low)
   * By Deadline (nearest first)
   * By Progress (highest first or lowest first)
   * By Recent (newest created first)
   * By Amount (largest first)

Search:

* Search by goal name
* Real-time filtering
* Case-insensitive



6.5 INSIGHTS ENGINE

Insights Generated:

1. Spending Reduction Opportunity

   * Analyze spending by category
   * Identify top spending categories
   * Suggest reducing specific category by %
   * Calculate savings impact
   * Example: "Reduce food spending from ₹X to ₹Y, save ₹Z/month"
2. Goal Recommendation

   * Based on current savings rate
   * Based on user profile \& age
   * Suggest new realistic goals
   * Example: "You save ₹X/month, could reach ₹Y goal in Z months"
3. Progress Pace Analysis

   * Compare current rate vs required rate
   * If behind: "Increase savings by ₹X to stay on track"
   * If ahead: "You're on track! Could reach goal XX days early"
4. Quick Wins

   * Identify unused subscriptions
   * Suggest expense reductions
   * Example: "Cancel unused gym (₹X/month)"
5. Consistency Boost

   * Recommend setting up recurring transfer
   * Calculate optimal transfer amount
   * Estimated days to save with transfer
6. Achievement Recognition

   * Celebrate milestones achieved
   * Suggest related goals
   * Show streak info

Insight Display Frequency:

* Initial: On page load (top 3 insights)
* Weekly: Email/notification with fresh insights
* On-demand: "Get Insights" button for refresh

Insight Actions:

* View full insight
* Dismiss insight
* Act on insight (e.g., create new goal, setup transfer)



6.6 ACHIEVEMENT \& GAMIFICATION SYSTEM

Achievement Types:

Milestone Achievements:
- 25% Reached: Bronze badge
- 50% Reached: Silver badge
- 75% Reached: Gold badge
- 100% Goal Completed: Platinum badge

Goal Achievements:
- First Goal: "Dream Starter"
- First Completed Goal: "Goal Crusher"
- 3 Goals Active: "Multi-Tasker"
- 5 Goals Completed: "Save Master"

Consistency Achievements:
- 30-day streak: "On Fire"
- 90-day consistency: "Diamond Hands"
- Year of saving: "Legendary Saver"

Challenge Achievements:
- Save 2x monthly target: "Turbo Saver"
- Reach 3 goals in a year: "Ambition"
- Save ₹1,000,000+: "Millionaire"

Badge Display:

* Badge icon (SVG or emoji)
* Badge name
* Description
* Unlock date
* Rarity indicator (Common, Rare, Epic, Legendary)

Notification Triggers:

* Push notification on achievement unlock
* In-app notification
* Email notification (optional)
* Achievement listed on profile



6.7 RECURRING TRANSFER MANAGEMENT

Transfer Display:

* Goal name
* Source → Destination account
* Amount \& frequency
* Active/inactive toggle
* Next transfer date (prominent)
* Total transferred so far

Transfer Schedule Visualization:

* Timeline showing next 6 transfers
* Calendar view option
* Status of each transfer (completed, pending, scheduled)
* Edit transfer history link

Actions:

* Edit transfer (amount, frequency, date)
* Pause transfer (temporarily disable)
* Resume transfer
* Cancel transfer (with confirmation)
* View transfer history

Automation Reliability:

* Show transfer status (scheduled, processing, completed, failed)
* Retry failed transfers
* Notification on transfer success
* Notification if transfer fails



6.8 GOAL EXPORT \& SHARING

Export Options:

* Export single goal as PDF
* Export all goals as CSV
* Export goal progress report
* Include charts in PDF

Export Contents:

* Goal details (name, target, deadline)
* Progress chart
* Milestone achievements
* Transaction history
* Insights snapshot

Sharing Features (Mobile):

* Share milestone achievement to messages
* Share goal progress (image + link)
* Share achievements to social (future)



═══════════════════════════════════════════════════════════



7. TECHNICAL IMPLEMENTATION

═══════════════════════════════════════════════════════════



7.1 FILE STRUCTURE

src/app/dashboard/save-money/
├── page.tsx                          # Main dashboard page
├── layout.tsx                         # Layout wrapper
├── loading.tsx                        # Loading skeleton
├── error.tsx                          # Error boundary
├── \[goalId]/
│   ├── page.tsx                      # Goal detail page
│   ├── loading.tsx
│   └── error.tsx
│
├── components/
│   ├── dashboard-header.tsx
│   ├── summary-cards/
│   │   ├── total-savings-card.tsx
│   │   ├── goal-target-card.tsx
│   │   ├── completion-rate-card.tsx
│   │   └── monthly-savings-card.tsx
│   ├── goal-cards/
│   │   ├── goal-card.tsx
│   │   ├── goal-card-grid.tsx
│   │   ├── goal-card-carousel.tsx
│   │   └── goal-empty-state.tsx
│   ├── modals/
│   │   ├── create-goal-modal.tsx
│   │   ├── goal-details-modal.tsx
│   │   ├── recurring-transfer-modal.tsx
│   │   ├── milestone-celebration-modal.tsx
│   │   └── add-money-modal.tsx
│   ├── goal-detail/
│   │   ├── goal-header.tsx
│   │   ├── goal-progress-section.tsx
│   │   ├── goal-analytics.tsx
│   │   ├── recurring-transfer-section.tsx
│   │   └── transactions-section.tsx
│   ├── insights/
│   │   ├── insights-widget.tsx
│   │   ├── insight-card.tsx
│   │   └── insights-list.tsx
│   ├── filters/
│   │   ├── goal-filter-bar.tsx
│   │   └── goal-sort-menu.tsx
│   ├── progress/
│   │   ├── progress-bar.tsx
│   │   ├── milestone-badge.tsx
│   │   └── progress-chart.tsx
│   ├── achievements/
│   │   ├── achievement-badge.tsx
│   │   ├── achievement-list.tsx
│   │   └── achievement-showcase.tsx
│   └── utils/
│       ├── confetti-animation.tsx
│       └── celebration-effects.tsx
│
├── hooks/
│   ├── useSavingGoals.ts
│   ├── useGoalDetail.ts
│   ├── useCreateGoal.ts
│   ├── useRecurringTransfers.ts
│   ├── useSavingsInsights.ts
│   ├── useAchievements.ts
│   ├── useGoalFilters.ts
│   └── useMilestoneNotifications.ts
│
└── types/
├── goal.ts
├── insight.ts
├── achievement.ts
└── transfer.ts

src/lib/services/
├── goal.service.ts
├── insight.service.ts
├── transfer.service.ts
├── achievement.service.ts
└── analytics.service.ts

src/shared/
├── types/
│   └── savings.types.ts
└── constants/
├── goal-categories.ts
├── achievement-badges.ts
└── insight-messages.ts



7.2 KEY HOOKS TO CREATE

useSavingGoals():

* Fetch all user's savings goals
* Cache with TanStack Query
* Auto-refresh on interval
* Handle loading, error states
* Returns: { goals, isLoading, error, refetch }

useGoalDetail(goalId):

* Fetch single goal with all related data
* Include milestones, transfers, transactions, analytics
* Returns: { goal, isLoading, error }

useCreateGoal():

* Handle goal creation mutation
* Image upload handling
* Form validation
* Returns: { createGoal, isPending, isSuccess, error }

useRecurringTransfers():

* Fetch all recurring transfers
* Handle transfer mutations (create, update, pause, resume)
* Returns: { transfers, createTransfer, updateTransfer, deleteTransfer }

useSavingsInsights():

* Fetch computed savings insights
* Generate insights if stale
* Handle insight dismissal
* Returns: { insights, isLoading, dismissInsight }

useAchievements():

* Fetch user achievements
* Handle achievement unlock notifications
* Returns: { achievements, newAchievements }

useGoalFilters():

* Manage filter state
* Apply filters to goal list
* Save filter preferences
* Returns: { filters, setFilters, clearFilters, filteredGoals }

useMilestoneNotifications():

* Monitor goal progress
* Trigger milestone notifications
* Show celebration modal
* Returns: { showCelebration, milestone }



7.3 API ENDPOINTS NEEDED

GET /api/save-money/dashboard

* Returns: Dashboard summary with all data
* Query params: period (optional)

GET /api/save-money/goals

* Query params: status, category, sort, page
* Returns: PaginatedGoals

POST /api/save-money/goals

* Body: CreateGoalDTO with image
* Returns: Goal

GET /api/save-money/goals/:goalId

* Returns: GoalDetail with analytics

PUT /api/save-money/goals/:goalId

* Body: Goal updates
* Returns: Goal

DELETE /api/save-money/goals/:goalId

* Returns: Success message

POST /api/save-money/goals/:goalId/complete

* Returns: Goal with completed status

GET /api/save-money/milestones

* Query params: goalId (optional)
* Returns: Milestone\[]

POST /api/save-money/transfers

* Body: CreateRecurringTransferDTO
* Returns: RecurringTransfer

PUT /api/save-money/transfers/:transferId

* Body: Transfer updates
* Returns: RecurringTransfer

DELETE /api/save-money/transfers/:transferId

* Returns: Success message

POST /api/save-money/transfers/:transferId/pause

* Returns: RecurringTransfer

POST /api/save-money/transfers/:transferId/resume

* Returns: RecurringTransfer

GET /api/save-money/insights

* Query params: limit
* Returns: Insight\[]

POST /api/save-money/insights/:insightId/dismiss

* Returns: Success message

GET /api/save-money/achievements

* Returns: Achievement\[]

POST /api/save-money/goals/:goalId/add-money

* Body: { amount, sourceAccountId }
* Creates manual contribution
* Returns: Goal with updated amount

POST /api/save-money/goals/:goalId/transactions

* Body: GoalTransactionDTO
* Link transaction to goal
* Returns: GoalTransaction

GET /api/export/goals

* Query params: format (csv/pdf), goalId (optional)
* Returns: File download



7.4 STATE MANAGEMENT

Zustand Store for Save Money:

```typescript
interface SaveMoneyStore {
  // State
  goals: Goal\[]
  selectedGoal?: Goal
  filters: GoalFilterState
  insights: Insight\[]
  achievements: Achievement\[]
  
  // Derived state
  totalSavings: number
  totalTarget: number
  completionRate: number
  
  // Actions
  setGoals: (goals: Goal\[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  deleteGoal: (goalId: string) => void
  setSelectedGoal: (goal: Goal) => void
  setFilters: (filters: GoalFilterState) => void
  addInsight: (insight: Insight) => void
  dismissInsight: (insightId: string) => void
  addAchievement: (achievement: Achievement) => void
  clearNewAchievements: () => void
}
```



7.5 PERFORMANCE OPTIMIZATIONS

Data Fetching:
✓ TanStack Query caching (5 minute stale time for goals)
✓ Pagination for goal list (not needed for MVP, but prepare structure)
✓ Lazy load goal detail page
✓ Debounce filter application (300ms)

Rendering:
✓ Memoize goal cards (React.memo)
✓ Virtual scrolling for large goal lists (if >20 goals)
✓ useMemo for derived calculations
✓ Code split for chart libraries (lazy import)

Animations:
✓ Use CSS animations for progress bar (cheaper than JS)
✓ Framer Motion with optimized configs
✓ Disable animations on low-end devices
✓ Use `will-change` CSS strategically

Images:
✓ Next.js Image component with blur placeholder
✓ Optimize goal images (max 2MB)
✓ Use WebP with fallback
✓ Lazy load images below fold



7.6 TESTING STRATEGY

Unit Tests:

* Goal calculations (progress %, days remaining, etc)
* Insight generation logic
* Filter \& sort logic
* Achievement unlock conditions

Component Tests:

* GoalCard: Display correct data, status colors
* ProgressBar: Accurate visualization
* Modals: Form validation, submission
* Charts: Data rendering

Integration Tests:

* Create goal → See in dashboard
* Setup transfer → See in goal detail
* Milestone achievement → Show celebration \& badge
* Insights generation → Correct insights shown

E2E Tests (Playwright):

* Complete goal creation flow
* Setup recurring transfer
* Achieve goal milestone
* Export goal data



7.7 SECURITY \& PRIVACY

Row Level Security:
✓ Users can only access their own goals
✓ Implement RLS on all tables
✓ Verify user\_id on all mutations

Data Protection:
✓ Image uploads validated (size, type)
✓ Amount inputs sanitized
✓ Transaction links verified
✓ Export files generated securely (no sensitive data leak)

Authentication:
✓ Require auth for all save-money endpoints
✓ Session validation



═══════════════════════════════════════════════════════════



8. PHASE TIMELINE \& MILESTONES

═══════════════════════════════════════════════════════════



Phase 3.4 Development Timeline:

Week 1: Setup \& Core Components

* Create page structure \& layouts
* Setup data models \& database
* Create base components (GoalCard, ProgressBar, SummaryCards)
* Setup hooks \& Zustand store
* Deliverable: Basic dashboard scaffold with placeholder data

Week 2: Goal Management

* Implement Create Goal modal \& form
* Implement goal detail page
* Implement Edit/Delete goal functionality
* Connect to backend API
* Deliverable: Full CRUD for goals

Week 3: Automation \& Analytics

* Implement Recurring Transfer setup
* Create analytics section (charts)
* Build savings insights engine
* Implement filter \& sorting
* Deliverable: Automation \& analytics functional

Week 4: Gamification \& Polish

* Implement milestone achievements \& celebration
* Create achievement badges \& display
* Add goal comparison \& progress tracking
* Mobile responsiveness
* Deliverable: Gamification complete

Week 5: Testing \& Optimization

* Comprehensive testing
* Performance optimization
* Error handling \& edge cases
* Accessibility audit
* Deliverable: Production ready



Milestones:
M1: Dashboard structure with mock data (EOW1)
M2: Full goal CRUD working (EOW2)
M3: Automation \& analytics implemented (EOW3)
M4: Gamification features complete (EOW4)
M5: QA ready \& optimized (EOW5)



═══════════════════════════════════════════════════════════



9. SUCCESS METRICS \& ACCEPTANCE CRITERIA

═══════════════════════════════════════════════════════════



Performance Metrics:
✓ Dashboard load time: <3 seconds (desktop), <4s (mobile)
✓ Lighthouse score: 90+ across all metrics
✓ Core Web Vitals: All passing
✓ Chart interaction: <200ms latency
✓ Filter application: <300ms

Functional Metrics:
✓ 100% of user stories implemented (all 12 stories)
✓ Create goal: Works with validation
✓ Goal detail page: Complete with all sections
✓ Recurring transfer: Setup \& management working
✓ Insights: Generating \& displaying correctly
✓ Achievements: Unlocking \& displaying correctly
✓ Milestones: Detection \& celebration modal working

Quality Metrics:
✓ TypeScript: No errors (strict mode)
✓ Type coverage: >90%
✓ Unit test coverage: >80%
✓ Accessibility: WCAG AA compliant
✓ No console errors/warnings
✓ Mobile responsive (all breakpoints)

User Experience Metrics:
✓ Animations smooth (60 FPS)
✓ All interactive elements work
✓ Loading states visible
✓ Error messages clear \& actionable
✓ Empty states helpful
✓ Mobile UX optimized (touch targets, spacing)



Acceptance Criteria (AC):
✓ Dashboard displays in <3 seconds
✓ Create/edit/delete goals working
✓ Goal detail page complete \& functional
✓ Recurring transfers setup \& working
✓ Milestones trigger correctly
✓ Celebrations appear on milestone unlock
✓ Insights generate \& display
✓ Achievements unlock appropriately
✓ Responsive on 1440px, 768px, 375px
✓ Export generates valid PDF/CSV
✓ No TypeScript errors
✓ Mobile navigation intuitive



═══════════════════════════════════════════════════════════



10. DEPENDENCIES \& ASSUMPTIONS

═══════════════════════════════════════════════════════════



External Dependencies:
✓ Supabase (database + auth + storage for images)
✓ Chart library (Recharts for visualizations)
✓ Shadcn/UI components
✓ Framer Motion (animations)
✓ Lucide React (icons)
✓ Next.js 15 with TypeScript
✓ Tailwind CSS
✓ React Confetti (for celebrations)

Assumptions:
✓ User authentication already implemented
✓ Transaction data exists in Supabase
✓ Account/wallet system implemented
✓ Users can have multiple accounts
✓ Backend infrastructure ready
✓ Image storage setup (Supabase storage)
✓ Timezone handling for dates

Future Enhancements (Out of MVP scope):
✓ Collaborative/shared savings goals
✓ Group challenges
✓ Interest calculation \& compound savings
✓ Investment-linked savings
✓ AI-powered goal recommendations
✓ Social sharing features
✓ Goal recommendations based on age/income
✓ Savings challenges \& competitions
✓ Integration with banking APIs for auto-tracking



═══════════════════════════════════════════════════════════



11. NOTES FOR IMPLEMENTATION

═══════════════════════════════════════════════════════════



Goal Categories with Default Colors:

* Travel: #FF6B6B (Red)
* Gadget: #4ECDC4 (Teal)
* Education: #45B7D1 (Blue)
* Emergency Fund: #FA8072 (Salmon)
* House: #F7DC6F (Yellow)
* Car: #BB8FCE (Purple)
* Wedding: #F8B88B (Orange)
* Business: #52C41A (Green)
* Other: #BDC3C7 (Gray)

Achievement Rarity:

* Common: Every 25% milestone
* Rare: First goal completed, 30-day streak
* Epic: 5 goals completed, year of saving
* Legendary: ₹1M saved, multiple challenges

Calculation Formulas:

Progress Percentage:
= (currentAmount / targetAmount) \* 100

Days Remaining:
= Math.max(0, Math.ceil((targetDate - today) / millisPerDay))

Required Daily Savings:
= (targetAmount - currentAmount) / daysRemaining

Required Monthly Savings:
= (targetAmount - currentAmount) / (daysRemaining / 30)

Estimated Completion Date:
= today + ((targetAmount - currentAmount) / averageDailySavings)

Completion Rate (Overall):
= (totalSaved / sumOfAllTargets) \* 100

Savings Rate (Monthly):
= (income - expense) for the month

Default Recurring Transfer:
Calculate recommended amount based on:

* Days remaining
* Target amount - Current amount
* User's monthly surplus
* Suggest conservative 50% of monthly surplus



Mobile-First Design Tips:
✓ Test on actual devices (iPhone, Android)
✓ Swipeable goal carousel for easy navigation
✓ Bottom sheet for modals (not center overlay)
✓ Large touch targets (48px minimum)
✓ Simplified charts (pie chart better than complex visualization)
✓ Sticky header with key metrics
✓ Minimize scrolling on goal cards

Accessibility Checklist:
✓ Color not only indicator (use icons/text too)
✓ ARIA labels on icons
✓ Semantic HTML (button, form, etc)
✓ Keyboard navigation full support
✓ Contrast ratio: 4.5:1 for text
✓ Focus indicators visible
✓ Loading states announced
✓ Error messages linked to form fields

Naming Conventions (FINUSA Standard):
✓ Components: PascalCase (GoalCard, ProgressBar)
✓ Files: kebab-case (goal-card.tsx, progress-bar.tsx)
✓ Hooks: camelCase (useSavingGoals)
✓ Constants: UPPER\_SNAKE\_CASE
✓ Types: PascalCase (Goal, Achievement)



═══════════════════════════════════════════════════════════



12. GLOSSARY

═══════════════════════════════════════════════════════════



Savings Goal:

* A specific financial target with amount and deadline
* Can have multiple goals simultaneously
* Has progress tracking

Progress:

* Current amount saved vs target amount
* Displayed as percentage and visual bar

Target Amount:

* The goal amount user wants to save
* Must be >= ₹1,000

Target Date:

* Deadline for achieving the goal
* Used to calculate required savings rate

Milestone:

* Progress checkpoint (25%, 50%, 75%, 100%)
* Triggers achievement badge when reached
* Celebrated with notification

Recurring Transfer:

* Automated periodic transfer from one account to another
* Helps automate savings process
* Can be weekly, bi-weekly, monthly

Savings Rate:

* How much money being saved per time period
* Can be daily, weekly, monthly, yearly
* Important for tracking progress

Achievement/Badge:

* Digital reward for reaching milestones or goals
* Gamification element
* Can be shared

Goal Category:

* Classification of savings goal
* Examples: Travel, Gadget, Emergency Fund, etc
* Used for organization \& insights

Auto-Save:

* Another term for recurring transfer
* Automatic money movement to savings

Days Remaining:

* Days left until target date
* Used to calculate required daily savings

Quick Win:

* Small, actionable insight
* Example: "Save ₹500/month by reducing subscriptions"

Insight:

* Data-driven recommendation or observation
* Generated from transaction \& goal data
* Helps user save more effectively



═══════════════════════════════════════════════════════════

