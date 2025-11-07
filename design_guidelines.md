# IGR Payment Portal - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design) with Remita Payment Interface Patterns

**Justification:** Government payment portal prioritizing data clarity, transaction security, and user efficiency across citizen and administrative roles. Material Design provides robust patterns for complex forms and data displays, while Remita's payment flow ensures familiar transaction experience for Nigerian users.

**Key Principles:**
1. Institutional trust through clarity and consistency
2. Efficient task completion over visual flourish
3. Data transparency and traceability
4. Role-appropriate information density

---

## Typography

**Font Families:** 
- Primary: Inter (body text, forms, tables)
- Display: Manrope (headings, dashboard metrics)

**Hierarchy:**
- Page Titles: text-3xl font-bold (Manrope)
- Section Headers: text-xl font-semibold (Manrope)
- Card Titles: text-lg font-medium (Inter)
- Body Text: text-base (Inter)
- Labels/Captions: text-sm font-medium (Inter)
- Table Data: text-sm (Inter)
- Dashboard Metrics: text-4xl font-bold (Manrope)

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, and 12
- Component padding: p-6
- Section spacing: space-y-8
- Card margins: gap-6
- Form field gaps: space-y-4
- Dashboard grid gaps: gap-8

**Grid Structure:**
- Admin Dashboard: 3-column grid (lg:grid-cols-3) for metric cards
- Transaction Tables: Full-width with responsive scroll
- Payment Forms: Single column max-w-2xl centered
- Revenue Analytics: 2-column layout (lg:grid-cols-2) for charts

---

## Component Library

### Navigation
**Admin Sidebar:**
- Fixed left sidebar (w-64)
- Logo and LGA name at top (p-6)
- Vertical navigation list with icons
- Active state indicator (border-l-4)
- User profile at bottom with role badge

**Citizen Top Navigation:**
- Horizontal bar with logo left, user menu right
- Quick payment button prominent in center
- Breadcrumb navigation below header

### Dashboard Components
**Metric Cards:**
- h-32 with large numeric value centered
- Trend indicator (up/down arrow) with percentage
- Label beneath metric
- Subtle border treatment

**Revenue Charts:**
- Bar charts for departmental comparison
- Line graphs for time-series trends
- Pie charts for revenue source distribution
- Chart legends positioned right

**Transaction Tables:**
- Striped rows for readability
- Fixed header row
- Status badges (Completed, Pending, Failed)
- Action column right-aligned
- Pagination at bottom

### Forms & Inputs
**Invoice Generation Forms:**
- Two-column layout on desktop (grid-cols-2 gap-6)
- Single column on mobile
- Required field indicators (asterisk)
- Dropdown selects for revenue types
- Date pickers for payment deadlines
- Auto-calculated amount displays

**Taxpayer Registration:**
- Multi-step form with progress indicator at top
- Step titles numbered (1/4, 2/4, etc.)
- Navigation buttons: Back (secondary), Continue (primary)
- Form validation inline with error messages

### Remita Payment Interface
**Payment Flow:**
- Step 1: Invoice summary card with itemized breakdown
- Step 2: Remita-style payment method selector (cards in grid)
- Step 3: Card payment form with CVV, expiry fields
- Step 4: Processing screen with spinner and "Please wait" message
- Step 5: Success screen with RRR number, download receipt button

**Payment Method Cards:**
- Grid of 2x2 payment options
- Card/Bank Transfer/USSD/Mobile Money
- Icon + label centered in each card
- Selected state with border treatment
- Disabled states for unavailable methods

### Data Display
**Receipt/Invoice Cards:**
- White card with header containing LGA seal
- Reference number prominent at top
- Itemized table of charges
- Total amount emphasized (text-2xl font-bold)
- Download PDF and Print buttons

**Verification Screen:**
- Large search input for RRR/Receipt number
- Verify button adjacent
- Result card expanding below with transaction details
- Success/failure status with appropriate messaging

### Notifications
**Email/SMS Preview Modals:**
- Modal overlay (max-w-lg)
- Preview of notification content
- Sample recipient information
- Mock timestamp and delivery status

---

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Single column, stacked navigation
- Tablet (md): 2-column grids, collapsible sidebar
- Desktop (lg): Full multi-column layouts, persistent sidebar

**Mobile Optimizations:**
- Bottom navigation bar for citizens
- Swipeable transaction cards
- Condensed table views (hide non-critical columns)
- Touch-friendly button sizes (min-h-12)

---

## Images

**Logo Placement:**
- Header: LGA seal/logo (h-12) in top-left navigation
- Receipts: Smaller seal (h-8) in document header
- Login screen: Centered seal above form (h-24)

**Dashboard Illustrations:**
- Empty state illustrations for tables with no data
- Success confirmation illustrations on payment completion
- Simple line-art style, centered in empty containers

**No hero image** - This is a utility application focused on forms and data tables.

---

## Accessibility & Usability

- Form inputs with visible labels and focus states
- Status colors paired with icons (not color alone)
- Keyboard navigation for all interactive elements
- High contrast text on form fields
- Loading states for all async operations
- Error messages displayed inline with specific field context