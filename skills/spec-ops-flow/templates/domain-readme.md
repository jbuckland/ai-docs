# [Domain Name]

Jira epic: <link, if any>

## Overview

One paragraph: what this domain covers in production today. Link to the authoritative spec for detail.

## Docs

| File | Contents |
| ---- | -------- |
| [spec.md](./spec.md) | Authoritative current system description (WHAT) |
| [plans/](./plans/) | Active change initiatives (CHANGE + HOW) |
| [decisions.md](./decisions.md) | Domain-wide architectural rules and policies (WHY) |
| [research/](./research/) | Factual research notes |
| [archive/](./archive/) | Graduated or shelved initiatives |

## Active plans

| Plan | Status | Notes |
| ---- | ------ | ----- |
| [plan-<slug>](./plans/<initiative>/plan-<slug>.md) | in-progress | … |

## Implement next

1. Open the relevant active plan under `plans/<initiative>/`.
2. Open that plan's group index (`N-00-*.md`, or `<group>/N-00-*.md` if that group uses a subfolder).
3. Find the first runbook whose `status` is not `done`.
4. Open only that runbook.
5. On completion, update its `status` and the group index's generated status column.

## Archived initiatives

| Initiative | Graduated | Notes |
| ---------- | --------- | ----- |
| [<name>](./archive/<initiative>/) | YYYY-MM-DD | … |
