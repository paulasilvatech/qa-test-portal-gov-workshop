---
name: markdown-writer
description: "Creates professional, well-structured Markdown documents with YAML frontmatter, versioning, author attribution, table of contents, and consistent formatting. USE FOR: create markdown document, write markdown, generate md file, create README, write technical doc, create ADR, architecture decision record, write changelog, create specification, write guide in markdown. DO NOT USE FOR: Word documents (use docx-creator), presentations (use pptx-creator), diagrams (use figjam-diagrams)."
---

# Markdown Writer

Create professional, well-structured Markdown documents following enterprise best practices with proper metadata, versioning, and attribution.

## Frontmatter (MANDATORY)

Every markdown document MUST start with YAML frontmatter:

```yaml
---
title: "Document Title"
description: "One-sentence summary of the document purpose"
author: "{{author_name}}"
date: "YYYY-MM-DD"
version: "1.0.0"
status: "draft | review | approved | archived"
tags: ["tag1", "tag2"]
---
```

### Versioning Rules

Use [Semantic Versioning](https://semver.org/):
- **Major (X.0.0):** Breaking changes, full rewrites, scope changes
- **Minor (1.X.0):** New sections, significant content additions
- **Patch (1.0.X):** Typos, formatting fixes, minor clarifications

### Change Log Table

For documents that evolve over time, include a change log after the frontmatter:

```markdown
## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-03-04 | {{author_name}} | Initial version |
```

## Document Structure

### Standard Structure (all document types)

```markdown
---
[frontmatter]
---

# Document Title

> One-sentence purpose statement.

## Change Log
[version table]

## Table of Contents
[auto or manual TOC]

## 1. Section Title
[content]

### 1.1 Subsection
[content]

## 2. Next Section
[content]

## References
[cited sources with hyperlinks]
```

### Heading Rules

- `# H1` — document title only (exactly one per document)
- `## H2` — major sections (numbered: `## 1. Introduction`)
- `### H3` — subsections (numbered: `### 1.1 Overview`)
- `#### H4` — sub-subsections (use sparingly)
- Never skip heading levels (no H1 → H3)

## Content Guidelines

### Text

- Keep paragraphs under 4 sentences
- Use active voice: "The system processes..." not "The data is processed by..."
- One idea per paragraph
- Use bold for key terms on first introduction: **Model Context Protocol (MCP)**
- Use inline code for technical terms: `docker compose up`, `SKILL.md`

### Lists

- Use bullet lists (`-`) for unordered items (3+ items)
- Use numbered lists (`1.`) for sequential steps
- Keep list items parallel in structure (all start with verbs, or all are nouns)
- Nest at most 2 levels deep

### Tables

- Use tables for structured data with 3+ columns
- Always include a header row
- Align columns consistently (left for text, right for numbers)
- Keep cell content concise (< 50 chars per cell)

```markdown
| Feature | Status | Owner |
|---------|--------|-------|
| Auth module | Done | @jane |
| API gateway | In progress | @john |
```

### Code Blocks

- Always specify the language for syntax highlighting: ` ```typescript `
- Keep code blocks under 30 lines — split larger examples
- Add a brief description before each code block
- Use inline code for short references: `variable`, `function()`

### Links and References

- Use descriptive link text: [MCP SDK documentation](https://url) not [click here](https://url)
- External links: always include the full URL
- Internal links: use relative paths from document root
- All metrics, statistics, or market claims MUST have source hyperlinks
- Add a `## References` section at the end with numbered citations

### Images and Diagrams

- **Prefer inline SVG** for all diagrams in Markdown documents. SVG renders consistently across platforms.
- SVG style: white fill (`#FFFFFF`), black text (`#323130`), Microsoft colors on borders/stroke (`#0078D4`, `#F25022`, `#7FBA00`, `#FFB900`), `stroke-width="2"`, connectors in `#605E5C`.
- Use Mermaid **only** when generating FigJam diagrams via the Figma MCP connector.
- **Every diagram MUST have** a descriptive paragraph above it explaining what it shows, why it matters, and how to read it.
- Use descriptive alt text for image files: `![Architecture diagram showing the 3-tier deployment](./img/architecture.png)`
- **Standalone image output:** When generating inline SVGs, also save as standalone files in `output/images/svg/`. PNG exports go to `output/images/png/`. Mermaid sources go to `output/images/mermaid/`.
- **Image naming:** Follow the same pattern as documents: `NN_Title_vX.Y.Z_YYYY-MM-DD.<ext>`
- **Image archiving:** Move previous versions to `output/images/archive/` before overwriting.

## Document Types

| Type | Key Sections | Example |
|------|-------------|---------|
| **README** | Overview, Quick Start, Setup, Usage, Contributing | Project landing page |
| **ADR** | Status, Context, Decision, Consequences | Architecture Decision Record |
| **Specification** | Overview, Requirements, Design, API, Data Model | Technical spec |
| **Guide** | Prerequisites, Steps, Troubleshooting, FAQ | How-to guide |
| **Changelog** | Version entries with Added/Changed/Removed | Release notes |
| **Runbook** | Symptoms, Diagnosis, Resolution, Prevention | Incident response |
| **RFC** | Problem, Proposal, Alternatives, Decision | Request for comments |

### ADR Template

```markdown
---
title: "ADR-NNN: Decision Title"
author: "{{author_name}}"
date: "YYYY-MM-DD"
version: "1.0.0"
status: "proposed | accepted | deprecated | superseded"
tags: ["adr", "architecture"]
---

# ADR-NNN: Decision Title

## Status
Accepted

## Context
[What is the issue or problem that motivates this decision?]

## Decision
[What is the change proposed or decided?]

## Consequences
[What are the positive and negative results of this decision?]

## References
[Links to related ADRs, specs, or external resources]
```

## Factual Integrity

- NEVER fabricate metrics, KPIs, ROI figures, market data, or statistics
- Only use data from: workspace context, user-provided materials, or credible official sources
- Credible sources: Gartner, Forrester, IDC, McKinsey, Microsoft Learn, GitHub Blog, Anthropic Blog, IEEE, ACM, HBR, official vendor docs
- Every data claim MUST include a hyperlink to its source
- If no credible source exists, state as assumption or omit entirely
- Add a **References** section at the end of every document

## Versioning & Archiving

- Filename pattern: `{Title}_v{version}_{YYYY-MM-DD}.md`
- Save to: `output/md/`
- Before overwriting an existing file, move the previous version to `output/md/archive/`
- YAML frontmatter MUST include `version`, `date`, and `author` fields
- Update the Change Log table with every new version

## Quality Checklist

- [ ] YAML frontmatter present with title, author, date, version, status
- [ ] Exactly one H1 (document title)
- [ ] Heading levels are sequential (no skipping)
- [ ] Table of Contents present (for documents > 3 sections)
- [ ] Change Log present (for versioned documents)
- [ ] All code blocks have language specified
- [ ] All links are descriptive (no "click here")
- [ ] All data claims have source hyperlinks (NEVER fabricate data)
- [ ] References section present with cited sources and full URLs
- [ ] Content is in English
- [ ] No placeholder text (TODO, TBD, [fill in])
- [ ] Diagrams use inline SVG (white fill, black text, Microsoft colors on borders)
- [ ] Every diagram has a descriptive paragraph above it
- [ ] Paragraphs are under 4 sentences
- [ ] Lists are parallel in structure
- [ ] Filename follows `{Title}_v{version}_{date}.md` pattern
- [ ] Saved to `output/md/` with previous version archived
- [ ] Editorial UX: bold key terms, callout blocks, tables, icons where appropriate
