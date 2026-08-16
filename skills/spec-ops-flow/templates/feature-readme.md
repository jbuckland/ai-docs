# [Feature Name]

Jira epic: <link, if any>

## Docs

| File | Contents |
| ---- | -------- |
| [<feature plan title>](./feature-<slug>.md) | High-level feature plan (WHAT) |
| [implementation/](./implementation/) | Implementation planning (HOW): work breakdown, contracts, runbooks |
| [research/](./research/) | Factual research notes that resolve `{! }` annotations |
| [decisions.md](./decisions.md) | Decisions, pivots, and defers |
| [archive/](./archive/) | Shelved docs (pivot/abandon); see `notes` for why |

## Implement next

1. Open the relevant group index (`implementation/N-00-*.md`, or `implementation/<group>/N-00-*.md` if that group uses a subfolder).
2. Find the first runbook whose `status` is not `done`.
3. Open only that runbook.
4. On completion, update its `status` and the group index's generated status column.
