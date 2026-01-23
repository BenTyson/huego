# Skill: Update Phase

> Efficiently update `/docs` markdown files after implementing features.

---

## Purpose

Synchronize documentation with codebase changes. Optimized for agentic comprehension with:
- Consistent structure across files
- Rich interlinking between docs
- Machine-parseable sections (tables, code blocks)
- Change tracking via CHANGELOG

---

## Trigger

Run after completing a sprint, feature set, or significant changes.

---

## Files to Update

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `/docs/HUEGO.md` | Product overview, modes, revenue | Major features |
| `/docs/SESSION-START.md` | Quick dev reference, status, key files | Every sprint |
| `/docs/ARCHITECTURE.md` | Technical deep-dive, APIs, patterns | New systems |
| `/docs/CHANGELOG.md` | Version history, all changes | Every change |

---

## Update Protocol

### 1. Gather Changes

```bash
# Recent commits since last version
git log --oneline --since="last version date"

# Files changed
git diff --stat HEAD~N

# New files
git ls-files --others --exclude-standard
```

### 2. Update Order (Dependencies)

1. **CHANGELOG.md** (first - captures raw changes)
2. **ARCHITECTURE.md** (new technical systems)
3. **SESSION-START.md** (status, key files, data models)
4. **HUEGO.md** (product summary, user-facing)

### 3. Per-File Guidelines

#### CHANGELOG.md
- Add new version section at top
- Categories: Added, Changed, Fixed, Removed, Technical
- Include file counts and paths for new systems
- Link to related docs where relevant

#### ARCHITECTURE.md
- Add new system sections (e.g., "Import System", "Gradient Engine")
- Update component tables
- Add function signatures for new APIs
- Include diagrams for complex flows
- Update Performance Considerations

#### SESSION-START.md
- Update Status section (phase, next actions, live features)
- Update Key Files tree
- Update Data Models with new types
- Keep Commands current

#### HUEGO.md
- Update Implementation Status
- Add/update mode table if modes changed
- Update Revenue section if pricing changed
- Keep Related Docs links valid

---

## Interlinking Pattern

Use relative paths for cross-references:

```markdown
See [Architecture](/docs/ARCHITECTURE.md) for technical details.
See [Changelog](/docs/CHANGELOG.md#070---2026-01-22) for history.
Related: [SESSION-START.md](/docs/SESSION-START.md)
```

---

## Section Templates

### New Feature Section (ARCHITECTURE.md)

```markdown
## Feature Name (`src/lib/feature.ts`)

### Overview
One-line description.

### Key Functions
\`\`\`typescript
functionName(param: Type): ReturnType
\`\`\`

### Usage
How it integrates with other systems.

### Related
- Component: `src/components/FeatureComponent.tsx`
- Store: `src/store/feature.ts`
```

### New Version Section (CHANGELOG.md)

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Feature Name

#### Added
- **New capability** - Description

#### Changed
- Existing behavior changes

#### Fixed
- Bug fixes

#### Technical
- File counts, build notes
```

---

## Validation Checklist

After updating:

- [ ] All internal links resolve (no broken refs)
- [ ] Version numbers consistent across files
- [ ] Status in SESSION-START.md reflects reality
- [ ] Key Files tree matches actual structure
- [ ] Data models match `src/lib/types.ts`
- [ ] No TODO placeholders left in docs
- [ ] Dates are accurate

---

## Quick Reference

### Common Patterns

| Pattern | Example |
|---------|---------|
| File reference | `src/lib/colors.ts` |
| Function reference | `createColor()` |
| Section link | `[Changelog](/docs/CHANGELOG.md)` |
| Anchor link | `[v0.7.0](/docs/CHANGELOG.md#070---2026-01-22)` |
| Code inline | `` `HarmonyType` `` |

### Status Phases

| Phase | Meaning |
|-------|---------|
| Building | Active development |
| Testing | QA in progress |
| Live / Monitoring | Production, stable |
| Maintenance | Bug fixes only |

---

## Example Workflow

```bash
# 1. After completing feature implementation
# 2. Run this skill

# Agent actions:
# - Read recent git history
# - Identify new files/systems
# - Update CHANGELOG with version bump
# - Add technical docs to ARCHITECTURE
# - Update status/files in SESSION-START
# - Summarize in HUEGO if user-facing
# - Verify all links work
```
