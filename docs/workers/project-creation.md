# Worker 1: Project Creation Flow Redesign

## Task Overview
Simplify and improve the project creation wizard to be more minimal, clearer, and impactful while maintaining the modern/sleek aesthetic.

## Current State Analysis

### Existing Flow (4 Steps)
1. **Project Details**: Name, visibility, description (optional), README toggle
2. **Integrations**: Auth, Database, Payments, Email, Analytics  
3. **Tech Stack**: Framework, TypeScript, Docker, Testing
4. **Review**: Summary with timeline and commands

### Issues to Address
- Too many options presented upfront
- Unnecessary text and explanations
- Some toggles for things that should be defaults
- Review page is too verbose
- No ability to edit selections from review

## Proposed Changes

### Step 1: Project Details (Minimal Changes)
**Current Fields:**
- Project name ✓
- Repository visibility (Public/Private) ✓  
- Description (optional, collapsed) ✓
- Initialize with README ✓

**Changes:**
- Keep as-is but ensure description is optional and clearly marked
- Improve visual hierarchy of project name input
- Keep the clean toggle for public/private

### Step 2: Features (Major Redesign)
**New Design:**
- **Authentication Section**
  - Main toggle: "Add Authentication" 
  - When enabled, show provider toggles with icons:
    - 🐙 GitHub
    - 🔵 Google  
    - ✉️ Email/Password
  - All can be selected/deselected independently

- **Database Section**
  - Single toggle: "Add Database"
  - When enabled, auto-selects Supabase (for now)

- **Payments Section**  
  - Single toggle: "Add Payments"
  - When enabled, auto-selects Stripe (for now)

**Remove from this step:**
- Email providers (move to post-creation)
- Analytics (move to post-creation)
- Explanatory text at bottom

### Step 3: Tech Stack (Simplify)
**Make these defaults (remove toggles):**
- TypeScript: Always enabled
- Docker: Always included
- Testing: Jest included by default

**Keep minimal:**
- Show what's included but as read-only badges
- No toggles needed here
- Could potentially remove this step entirely

### Step 4: Review (Streamline)
**New Design:**
- Clean summary of selections
- Each section has an "Edit" button to go back
- Single "Create Project" button
- Remove:
  - Timeline estimate
  - Post-creation commands
  - Verbose explanations

## Implementation Plan

### UI Components Needed
1. **Toggle with Icons**: For auth provider selection
2. **Edit Buttons**: On review page sections
3. **Cleaner Cards**: Less padding, more focused

### Icon Requirements
- GitHub OAuth: Use existing GitHub logo
- Google OAuth: Use existing Google logo  
- Email Auth: Simple envelope icon
- Database: Database icon
- Payments: Credit card icon

### State Management
- Keep localStorage persistence
- Add ability to jump back to specific steps from review
- Maintain current validation logic

## Visual Design Notes

### Step 2 Features - Auth Toggle Example
```
[ ] Add Authentication
    When checked, show:
    ┌─────────────────────────────────┐
    │ Choose sign-in methods:         │
    │                                 │
    │ [✓] 🐙 GitHub                   │
    │ [✓] 🔵 Google                   │
    │ [ ] ✉️ Email/Password           │
    └─────────────────────────────────┘
```

### Review Page Section Example
```
┌─────────────────────────────────┐
│ Authentication           [Edit] │
│ • GitHub OAuth                  │
│ • Google OAuth                  │
└─────────────────────────────────┘
```

## Files to Update

1. `/app/newproject/components/IntegrationsStep.tsx` - Major redesign
2. `/app/newproject/components/ReviewStep.tsx` - Simplify and add edit
3. `/app/newproject/components/TechStackStep.tsx` - Simplify or remove
4. `/app/newproject/page.tsx` - Update step logic if needed

## Success Criteria
- [ ] Cleaner, more minimal UI
- [ ] Fewer decisions for users
- [ ] Clear visual feedback with icons
- [ ] Ability to edit from review
- [ ] Maintains modern glassmorphism aesthetic
- [ ] Mobile responsive

## Notes
- Keep the glass-card effects and gradient borders
- Maintain dark theme consistency
- Ensure smooth transitions between steps
- Test on mobile devices