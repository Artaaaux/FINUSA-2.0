---
name: "FINUSA (Finance Nusantara)"
description: "A warm, friendly, and accessible personal finance management platform."
colors:
  primary: "#4B7BFF"
  secondary: "#2A9D8F"
  tertiary: "#E8A76F"
  success: "#10B981"
  accent-purple: "#A855F7"
  destructive: "#D64D4D"
  neutral-bg: "#0F1419"
  neutral-section: "#1a1f2e"
  neutral-card: "#1f2534"
  neutral-muted-text: "#4B5563"
  neutral-subtle-text: "#374151"
typography:
  display:
    fontFamily: "'Nunito', sans-serif"
    fontWeight: 800
  headline:
    fontFamily: "'Nunito', sans-serif"
    fontWeight: 700
  body:
    fontFamily: "'Nunito', sans-serif"
    fontWeight: 400
  label:
    fontFamily: "'Share Tech Mono', monospace"
    fontWeight: 400
rounded:
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.5rem"
  full: "9999px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  card-base:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
---

# Design System: FINUSA

## Overview

**Creative North Star: "The Warm Financial Companion"**

FINUSA's design balances approachability with clarity to act as an inviting, intelligent, and distinctly human financial companion. The aesthetic is vibrant and energetic, utilizing bright, optimistic accents against dark, sophisticated backgrounds to inspire action and reduce financial anxiety. The interface feels highly layered and tactile, employing deep shadows to simulate physical cards stacked on top of each other, providing a strong sense of spatial structure and touchable affordances.

**Key Characteristics:**
- **Warm & Vibrant:** Muted but colorful accents (blue, teal, amber) against a rich dark backdrop.
- **Tactile & Layered:** Deep shadow strategies give components physical presence and hierarchy.
- **Friendly & Professional:** Rounded geometries and accessible typography (`Nunito`) ensure approachability without losing trust.
- **Iconography:** Professional `Lucide` icons placed within distinct color-coded containers.

## Colors

Vibrant, energetic accents that pop against a deep, warm dark canvas to guide focus and inspire financial action.

### Primary
- **Muted Blue** (#4B7BFF): The core interactive color. Used for primary actions, active states, key data visualizations, and primary hover states.

### Secondary
- **Muted Teal** (#2A9D8F): The supportive accent. Used for secondary actions, success metrics, and creating layered gradient effects when paired with Primary.

### Tertiary
- **Warm Amber** (#E8A76F): The highlight accent. Used for drawing attention to specific insights, warnings, or distinct categories like learning/courses.

### Neutral
- **Deep Base** (#0F1419): The foundational background color. A warm, sophisticated dark tone rather than cold black.
- **Section Base** (#1a1f2e): Used to differentiate broader content areas or sidebars from the main background.
- **Card Base** (#1f2534): Used for elevated container surfaces to lift content above the background.
- **Muted Text** (#4B5563): Low-emphasis text for footer links, version labels, and legal copy.
- **Subtle Text** (#374151): Lowest-emphasis text for version numbers and decorative labels.

### Named Rules
**The Warm Base Rule.** Backgrounds must always retain a warm undertone (#0F1419, #1a1f2e). True black or cold/cyan-tinted darks (like pure #000 or deep blue-black) are prohibited, as they create a sterile or cyberpunk aesthetic.

## Typography

**Display Font:** Nunito (with sans-serif)
**Body Font:** Nunito (with sans-serif)
**Label/Mono Font:** Share Tech Mono (with monospace)

**Character:** Approachable, rounded, and highly legible, reinforcing the "friendly companion" vibe while remaining clear for dense financial data. The monospace font brings a slight mechanical precision to specific card visuals.

### Hierarchy
- **Display** (800, clamp(2rem, 5vw, 3rem)): Hero greetings and massive focal numbers.
- **Headline** (700, 1.25rem - 1.5rem): Section titles and primary card headers.
- **Body** (400, 0.875rem - 1rem): Standard descriptions, lists, and general interface copy.
- **Label** (400, 0.75rem, tracking-widest): Used for uppercase section taxonomy, micro-copy, and credit-card style numbers.

### Named Rules
**The Legibility Rule.** Financial figures must be instantly readable. Always use tabular numbers (`tabular-nums`) for currency, percentages, and data tables to ensure perfect vertical alignment.

## Layout

FINUSA uses a responsive grid system with a maximum width container (`max-w-7xl`). The spatial model relies on generous padding (`sm:p-6 lg:p-10`) to let dense financial information breathe. 

## Elevation & Depth

Highly layered and tactile. The system uses deep shadows to create physical cards stacked on top of each other, providing clear separation between the background and interactive elements.

### Shadow Vocabulary
- **Card Shadow** (`box-shadow: 0 8px 24px rgba(0,0,0,0.15)`): The default elevation for distinct widgets and content cards.
- **Hover/Interactive Shadow** (`box-shadow: 0 12px 32px rgba(0,0,0,0.2)`): Amplified depth on hover to simulate the card lifting toward the user.
- **Accent Glow** (`box-shadow: 0 0 20px rgba(75,123,255,0.15)`): Used sparingly behind primary avatars, active icons, or progress bars to add a vibrant, energetic aura.

## Shapes

The form language is distinctly rounded and friendly to counteract the rigidity of financial data.
- **Cards & Containers:** Soft corners (typically `1rem` or `1.5rem` radius).
- **Icons & Badges:** Frequently encased in heavily rounded (`0.75rem` or full-pill) background containers for visual weight.
- **Borders:** Subtle, semi-transparent borders (e.g., `rgba(75,123,255,0.12)`) edge the shapes to define boundaries against the dark canvas without feeling heavy.

## Components

### Quick Access Buttons
- **Shape:** Soft square (`0.75rem` radius).
- **Background:** Semi-transparent gradient matching the specific icon's accent color (e.g., blue, teal, green, amber).
- **Hover:** Deep shadow increases, slight upward translation, and the border opacity increases for a tactile press-and-lift feel.

### Financial Summary Cards (Credit Card Style)
- **Shape:** Rectangular with `1rem` radius.
- **Background:** Rich gradients utilizing the primary/secondary palettes (e.g., teal to deep emerald, coral to deep red).
- **Typography:** Uses `Share Tech Mono` for account numbers to mimic physical ATM cards.

### Progress Bars
- **Shape:** Full pill radius (`9999px`).
- **Background:** Dark track with a vibrant gradient fill that matches its parent category color, emitting a subtle color-matched glow.

## Do's and Don'ts

### Do:
- **Do** use Lucide icons consistently. Place them inside colored, rounded-square containers when acting as primary category markers.
- **Do** employ layered shadows on cards to maintain the tactile, physical metaphor.
- **Do** use warm, energetic accent colors to guide the eye toward action (e.g., Muted Blue for general actions, Teal/Green for success).

### Don't:
- **Don't** use emojis as primary iconography; maintain a professional, icon-driven interface.
- **Don't** use pure black or cold-blue neon colors that drift the aesthetic toward "cyberpunk."
- **Don't** flatten the interface completely. Shadows and borders are required to give surfaces physical presence.
