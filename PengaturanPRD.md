PROJECT NAME: PENGATURAN (Settings \& User Preferences)

VERSION: 1.0 - MVP

DATE: 2024

STATUS: Pre-Development



═══════════════════════════════════════════════════════════



1. FEATURE OVERVIEW

═══════════════════════════════════════════════════════════



Feature Name: Pengaturan - Comprehensive Settings \& User Management

Parent Project: FINUSA (Finance Nusantara)

Purpose: Menyediakan interface lengkap untuk mengelola profil pengguna, preferensi aplikasi, security settings, dan account management

Target Users:

* Semua pengguna Finusa (mahasiswa, UMKM, individuals)
* Admin users (untuk admin panel - future)

Core Goals:

* Centralized account \& preference management
* Security controls (password, 2FA, sessions)
* Privacy \& notification settings
* Personal information management
* Data export \& deletion
* Appearance customization
* Language \& locale settings

Related Features:

* All features (settings used across app)
* Sheet Integration (integration settings)
* Authentication (login/logout)

Phase: 3.6 - Main App Pages

Status: Design Phase

Priority: HIGH (Essential for user onboarding \& account management)



═══════════════════════════════════════════════════════════



2. USER STORIES \& REQUIREMENTS

═══════════════════════════════════════════════════════════



2.1 PRIMARY USER STORIES

US-1: View \& Edit Profile Information
"As a user, I want to manage my profile information (name, email, photo)
so I can keep my account details current"

AC:
✓ View current profile information
✓ Edit name (first \& last)
✓ Edit email address
✓ Upload profile picture
✓ Delete profile picture
✓ Verify email on change
✓ Save changes with confirmation
✓ Show last updated timestamp
✓ Success notification on save



US-2: Change Password
"As a user, I want to securely change my password
without compromising account security"

AC:
✓ Request current password
✓ Enter new password (2 confirmations)
✓ Password strength indicator
✓ Validate requirements (min 8 chars, etc)
✓ Prevent reuse of last 5 passwords
✓ Logout all sessions after password change (option)
✓ Confirmation email on password change
✓ Success notification
✓ Clear password fields on success



US-3: Two-Factor Authentication (2FA)
"As a user, I want to enable 2FA to add extra security to my account
and protect against unauthorized access"

AC:
✓ Enable 2FA with authenticator app (Google Authenticator, Authy)
✓ Show QR code for scanning
✓ Backup codes generation (10 codes)
✓ Verify setup with OTP token
✓ Show 2FA status
✓ Disable 2FA option
✓ Regenerate backup codes
✓ Download backup codes
✓ Alert on 2FA changes



US-4: Account Security \& Sessions
"As a user, I want to manage my active sessions and see login history
for security monitoring"

AC:
✓ List active sessions (device, location, last activity)
✓ Device info: Browser, OS, IP address
✓ Logout specific session
✓ Logout all sessions (except current)
✓ View login history (dates, IPs, success/failure)
✓ Suspicious activity alerts
✓ Trust device option (remember for 30 days)
✓ Clear login history option



US-5: Notification Preferences
"As a user, I want to customize how I receive notifications
from Finusa"

AC:
✓ Toggle notifications per channel: Email, SMS, In-app, Push
✓ Customize per notification type:
- Account alerts (login, password change)
- Transaction notifications
- Budget alerts
- Goal milestones
- Savings insights
- Recurring transaction reminders
- Bill reminders
✓ Set quiet hours (no notifications during sleep time)
✓ Notification frequency: Immediate, Daily digest, Weekly digest
✓ Save preferences immediately
✓ Preview notification (see example)
✓ Unsubscribe from all (except critical)



US-6: Privacy \& Data Settings
"As a user, I want control over my personal data and privacy"

AC:
✓ View what data is collected
✓ Download all my data (export to JSON/CSV)
✓ Delete account permanently
✓ Delete all transaction history (with confirmation)
✓ Manage third-party integrations (revoke access)
✓ Privacy policy \& terms link
✓ GDPR compliance info
✓ Data retention policy info
✓ Opt-in/out of analytics tracking
✓ Confirmation dialogs for destructive actions



US-7: Appearance \& Display Settings
"As a user, I want to customize the look and feel of the app"

AC:
✓ Theme selector: Light, Dark, Auto (system)
✓ Font size selector: Small, Normal, Large
✓ Color accent selector (primary color)
✓ Compact mode (reduce spacing/padding)
✓ Show/hide animations
✓ Currency display: Full (₹1,000.00) or Short (₹1K)
✓ Date format: DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD
✓ Number format: 1,000 or 1.000 or 1000
✓ Save preferences (persist across sessions)



US-8: Language \& Localization
"As a user, I want to use Finusa in my preferred language"

AC:
✓ Language selector (English, Bahasa Indonesia, etc - future)
✓ Auto-detect browser language (initial)
✓ Save language preference
✓ Timezone selector
✓ Currency selector (for multi-currency - future)
✓ Apply immediately to UI
✓ Remember preference



US-9: Account Connections \& Integrations
"As a user, I want to manage third-party integrations
and connected services"

AC:
✓ List connected integrations (Google Sheets, etc)
✓ Show permissions granted to each
✓ Revoke access to integration
✓ View when integration was connected
✓ Reconnect to integration
✓ Clear data from integration
✓ Integration-specific settings



US-10: Currency \& Account Preferences
"As a user, I want to set default currency and account preferences"

AC:
✓ Select default currency (IDR, USD, SGD, etc)
✓ Set default account for transactions
✓ Set default income/expense category
✓ Show/hide pending transactions in balance
✓ Auto-categorization preference (on/off)
✓ Default transaction status (pending/completed)
✓ Show/hide zero-balance accounts



US-11: Financial Preferences
"As a user, I want to customize financial calculation preferences"

AC:
✓ Set savings target (monthly amount or %)
✓ Set budget warning threshold (default: 80%)
✓ Fiscal year start date (for reporting)
✓ Business vs personal mode (affects categories/reports)
✓ Include/exclude transfers in income/expense
✓ Interest calculation preference (simple/compound)



US-12: Help \& Support
"As a user, I want easy access to help documentation and support"

AC:
✓ FAQ section (searchable)
✓ Knowledge base link
✓ Contact support button
✓ Report bug/feedback form
✓ Chat support (optional live chat)
✓ Video tutorials link
✓ Keyboard shortcuts help
✓ About Finusa section (version, build date)



US-13: About \& Legal
"As a user, I want to understand Finusa's policies and access legal info"

AC:
✓ About section: Mission, features, roadmap preview
✓ Privacy policy link \& full text
✓ Terms of service link \& full text
✓ Cookie policy
✓ Data protection policy (GDPR)
✓ Third-party licenses (open source)
✓ Contact information
✓ Status page (service health)



US-14: Accessibility Settings
"As a user with accessibility needs, I want settings for accessibility"

AC:
✓ Enable high contrast mode
✓ Increase font sizes
✓ Disable animations
✓ Text-to-speech options
✓ Keyboard navigation help
✓ Screen reader optimization
✓ Color blind mode (different color schemes)
✓ Dyslexia-friendly font option



US-15: Mobile Settings Sync
"As a user with multiple devices, I want settings to sync across devices"

AC:
✓ Settings synced to cloud
✓ Auto-sync on change
✓ Manual sync option
✓ Resolve conflicts (last-edit wins)
✓ Settings applied on app load
✓ Show sync status



═══════════════════════════════════════════════════════════



3. PAGE STRUCTURE \& COMPONENTS

═══════════════════════════════════════════════════════════



3.1 MAIN LAYOUT

/app/dashboard/settings/page.tsx
├── Header
│   ├── Title: "Settings"
│   ├── Search settings box
│   └── Save indicator (if unsaved changes)
├── Body (Sidebar + Main)
│   ├── Left Sidebar (Navigation)
│   │   ├── Settings Sections
│   │   │   ├── Profile
│   │   │   ├── Account \& Security
│   │   │   ├── Notifications
│   │   │   ├── Privacy \& Data
│   │   │   ├── Appearance
│   │   │   ├── Preferences
│   │   │   ├── Integrations
│   │   │   ├── Help \& Support
│   │   │   └── About \& Legal
│   │   └── Search results (if search used)
│   └── Right Main Content
│       ├── Section Title
│       ├── Settings Controls
│       ├── Toggle switches
│       ├── Input fields
│       ├── Selectors
│       ├── Action buttons
│       └── Save/Reset buttons
└── Footer
└── Danger zone (delete account)



3.1b SECONDARY PAGES

/app/dashboard/settings/profile/page.tsx
├── Profile Information Section
├── Profile Picture Upload
├── Name Edit
├── Email Edit
└── Save Button

/app/dashboard/settings/security/page.tsx
├── Password Change Section
├── 2FA Setup Section
├── Sessions Management
├── Login History
└── Security Alerts

/app/dashboard/settings/notifications/page.tsx
├── Notification Channels
├── Per-Event Customization
├── Quiet Hours
├── Notification Frequency
├── Preview Examples
└── Save Button

/app/dashboard/settings/privacy-data/page.tsx
├── Privacy Controls
├── Data Download
├── Data Deletion
├── Integration Management
└── GDPR Info

/app/dashboard/settings/appearance/page.tsx
├── Theme Selector
├── Font Size
├── Color Accent
├── Display Preferences
└── Preview

/app/dashboard/settings/integrations/page.tsx
├── Connected Integrations List
├── Integration Details
├── Revoke Access
├── Reconnect Option
└── Settings per Integration



3.2 KEY COMPONENTS

Component: SettingsSidebar
Purpose: Navigation for settings sections
Props:

* sections: SettingSection\[]
* activeSection: string
* onSectionChange: (section) => void
* searchQuery?: string
Display:
* Section list
* Active indicator
* Search box

Component: SettingsCard
Purpose: Group related settings
Props:

* title: string
* description?: string
* children: ReactNode
Display:
* Card layout
* Title \& description
* Settings content
* Border \& spacing

Component: ToggleSetting
Purpose: On/off preference
Props:

* label: string
* description?: string
* value: boolean
* onChange: (value) => void
Display:
* Toggle switch
* Label \& description
* Status indicator

Component: SelectSetting
Purpose: Multiple choice preference
Props:

* label: string
* options: Option\[]
* value: string
* onChange: (value) => void
Display:
* Dropdown or radio buttons
* Label
* Options with icons (optional)

Component: InputSetting
Purpose: Text input for settings
Props:

* label: string
* value: string
* onChange: (value) => void
* validation?: ValidationRule
Display:
* Input field
* Label
* Error message (if invalid)
* Character count (optional)

Component: PasswordChangeForm
Purpose: Securely change password
Props:

* onSubmit: (password) => void
Display:
* Current password input
* New password input
* Confirm password input
* Password strength meter
* Submit button

Component: TwoFactorSetup
Purpose: Enable/manage 2FA
Props:

* isEnabled: boolean
* onEnable: () => void
* onDisable: () => void
Display:
* Status indicator
* QR code (for setup)
* Backup codes
* Verify OTP input

Component: SessionList
Purpose: Display active sessions
Props:

* sessions: Session\[]
* onLogout: (sessionId) => void
* onLogoutAll: () => void
Display:
* Session list (device, location, activity)
* Logout buttons
* Current device indicator

Component: NotificationPreference
Purpose: Configure notification for event
Props:

* eventType: string
* preferences: NotificationPref
* onChange: (pref) => void
Display:
* Event name
* Channel toggles (email, SMS, push, in-app)
* Frequency selector
* Preview button

Component: DataExportForm
Purpose: Download user data
Props:

* onExport: (format) => void
Display:
* Format selector (JSON, CSV, PDF)
* Include options (transactions, goals, etc)
* Export button
* Estimated size

Component: DeleteAccountForm
Purpose: Account deletion
Props:

* onDelete: () => void
Display:
* Warning message (red)
* Confirmation input
* Delete button (danger color)
* Recovery info



═══════════════════════════════════════════════════════════



4. DATA MODELS \& DATABASE SCHEMA

═══════════════════════════════════════════════════════════



4.1 EXISTING TABLE EXTENSION

Table: users (existing - extend)

* id: UUID (PK)
* email: STRING
* password\_hash: STRING
* first\_name: STRING (nullable)
* last\_name: STRING (nullable)
* profile\_picture\_url: STRING (nullable)
* phone\_number: STRING (nullable)
* timezone: STRING (default: 'UTC')
* currency: STRING (default: 'IDR')
* language: STRING (default: 'en')
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP
* last\_login\_at: TIMESTAMP (nullable)
* is\_active: BOOLEAN
* deleted\_at: TIMESTAMP (nullable, for soft delete)



4.2 NEW TABLES

Table: user\_preferences

* id: UUID (PK)
* user\_id: UUID (FK, unique)
* theme: ENUM ('light', 'dark', 'auto', default: 'auto')
* font\_size: ENUM ('small', 'normal', 'large', default: 'normal')
* color\_accent: STRING (hex color, default: '#2563EB')
* compact\_mode: BOOLEAN (default: false)
* show\_animations: BOOLEAN (default: true)
* currency\_display: ENUM ('full', 'short', default: 'full')
* date\_format: ENUM ('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', default: 'DD/MM/YYYY')
* number\_format: ENUM ('1,000', '1.000', '1000', default: '1,000')
* high\_contrast: BOOLEAN (default: false)
* dyslexia\_font: BOOLEAN (default: false)
* colorblind\_mode: BOOLEAN (default: false)
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: user\_notification\_preferences

* id: UUID (PK)
* user\_id: UUID (FK)
* notification\_type: ENUM ('account\_alert', 'transaction', 'budget', 'goal\_milestone', 'insight', 'reminder', 'bill', 'weekly\_summary', 'monthly\_summary')
* email\_enabled: BOOLEAN (default: true)
* sms\_enabled: BOOLEAN (default: false)
* push\_enabled: BOOLEAN (default: true)
* in\_app\_enabled: BOOLEAN (default: true)
* frequency: ENUM ('immediate', 'daily\_digest', 'weekly\_digest', 'never')
* quiet\_hours\_start: TIME (nullable)
* quiet\_hours\_end: TIME (nullable)
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: user\_security\_settings

* id: UUID (PK)
* user\_id: UUID (FK, unique)
* two\_fa\_enabled: BOOLEAN (default: false)
* two\_fa\_method: ENUM ('authenticator\_app', 'sms', nullable)
* two\_fa\_secret: STRING (encrypted, nullable)
* backup\_codes: STRING\[] (encrypted, nullable)
* last\_password\_change: TIMESTAMP
* password\_history: STRING\[] (encrypted, store last 5 hashes)
* trusted\_devices: UUID\[] (device IDs)
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: user\_sessions

* id: UUID (PK)
* user\_id: UUID (FK)
* token\_hash: STRING
* device\_name: STRING
* browser: STRING
* os: STRING
* ip\_address: STRING
* location: STRING (nullable, from IP geolocation)
* last\_activity: TIMESTAMP
* created\_at: TIMESTAMP
* expires\_at: TIMESTAMP
* is\_active: BOOLEAN

Table: user\_login\_history

* id: UUID (PK)
* user\_id: UUID (FK)
* email: STRING
* ip\_address: STRING
* location: STRING (nullable)
* browser: STRING
* os: STRING
* success: BOOLEAN
* failure\_reason: STRING (nullable)
* created\_at: TIMESTAMP

Table: user\_financial\_preferences

* id: UUID (PK)
* user\_id: UUID (FK, unique)
* default\_account\_id: UUID (FK, nullable)
* default\_income\_category\_id: UUID (FK, nullable)
* default\_expense\_category\_id: UUID (FK, nullable)
* monthly\_savings\_target: DECIMAL (nullable)
* savings\_target\_type: ENUM ('fixed\_amount', 'percentage', nullable)
* budget\_warning\_threshold: INT (default: 80) (percentage)
* fiscal\_year\_start\_month: INT (default: 1)
* business\_mode: BOOLEAN (default: false)
* include\_transfers\_in\_income: BOOLEAN (default: false)
* include\_transfers\_in\_expense: BOOLEAN (default: false)
* show\_pending\_in\_balance: BOOLEAN (default: true)
* auto\_categorization: BOOLEAN (default: true)
* default\_transaction\_status: ENUM ('pending', 'completed', default: 'completed')
* show\_zero\_balance\_accounts: BOOLEAN (default: true)
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: user\_connected\_integrations

* id: UUID (PK)
* user\_id: UUID (FK)
* integration\_type: ENUM ('google\_sheets', 'bank\_api', 'payment\_gateway', etc)
* provider: STRING
* access\_token: STRING (encrypted, nullable)
* refresh\_token: STRING (encrypted, nullable)
* scopes: STRING\[]
* connected\_at: TIMESTAMP
* last\_used\_at: TIMESTAMP (nullable)
* is\_active: BOOLEAN
* settings: JSONB (integration-specific settings)
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: user\_privacy\_settings

* id: UUID (PK)
* user\_id: UUID (FK, unique)
* analytics\_tracking: BOOLEAN (default: true)
* marketing\_emails: BOOLEAN (default: true)
* data\_retention\_days: INT (default: 1825) (5 years)
* allow\_data\_sharing: BOOLEAN (default: false)
* gdpr\_consent: BOOLEAN
* terms\_acceptance: BOOLEAN
* created\_at: TIMESTAMP
* updated\_at: TIMESTAMP

Table: user\_activity\_audit\_log

* id: UUID (PK)
* user\_id: UUID (FK)
* action: STRING (e.g., 'password\_change', 'email\_change', '2fa\_enabled', etc)
* details: JSONB
* ip\_address: STRING
* created\_at: TIMESTAMP



4.3 API RESPONSE MODELS

GetUserSettings Response:
{
profile: {
firstName: string,
lastName: string,
email: string,
profilePictureUrl?: string,
phoneNumber?: string
},
preferences: UserPreferences,
security: SecuritySettings,
notifications: NotificationPreferences\[],
financial: FinancialPreferences,
integrations: ConnectedIntegration\[],
privacy: PrivacySettings
}

UpdateUserPreferences Request:
{
field: string,
value: any,
changes?: Partial<UserPreferences>
}

ChangePassword Request:
{
currentPassword: string,
newPassword: string,
confirmPassword: string
}

ExportUserData Request:
{
format: 'json' | 'csv' | 'pdf',
includeTransactions: boolean,
includeGoals: boolean,
includeSettings: boolean,
dateRange?: { start: ISO8601, end: ISO8601 }
}



═══════════════════════════════════════════════════════════



5. UI/UX SPECIFICATIONS

═══════════════════════════════════════════════════════════



5.1 DESIGN SYSTEM COMPLIANCE

Color Usage:
✓ Primary (Blue #2563EB): CTA buttons
✓ Success (Green #10B981): Enabled/active status
✓ Danger (Red #EF4444): Delete/destructive actions
✓ Warning (Orange #F59E0B): Caution, warnings
✓ Neutral (Gray #6B7280): Disabled, secondary

Typography (Nunito):
✓ Page Title: H1 (40px, weight 700)
✓ Section Title: H2 (28px, weight 700)
✓ Card Title: H3 (20px, weight 700)
✓ Setting Label: 15px, weight 600
✓ Helper text: 13px, weight 400

Spacing:
✓ Card padding: 20px
✓ Section spacing: 32px
✓ Between settings: 24px
✓ Sidebar width: 280px



5.2 RESPONSIVE BREAKPOINTS

Desktop (1440px):

* Sidebar + main content (2-column)
* Sidebar fixed (sticky)
* Full form width

Tablet (768px):

* Collapsible sidebar
* Main content full width
* Simplified layout

Mobile (375px):

* Stacked layout (sidebar above)
* Single column
* Bottom sheet for some modals
* Large touch targets (48px)



5.3 SETTINGS CARD LAYOUT

Card Structure:

* Title (bold, 18px)
* Description (optional, 14px gray)
* Setting controls
* Helper text (optional, small)
* Last updated indicator (optional, for some settings)

Spacing Within Card:

* 16px between settings
* 24px between cards
* 20px card padding

Visual Hierarchy:

* Section title most prominent
* Setting labels secondary
* Helper text smallest
* Icons for visual support



5.4 TOGGLE SWITCHES

Visual Design:

* Size: 44x24px (mobile touch-friendly)
* Colors:

  * On: Green (#10B981)
  * Off: Gray (#D1D5DB)
* Animation: Smooth 200ms transition
* Label to left of toggle
* Description below (optional)

States:

* Off: Gray background, circle left
* On: Green background, circle right
* Disabled: Gray, no interaction
* Loading: Spinner during save

Behavior:

* Click to toggle
* Auto-save (or save button)
* Show loading state during save
* Show success indicator briefly



5.5 NOTIFICATION PREFERENCES UI

Layout:

* Event type name (left, 40%)
* Channel toggles (email, SMS, push, in-app) (center)
* Frequency dropdown (right, 20%)

Per Event:

* Row with event name \& icon
* Toggle each channel independently
* Dropdown for frequency
* Preview link

Quiet Hours:

* Time pickers (start \& end)
* Day selection (Mon-Sun)
* Visual timeline
* Preview of quiet period

Preview Modal:

* Show example notification
* Different channels (email, push, in-app)
* Allow customization from preview



5.6 SECURITY SETTINGS UI

Password Change:

* Current password input (hidden)
* New password input (hidden)
* Confirm password input (hidden)
* Password strength meter (visual bar)

  * Red: Weak
  * Orange: Fair
  * Green: Strong
* Requirements checklist:
✓ 8+ characters
✓ Upper \& lowercase
✓ Number
✓ Special character
* Submit button

2FA Setup:

* Status badge (disabled/enabled)
* Enable button (if disabled)
* QR code (large, 300x300px)
* Manual entry code (alternative)
* Verify OTP input
* Backup codes (display \& download)
* Disable button (if enabled)

Sessions:

* Current device indicator (✓ This device)
* Session list:

  * Device info (browser, OS)
  * Location (IP)
  * Last activity timestamp
  * Logout button per session
* Logout all sessions button



5.7 PROFILE PICTURE UPLOAD

Upload Area:

* Circular drop zone (240x240px desktop, 120x120px mobile)
* Current picture preview
* Hover state: Show upload icon
* Click/drag to upload
* Drag-drop indicator

After Upload:

* Preview of cropped image
* Crop tool (drag corners)
* Save button
* Cancel button

File Requirements:

* Max 5MB
* Format: JPG, PNG, WebP
* Square preferred (auto-crop to square)



5.8 DELETE ACCOUNT

Warning Card:

* Large red warning icon
* "Delete Account" title (bold, red)
* Description: "This action cannot be undone"
* List of consequences:
• All data will be permanently deleted
• Cannot be recovered
• Account cannot be reactivated
* Confirmation input: "Type 'delete account' to confirm"
* Delete button (danger color, disabled until confirmed)
* Cancel option



═══════════════════════════════════════════════════════════



6. FEATURE SPECIFICATIONS

═══════════════════════════════════════════════════════════



6.1 PROFILE MANAGEMENT

Edit Name:

* Separate first \& last name fields
* Validation: Non-empty, max 50 chars
* Save individually or together
* Show last updated date

Edit Email:

* Current email displayed
* New email input
* Verify via email (confirmation link)
* Show pending until verified
* Cannot change to existing account email

Profile Picture:

* Upload via drag-drop or click
* Automatic crop to square
* Max 5MB
* Store in Supabase storage
* CDN URL for fast loading
* Delete option to remove



6.2 PASSWORD MANAGEMENT

Changing Password:

* Request current password first
* Validate new password strength
* Prevent reuse of last 5 passwords
* Require password change every 90 days (future feature)
* Send confirmation email

Password Requirements:

* Min 8 characters
* At least 1 uppercase letter
* At least 1 lowercase letter
* At least 1 number
* At least 1 special character (!@#$%^\&\*)

Password Strength Meter:

* Weak (red): 0-2 requirements met
* Fair (orange): 3-4 requirements met
* Strong (green): All requirements met

Logout After Change:

* Option to logout all other sessions
* Recommended for security
* Current session remains active



6.3 TWO-FACTOR AUTHENTICATION

Setup Flow:

1. User clicks "Enable 2FA"
2. Choose method: Authenticator app (first release)
3. Display QR code
4. Alternative: Manual code entry
5. User scans with authenticator app
6. User enters 6-digit OTP
7. Verification successful
8. Show backup codes (10 unique codes)
9. Download/print backup codes
10. Setup complete

Backup Codes:

* Generate 10 unique codes per setup
* Each code = single-use
* Provide if authenticator inaccessible
* Can be regenerated (old codes invalidate)
* Download/print/copy options
* Store safely

Disable 2FA:

* Request password confirmation
* Show warning
* Confirm disable
* Session cleared (re-login required)

SMS Option (Future):

* Fallback if authenticator unavailable
* 6-digit code sent to phone
* 5-minute timeout



6.4 SESSION \& LOGIN MANAGEMENT

Active Sessions Display:

* Current device: Marked with ✓
* Device info:

  * Browser (Chrome, Firefox, etc)
  * OS (Windows, macOS, iOS, Android)
  * IP address
  * Location (approximated from IP)
* Last activity timestamp
* Logout button per session
* Logout all other sessions button

Login History:

* Chronological list
* Show: Date/time, IP, location, browser, OS, success/failure
* Search/filter options
* Show last 50 login attempts
* Failed attempts highlighted

Suspicious Activity:

* Alert if login from new location
* Alert if impossible travel (e.g., 2 countries in 1 hour)
* Unrecognized device warning
* Ask user to verify unusual activity

Trust Device:

* Option after login: "Trust this device for 30 days"
* Skips 2FA on trusted devices
* Must verify on untrusted device
* Revoke trust anytime



6.5 NOTIFICATION PREFERENCES

Notification Types:

* Account alerts: Login, password change, 2FA enabled/disabled
* Transactions: New transaction recorded, large transaction
* Budget: Approaching limit, exceeded limit
* Goals: Milestone reached, goal completed
* Insights: Weekly insights, savings recommendations
* Reminders: Recurring transaction due, bill reminder
* Bills: Upcoming bills, bill paid
* Summaries: Weekly digest, monthly digest

Channels:

* Email: Send to email address
* SMS: Send to phone number (future)
* Push: Browser/mobile push notification
* In-app: Show in notification bell

Frequency:

* Immediate: Alert right away
* Daily digest: Combine into daily email
* Weekly digest: Combine into weekly email
* Never: Turn off

Quiet Hours:

* Time range (start \& end)
* No notifications during quiet hours
* Critical alerts may bypass quiet hours
* Apply to all channels

Preview:

* Show example of notification format
* Different format for each channel
* Helps user understand what they'll receive



6.6 APPEARANCE CUSTOMIZATION

Theme:

* Light: White background, dark text
* Dark: Dark background, light text
* Auto: Follow system setting
* Preview: Show sample of each

Font Size:

* Small: 90% of default
* Normal: 100% (default)
* Large: 110% of default
* Live preview in app

Color Accent:

* Preset colors: Blue, Purple, Green, Orange, Red
* Or custom color picker
* Apply to buttons, links, highlights
* Preview immediately

Compact Mode:

* Reduce padding/spacing
* Smaller font sizes
* More content per screen
* Toggle on/off

Animations:

* Enable/disable all animations
* Reduce motion for accessibility
* Faster performance on low-end devices

Display Preferences:

* Currency: Full (₹1,000.00) or Compact (₹1K)
* Date format: Multiple options
* Number format: Comma vs period separator

Accessibility:

* High contrast: Stronger colors
* Dyslexia font: OpenDyslexic font
* Colorblind mode: Alternative color scheme

  * Red-green friendly
  * Blue-yellow friendly



6.7 LANGUAGE \& LOCALIZATION

Language Selection:

* Available: English, Bahasa Indonesia (add more later)
* Auto-detect: Browser language on first visit
* Save preference
* Apply immediately

Timezone:

* Auto-detect from device
* Manual selector (list of timezones)
* Show current timezone
* Update all timestamps with new timezone

Date/Number Formats:

* Locale-specific defaults
* Override default if preferred
* Date format: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
* Number format: 1,000 | 1.000 | 1000

Future Multi-Currency:

* Select default currency (IDR, USD, SGD, EUR, etc)
* Display amounts in selected currency
* Conversion if needed



6.8 PRIVACY \& DATA

What Data We Collect:

* Personal info (name, email, profile pic)
* Financial data (transactions, goals, budgets)
* Usage data (features used, frequency)
* Device info (browser, OS, IP)
* Listed with description of use

Data Download:

* Export format: JSON, CSV, PDF
* Select what to include:
• Transactions
• Goals
• Budgets
• Categories
• Settings
* Custom date range
* Estimated file size
* Download link emailed or instant download

Data Deletion:

* Delete account permanently
* Delete specific data type
* Soft delete (30-day recovery window)
* Hard delete after 30 days
* Confirmation required

Integration Management:

* List all connected services
* Show permissions granted
* Revoke access (immediately)
* Clear data from integration
* Reconnect option

Analytics Opt-Out:

* Disable analytics tracking
* Disable marketing emails
* Do not share data



6.9 ACCOUNT DELETION

Process:

1. User clicks "Delete Account"
2. Show large warning with consequences
3. Require password confirmation
4. Require email verification
5. Show 30-day recovery window
6. Confirm deletion
7. Account soft-deleted for 30 days
8. Hard delete after 30 days
9. Confirmation email sent

Recovery:

* Email within 30 days to restore
* Click recovery link
* Account restored with all data
* After 30 days, impossible to recover



6.10 FINANCIAL PREFERENCES

Default Settings:

* Default account for new transactions
* Default income category
* Default expense category
* Apply when creating transactions quickly

Savings \& Budget:

* Monthly savings target (fixed amount or %)
* Budget warning threshold (default: 80%)
* When to consider over budget

Fiscal Year:

* Set fiscal year start month
* Affects annual reports \& budgets
* Common: January (default) or April

Business Mode:

* Toggle between personal \& business mode
* Changes available categories
* Different reporting/taxation features
* Recommended for UMKM owners

Transaction Settings:

* Include transfers in income/expense
* Show pending transactions in balance
* Default status (pending/completed)
* Auto-categorization (on/off)
* Show zero-balance accounts



═══════════════════════════════════════════════════════════



7. TECHNICAL IMPLEMENTATION

═══════════════════════════════════════════════════════════



7.1 FILE STRUCTURE

src/app/dashboard/settings/
├── page.tsx                          # Main settings page
├── layout.tsx
├── loading.tsx
├── error.tsx
├── profile/
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── security/
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── notifications/
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── privacy-data/
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── appearance/
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── integrations/
│   ├── page.tsx
│   ├── loading.tsx
│   └── error.tsx
├── help/
│   ├── page.tsx
│   └── error.tsx
├── about/
│   ├── page.tsx
│   └── error.tsx
│
├── components/
│   ├── settings-sidebar.tsx
│   ├── settings-card.tsx
│   ├── settings-layout.tsx
│   ├── profile/
│   │   ├── profile-form.tsx
│   │   ├── picture-upload.tsx
│   │   └── email-change.tsx
│   ├── security/
│   │   ├── password-change-form.tsx
│   │   ├── two-factor-setup.tsx
│   │   ├── session-list.tsx
│   │   ├── login-history.tsx
│   │   └── suspicious-activity-alert.tsx
│   ├── notifications/
│   │   ├── notification-preferences.tsx
│   │   ├── notification-event-row.tsx
│   │   ├── quiet-hours-picker.tsx
│   │   └── notification-preview.tsx
│   ├── privacy-data/
│   │   ├── data-export-form.tsx
│   │   ├── integration-list.tsx
│   │   └── delete-account-form.tsx
│   ├── appearance/
│   │   ├── theme-selector.tsx
│   │   ├── font-size-selector.tsx
│   │   ├── color-picker.tsx
│   │   ├── accessibility-options.tsx
│   │   └── preview-section.tsx
│   ├── preferences/
│   │   ├── language-selector.tsx
│   │   ├── timezone-selector.tsx
│   │   ├── currency-selector.tsx
│   │   ├── financial-preferences.tsx
│   │   └── format-preferences.tsx
│   ├── toggle-setting.tsx
│   ├── select-setting.tsx
│   ├── input-setting.tsx
│   ├── settings-search.tsx
│   └── unsaved-changes-prompt.tsx
│
├── hooks/
│   ├── useUserSettings.ts
│   ├── useProfileUpdate.ts
│   ├── usePasswordChange.ts
│   ├── useTwoFactor.ts
│   ├── useNotificationPreferences.ts
│   ├── useAppearanceSettings.ts
│   ├── useUserPreferences.ts
│   ├── useDataExport.ts
│   ├── useAccountDeletion.ts
│   └── useSettingsSearch.ts
│
└── types/
├── settings.ts
├── preferences.ts
├── security.ts
└── notifications.ts

src/lib/services/
├── settings.service.ts
├── profile.service.ts
├── security.service.ts
├── notification-preferences.service.ts
├── data-export.service.ts
└── preferences.service.ts

src/lib/utils/
├── password-validator.ts
├── encryption.ts
└── data-export.ts

src/shared/
├── types/
│   └── settings.types.ts
├── constants/
│   ├── notification-types.ts
│   ├── password-requirements.ts
│   └── privacy-policies.ts
└── contexts/
└── settings-context.tsx



7.2 KEY HOOKS TO CREATE

useUserSettings():

* Fetch all user settings
* TanStack Query caching
* Returns: { settings, isLoading, error }

useProfileUpdate():

* Update profile info (name, email, picture)
* Handle image upload
* Returns: { updateProfile, isPending, isSuccess, error }

usePasswordChange():

* Change password mutation
* Validate password strength
* Returns: { changePassword, isPending, error, passwordStrength }

useTwoFactor():

* Setup 2FA (QR, OTP verification)
* Disable 2FA
* Generate backup codes
* Returns: { enable2FA, disable2FA, generateBackupCodes }

useNotificationPreferences():

* Fetch notification preferences
* Update preferences (auto-save)
* Test notification
* Returns: { preferences, updatePreference, testNotification }

useAppearanceSettings():

* Update theme, font size, colors
* Apply immediately to UI
* Persist to user preferences
* Returns: { settings, updateSetting }

useUserPreferences():

* Manage all preferences (language, timezone, currency, etc)
* Save to database
* Returns: { preferences, updatePreference }

useDataExport():

* Generate data export
* Handle file download
* Returns: { exportData, isExporting, downloadUrl }

useAccountDeletion():

* Trigger account deletion
* Handle soft delete \& recovery
* Returns: { deleteAccount, isDeleting, error, recoveryUrl }

useSettingsSearch():

* Search settings by keyword
* Highlight matching sections
* Returns: { searchResults, searchQuery, setSearchQuery }



7.3 API ENDPOINTS NEEDED

GET /api/settings

* Returns: UserSettings (all settings)

PUT /api/settings/profile

* Body: { firstName, lastName, email, phoneNumber }
* Returns: User profile updated

POST /api/settings/profile/picture

* Body: FormData with image file
* Returns: { pictureUrl }

DELETE /api/settings/profile/picture

* Returns: { success }

POST /api/settings/password/change

* Body: { currentPassword, newPassword }
* Returns: { success }

GET /api/settings/security/2fa/setup

* Returns: { qrCode, manualCode, secret }

POST /api/settings/security/2fa/verify

* Body: { otp, backupCodes }
* Returns: { success, backupCodes }

POST /api/settings/security/2fa/disable

* Body: { password }
* Returns: { success }

GET /api/settings/security/sessions

* Returns: Session\[]

POST /api/settings/security/sessions/:sessionId/logout

* Returns: { success }

POST /api/settings/security/sessions/logout-all

* Returns: { success }

GET /api/settings/security/login-history

* Query: limit, offset
* Returns: LoginHistoryEntry\[]

PUT /api/settings/preferences/notifications/:notificationType

* Body: NotificationPreference updates
* Returns: NotificationPreference

GET /api/settings/preferences

* Returns: UserPreferences (all prefs)

PUT /api/settings/preferences

* Body: Partial<UserPreferences>
* Returns: UserPreferences

PUT /api/settings/preferences/appearance

* Body: { theme, fontSize, colorAccent, etc }
* Returns: AppearanceSettings

GET /api/settings/integrations

* Returns: ConnectedIntegration\[]

DELETE /api/settings/integrations/:integrationId

* Returns: { success }

POST /api/settings/data/export

* Body: { format, include, dateRange }
* Returns: { downloadUrl, expiresAt }

POST /api/settings/account/delete

* Body: { password, confirmation }
* Returns: { deleted, recoveryDeadline }

POST /api/settings/account/recover

* Body: { token }
* Returns: { success }



7.4 STATE MANAGEMENT

Zustand Store for Settings:

```typescript
interface SettingsStore {
  // State
  userSettings: UserSettings
  preferences: UserPreferences
  notificationPreferences: NotificationPreferences\[]
  securitySettings: SecuritySettings
  unsavedChanges: boolean
  
  // Flags
  isLoading: boolean
  isSaving: boolean
  activeSection: string
  
  // Actions
  setUserSettings: (settings: UserSettings) => void
  setPreferences: (prefs: Partial<UserPreferences>) => void
  updateNotificationPreference: (type: string, pref: NotificationPref) => void
  setUnsavedChanges: (hasChanges: boolean) => void
  setActiveSection: (section: string) => void
  saveAllChanges: () => void
  discardChanges: () => void
}
```

Additionally:

* Use React Context for appearance/theme application
* Use localStorage for client-side preferences (fallback)
* Sync server state with localStorage



7.5 PERFORMANCE OPTIMIZATIONS

Data Fetching:
✓ Lazy load settings pages (code split)
✓ Cache settings (30 min stale time)
✓ Paginate login history (50 per page)
✓ Debounce auto-save (1000ms)

Rendering:
✓ Memoize settings cards
✓ Lazy load section components
✓ Virtual scroll for long lists
✓ Avoid full re-renders on theme change

Images:
✓ Compress profile picture on client
✓ Use WebP with fallback
✓ CDN delivery via Supabase

Theme Switching:
✓ Use CSS variables for theme colors
✓ Switch theme without re-mounting
✓ Persist to localStorage + backend
✓ Apply immediately (no page reload)



7.6 SECURITY CONSIDERATIONS

Password Hashing:
✓ Use bcrypt (cost factor 12+)
✓ Never store plain text
✓ Salt passwords

Token Management:
✓ Secure HTTP-only cookies for session tokens
✓ CSRF protection
✓ Token rotation on authentication

Two-Factor Authentication:
✓ Use TOTP (RFC 6238)
✓ 30-second window for validation
✓ Backup codes unique \& non-reusable
✓ Rate limit OTP attempts

Data Protection:
✓ Encrypt sensitive data at rest (AES-256)
✓ HTTPS for all transmissions
✓ RLS on database
✓ Audit logging of sensitive changes

Session Security:
✓ Session timeout after 30 min inactivity
✓ Track device fingerprint
✓ Detect impossible travel
✓ Notify user of new sessions



7.7 TESTING STRATEGY

Unit Tests:

* Password validator (strength, requirements)
* Data format validators (date, number, email)
* Preference calculations \& defaults
* Notification type filtering

Component Tests:

* PasswordChangeForm: Validation, strength meter
* TwoFactorSetup: QR code, OTP verification
* NotificationPreferences: Toggles, frequency selection
* ProfileForm: Edit, validation, upload

Integration Tests:

* Change password → Session logout
* Enable 2FA → Login requires OTP
* Update theme → Apply immediately
* Export data → Generate file

E2E Tests:

* Complete profile edit flow
* 2FA setup \& login with OTP
* Password change workflow
* Data export download



═══════════════════════════════════════════════════════════



8. PHASE TIMELINE \& MILESTONES

═══════════════════════════════════════════════════════════



Phase 3.6 Development Timeline:

Week 1: Setup \& Core Settings

* Create settings pages structure
* Setup database tables
* Build sidebar navigation
* Build basic settings components
* Deliverable: Settings structure ready

Week 2: Profile \& Security

* Implement profile management
* Implement password change
* Implement 2FA setup
* Implement session management
* Deliverable: Core security features working

Week 3: Notifications \& Preferences

* Implement notification preferences UI
* Implement appearance settings
* Implement language/timezone
* Implement financial preferences
* Deliverable: All preference settings functional

Week 4: Privacy \& Advanced Features

* Implement data export
* Implement account deletion
* Implement integration management
* Implement help \& about pages
* Deliverable: Advanced features complete

Week 5: Polish \& Testing

* Mobile responsiveness
* Performance optimization
* Security audit
* Testing \& QA
* Deliverable: Production ready



Milestones:
M1: Settings structure \& navigation (EOW1)
M2: Profile \& security settings (EOW2)
M3: All preferences working (EOW3)
M4: Privacy \& advanced features (EOW4)
M5: QA ready \& optimized (EOW5)



═══════════════════════════════════════════════════════════



9. SUCCESS METRICS \& ACCEPTANCE CRITERIA

═══════════════════════════════════════════════════════════



Performance Metrics:
✓ Settings page load: <2 seconds
✓ Save settings: <500ms
✓ Lighthouse score: 90+
✓ Theme switch: Instant (no flicker)

Functional Metrics:
✓ All 15 user stories implemented
✓ Profile edit working
✓ Password change working
✓ 2FA setup \& verification working
✓ All notification preferences working
✓ Theme/appearance changes working
✓ Data export generating valid files
✓ Account deletion with recovery window
✓ Session management working
✓ Login history tracked

Quality Metrics:
✓ TypeScript: No errors (strict mode)
✓ Type coverage: >90%
✓ Unit test coverage: >80%
✓ No console errors
✓ Accessibility: WCAG AA
✓ Security: No sensitive data exposure

User Experience:
✓ Settings searchable
✓ Sidebar navigation clear
✓ Unsaved changes warning
✓ Confirmation for destructive actions
✓ Help text clear \& accessible
✓ Mobile UI responsive
✓ Error messages helpful



Acceptance Criteria:
✓ Can view \& edit profile
✓ Can change password
✓ Can enable 2FA
✓ Can manage sessions \& login history
✓ Can customize notifications
✓ Can change theme/appearance
✓ Can export personal data
✓ Can delete account (with recovery)
✓ All settings persist
✓ Mobile responsive (all screens)
✓ No TypeScript errors
✓ Security practices followed



═══════════════════════════════════════════════════════════



10. DEPENDENCIES \& ASSUMPTIONS

═══════════════════════════════════════════════════════════



External Dependencies:
✓ Supabase (database, auth, storage)
✓ React Hook Form (form management)
✓ Zod or Yup (validation)
✓ Bcrypt (password hashing)
✓ OTPAuth (2FA TOTP)
✓ QRCode.js (QR code generation)
✓ Shadcn/UI components
✓ Tailwind CSS
✓ Framer Motion (animations)
✓ Lucide React (icons)
✓ Next.js 15 \& TypeScript

Libraries:
✓ email-validator (email validation)
✓ ua-parser-js (device detection)
✓ geoip-lite (IP to location)

Assumptions:
✓ User authentication implemented
✓ Email service configured
✓ Supabase configured with RLS
✓ SMS service available (future for SMS 2FA)
✓ GDPR compliance required
✓ Users have email address

Future Enhancements:
✓ SMS 2FA option
✓ Biometric authentication (fingerprint, face)
✓ WebAuthn/FIDO2 security keys
✓ Account linking (link multiple accounts)
✓ Family accounts \& child accounts
✓ Admin panel \& user management
✓ Data monetization opt-in
✓ Subscription/payment settings



═══════════════════════════════════════════════════════════



11. NOTES FOR IMPLEMENTATION

═══════════════════════════════════════════════════════════



Password Requirements:
✓ Minimum 8 characters
✓ At least 1 uppercase (A-Z)
✓ At least 1 lowercase (a-z)
✓ At least 1 number (0-9)
✓ At least 1 special (!@#$%^\&\*)
✓ Not in common password list (rockyou.txt)
✓ Not used in last 5 passwords

Email Verification:

* Send verification link on email change
* Link valid for 24 hours
* Old email remains active until verified
* Show pending status

Notification Types Default:

* Account alerts: Email + In-app (immediate)
* Transactions: In-app only (immediate)
* Budget alerts: Email + In-app (immediate)
* Goal milestones: Email + In-app (immediate)
* Insights: Email only (weekly digest)
* Reminders: Email + In-app (immediate)
* Summaries: Email only (weekly/monthly)

Session Timeout:

* Inactivity timeout: 30 minutes
* Absolute timeout: 24 hours
* Re-authenticate on timeout
* Warn user before timeout

Data Retention:

* Default: 5 years (1825 days)
* Configurable by user
* After expiration: Archive or delete
* Soft delete (30-day recovery) for account

Naming Conventions (FINUSA):
✓ Components: PascalCase (PasswordChangeForm, TwoFactorSetup)
✓ Files: kebab-case (password-change-form.tsx)
✓ Hooks: camelCase (usePasswordChange)
✓ Types: PascalCase (UserSettings, SecuritySettings)
✓ Constants: UPPER\_SNAKE\_CASE



═══════════════════════════════════════════════════════════



12. GLOSSARY

═══════════════════════════════════════════════════════════



Profile:

* User's personal information (name, email, picture)
* Publicly visible in some contexts (optional)

Password:

* Secure credential for account access
* Should be strong and unique

Two-Factor Authentication (2FA):

* Additional security layer
* Requires second factor (OTP, SMS, etc) to login
* Much more secure than password alone

OTP (One-Time Password):

* 6-digit code generated by authenticator app
* Valid for \~30 seconds
* Changes constantly for security

Authenticator App:

* Mobile app (Google Authenticator, Authy, etc)
* Generates OTP codes
* Works offline

Session:

* Active login instance
* Tracks device, location, activity
* Can be logged out individually

Login History:

* Record of all login attempts
* Shows successful \& failed attempts
* Helps detect unauthorized access

Suspicious Activity:

* Unusual login patterns
* New device or location
* Impossible travel
* Multiple failed attempts

Data Export:

* Download personal data (JSON/CSV/PDF)
* Used for backup or switching services

Account Deletion:

* Permanent removal of account
* 30-day recovery period before hard delete
* Cannot be undone after 30 days

Privacy Settings:

* Control over personal data
* What's collected \& how it's used
* Opt-out options

Preferences:

* User customization settings
* Theme, language, notifications, etc
* Persisted across sessions

GDPR:

* General Data Protection Regulation
* European privacy regulation
* Requires consent, data access, deletion rights



═══════════════════════════════════════════════════════════

