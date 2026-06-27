---
name: generate-knowledge-base-doc
description: Create, migrate, or reorganize durable Cityworks developer knowledge-base docs. Use when the user asks for KB docs, knowledge base migration, reusable developer notes, global planning-docs KB content, or cleaning source notes into structured documentation.
---

# Generate Knowledge Base Doc

## Purpose

Create durable, reusable knowledge-base docs for Cityworks development. These docs should explain concepts, patterns, workflows, architecture, or troubleshooting in a way that remains useful across projects.

## Default Destination

Use the planning docs repo when available:

`\john-buckland---planning-docs\knowledge-base`

If the user gives a different destination, use that destination.

## What Belongs In The KB

Include docs that explain:

- Cityworks development setup, workflows, and troubleshooting
- CoreApp, Respond, AppBase, Atlas, Insights, Admin, MQA, LoS, or related platform behavior
- Backend service, repository, data, security, async processing, and query patterns
- Frontend integration, routing, plugin communication, UI patterns, and app boundaries
- Infrastructure and operations knowledge such as Docker, Kubernetes, and remote debugging
- Product or feature behavior that is likely reusable outside a one-off task

Exclude:

- AI agent instruction files, Cursor rules, Cursor skills, or files with YAML front matter
- Meeting notes, transcripts, status reports, and one-off planning artifacts
- Personal notes unless the useful technical content is extracted into a clean KB doc
- Generated logs, evidence dumps, raw code examples, screenshots, or standalone CSS/LESS files
- Project-specific docs that do not generalize, unless placed under a clearly scoped feature folder

## Folder Boundaries

Prefer clear app or feature folders when several docs share a boundary:

- `mqa/` for Maintenance Quality Assurance docs
- `level-of-service/` for LoS-specific docs
- `remote-debugging/` for remote debugging guides
- `security/` for permissions, relates, and security models
- `coreapp/` for CoreApp-specific routing, hosting, and plugin docs
- `backend-patterns/` for reusable service, repository, data, and query patterns
- `infrastructure/` for Docker, Kubernetes, and environment docs

Keep a doc at the root only when it is broadly applicable or there are too few docs to justify a folder.

## File Naming

Use lowercase kebab-case filenames:

- Good: `mqa-score-generation.md`
- Good: `cityworks-employee-permission-system.md`
- Good: `remote-debugging-coreapp.md`
- Avoid: `KNOWLEDGE-BASE.md`, `Backend-Code-Findings.md`, `notes.md`, `README-copy.md`

When moving into a global KB, rename vague source files so the file still makes sense without its old folder context.

## Doc Format

Generated KB docs must not include YAML front matter.

Use this general shape:

```markdown
# Clear Doc Title

One or two sentences explaining what this doc covers and when to use it.

## Quick Answer

- Direct summary of the key point.
- Include the most important decision, behavior, or pattern.

## Context

Explain the app, feature, repo, service, or workflow boundary.

## Details

Use focused sections with examples, tables, or code snippets when helpful.

## Related Docs

- [Related Doc](related-doc.md)
```

Adapt the headings to the topic. Do not force every section if it adds noise.

## Migration Workflow

When migrating existing notes:

1. Inventory candidates and exclude non-KB artifacts.
2. Read enough of each candidate to classify it correctly.
3. Confirm the destination path and filename before copying.
4. Copy or rewrite the useful content into the KB.
5. If the source is an agent/rule/skill file, do not copy it directly. Extract only durable technical guidance into a normal KB doc.
6. Update the nearest `README.md` index and any parent index.
7. Verify README links resolve.
8. Only delete source files after the user explicitly asks, and only after verifying the destination copy exists.

## Index Rules

Every folder with multiple KB docs should have a `README.md`.

README files should:

- Start with a one-sentence scope statement
- Group docs by concept, workflow, feature area, or app boundary
- Link to relative paths only
- Include related-doc links when a subfolder depends on global docs
- Avoid giant tables unless the user asks for one

## Validation Checklist

Before finishing:

- [ ] No generated KB doc has YAML front matter
- [ ] No copied agent instruction, Cursor rule, or skill file was included as-is
- [ ] Filenames are clear outside their original source folder
- [ ] App or feature boundaries use subfolders when appropriate
- [ ] README links resolve
- [ ] Source files were not deleted unless the user explicitly requested deletion
- [ ] Unrelated working-tree changes were left untouched
