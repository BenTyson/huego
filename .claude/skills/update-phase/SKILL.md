---
name: update-phase
description: Update /docs after completing a development phase. Triggers on "update phase", "update this phase", or "/update-phase". Updates CHANGELOG.md, ARCHITECTURE.md, SESSION-START.md, and HUEGO.md with consistent formatting.
allowed-tools: Bash, Read, Edit, Glob, Grep
---

# Update Phase Documentation

Update `/docs` after completing a development phase. Optimized for agent comprehension.

## Trigger Phrases

This skill should be invoked when user says:
- `/update-phase`
- "update phase"
- "update this phase"
- "update the docs"
- After completing sprints/features

## Execution Steps

### Step 1: Gather Context

1. Read recent git history:
```bash
git log --oneline -20
git diff --stat HEAD~5
```

2. Read the plan file if referenced in conversation (e.g., competitive roadmap)

3. Identify:
   - New files created
   - Files modified
   - New features/systems added
   - Bug fixes
   - Breaking changes

### Step 2: Determine Version

- **Patch (0.0.X)**: Bug fixes, minor tweaks
- **Minor (0.X.0)**: New features, non-breaking changes
- **Major (X.0.0)**: Breaking changes, major releases

### Step 3: Update Files in Order

**Order matters** - later files reference earlier ones:

1. **CHANGELOG.md** - Raw change capture
2. **ARCHITECTURE.md** - Technical systems (if new systems added)
3. **SESSION-START.md** - Developer reference
4. **HUEGO.md** - Product summary

## File-Specific Templates

### CHANGELOG.md Update

Add new version section at TOP (before previous versions):

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Phase/Feature Name

Brief description of what this release accomplishes.

#### Added
- **Feature Name** (`src/path/file.ts`) - Description
- New component/function/system

#### Changed
- Existing behavior modifications
- Configuration changes

#### Fixed
- Bug fixes with context

#### Technical
- File counts, new dependencies
- Build/performance notes
```

### ARCHITECTURE.md Update

Add new system sections following this template (only if new systems/APIs added):

```markdown
## System Name (`src/lib/system.ts`)

### Overview
One-line description of purpose.

### Key Types
```typescript
interface MainType {
  property: Type;
}
```

### Key Functions
```typescript
functionName(param: Type): ReturnType
anotherFunction(param: Type): ReturnType
```

### Integration
How it connects to other systems.

### Related Files
- Component: `src/components/Related.tsx`
- Store: `src/store/related.ts`
```

### SESSION-START.md Update

Update these sections:

1. **Last Updated** - Change date at top
2. **Status** - Current phase, next actions
3. **Key Files** - Add new directories/files to tree (if significant)
4. **Data Models** - New types from `types.ts` (if added)
5. **Feature Gating** - If tier limits changed
6. **Keyboard Shortcuts** - If new shortcuts added

### HUEGO.md Update

Update these sections:

1. **Competitive Roadmap** - Sprint/phase completion status
2. **Key Features** - New user-facing features
3. **Gap Analysis** - Our new advantages vs competitors
4. **The 6 Modes** - If modes changed
5. **Revenue** - If pricing/tiers changed

## Interlinking Rules

Always use relative paths:
```markdown
See [Architecture](/docs/ARCHITECTURE.md) for technical details.
See [Changelog](/docs/CHANGELOG.md#080---2026-01-23) for history.
```

Anchor format for changelog versions:
- Version `0.8.0` → anchor `#080---2026-01-23`
- Spaces become `-`, dots removed from version

## Post-Update Validation

After all updates:

- [ ] Version numbers consistent across files
- [ ] All internal links use correct relative paths
- [ ] SESSION-START.md Key Files tree is accurate
- [ ] Data models match `src/lib/types.ts`
- [ ] No placeholder text remaining
- [ ] Dates are accurate (today's date for new changes)
- [ ] Project Milestones table updated in CHANGELOG.md

## Quick Reference

| Doc | Primary Purpose | Update When |
|-----|-----------------|-------------|
| CHANGELOG | Version history, all changes | Every phase |
| ARCHITECTURE | Technical deep-dive, APIs | New systems/APIs only |
| SESSION-START | Quick dev reference | Every phase |
| HUEGO | Product overview | Major features |

## Example Output

After updating, provide summary:

```
## Docs Updated

### CHANGELOG.md
- Added version 0.8.0 section with Phase 1 features
- Updated Project Milestones table

### ARCHITECTURE.md
- Added Color Psychology system section
- Added Theme System section

### SESSION-START.md
- Updated Last Updated date
- Updated Status to reflect Phase 1 complete
- Added new files to Key Files tree

### HUEGO.md
- Updated Competitive Roadmap with Phase 1
- Added new features to Key Features
- Updated Gap Analysis table
```
