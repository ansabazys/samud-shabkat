# UI/UX Guidelines

> **Project:** Samud Shabkat E-Commerce Ordering Platform
>
> **Document:** 13_UI_UX_GUIDELINES.md
>
> **Version:** 1.0.0

---

# Table of Contents

1. Design Philosophy
2. Design Principles
3. Color System
4. Typography
5. Spacing System
6. Border Radius
7. Shadows
8. Layout System
9. Buttons
10. Forms
11. Cards
12. Tables
13. Dashboard
14. Navigation
15. Icons
16. Feedback Components
17. Empty States
18. Loading States
19. Responsive Design
20. Accessibility

---

# 1. Design Philosophy

The application should feel:

- Modern
- Clean
- Professional
- Fast
- Minimal
- Business Focused

The interface should prioritize usability over visual complexity.

---

# 2. Design Principles

Every screen should follow these principles.

- Consistency
- Simplicity
- Clarity
- Accessibility
- Predictability
- Responsive Design

---

# 3. Color System

## Primary

Used for

- Primary Buttons
- Active Navigation
- Links

---

## Secondary

Used for

- Secondary Buttons
- Supporting Elements

---

## Success

Used for

- Completed Orders
- Success Messages
- Positive Actions

---

## Warning

Used for

- Pending Orders
- Alerts

---

## Danger

Used for

- Delete
- Errors
- Cancel Actions

---

## Neutral

Used for

- Backgrounds
- Borders
- Text

---

# 4. Typography

Font Family

Inter

Fallback

sans-serif

---

## Font Sizes

| Element | Size |
| ------- | ---- |
| Display | 48px |
| H1      | 36px |
| H2      | 30px |
| H3      | 24px |
| H4      | 20px |
| H5      | 18px |
| Body    | 16px |
| Small   | 14px |
| Caption | 12px |

---

## Font Weights

Regular

400

Medium

500

Semi Bold

600

Bold

700

---

# 5. Spacing System

Use an 8px spacing system.

Examples

```
4px

8px

16px

24px

32px

40px

48px

64px
```

Never use random spacing values.

---

# 6. Border Radius

Small

```
6px
```

Medium

```
8px
```

Large

```
12px
```

Cards

```
16px
```

---

# 7. Shadows

Use subtle shadows.

Levels

- Small
- Medium
- Large

Avoid excessive shadow depth.

---

# 8. Layout System

Maximum Content Width

```
1440px
```

Container

Centered

Grid

12 Columns

---

# 9. Buttons

## Primary Button

Used for

- Save
- Create
- Submit
- Checkout

---

## Secondary Button

Used for

- Cancel
- Back

---

## Danger Button

Used for

- Delete
- Remove

---

## Loading State

Buttons should show loading indicators during API requests.

---

# 10. Forms

Every form should include

- Labels
- Placeholder
- Helper Text
- Validation Message

Validation should appear below the input.

Never rely on placeholders as labels.

---

# 11. Cards

Cards should include

- Padding
- Border Radius
- Optional Shadow

Used for

- Products
- Dashboard Widgets
- Statistics
- Customer Information

---

# 12. Tables

Tables should support

- Pagination
- Sorting
- Filtering
- Search
- Responsive Layout

Columns should remain readable.

---

# 13. Dashboard

Dashboard consists of

- Statistic Cards
- Charts
- Recent Orders
- Recent Customers
- Quick Actions

Widgets should load independently.

---

# 14. Navigation

Navigation should include

- Logo
- Search
- User Menu
- Notifications
- Sidebar

Active page should be clearly highlighted.

---

# 15. Icons

Use

Lucide React

Rules

- Consistent size
- Meaningful icons
- Avoid decorative icons

---

# 16. Feedback Components

Use feedback components for

- Success
- Error
- Warning
- Information

Display toast notifications for user actions.

---

# 17. Empty States

Every empty list should provide guidance.

Examples

- No Products Found
- No Orders Yet
- No Customers

Include an action button where appropriate.

---

# 18. Loading States

Prefer skeleton loaders over spinners.

Examples

- Product Grid
- Dashboard Cards
- Tables
- Forms

---

# 19. Responsive Design

Support

Desktop

Tablet

Mobile

Use Tailwind breakpoints.

Layouts should adapt without horizontal scrolling.

---

# 20. Accessibility

Follow WCAG best practices.

Requirements

- Keyboard Navigation
- Focus Indicators
- Sufficient Contrast
- Semantic HTML
- ARIA Labels
- Screen Reader Support

---

# UI Checklist

Every new page should include:

- Consistent spacing
- Correct typography
- Responsive layout
- Accessible controls
- Loading state
- Empty state
- Error state
- Success feedback

---

# Summary

The UI should remain consistent across the storefront, admin dashboard, and future modules.

These guidelines ensure a professional, maintainable, and scalable user experience.

---

# Document Information

| Property      | Value                  |
| ------------- | ---------------------- |
| Document      | 13_UI_UX_GUIDELINES.md |
| Version       | 1.0.0                  |
| Last Updated  | August 2026            |
| Maintained By | Mohammed Ansab K       |
