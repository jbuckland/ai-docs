---
name: format-md-tables
description: Format markdown tables in documents by enforcing raw column alignment for tables <= 120 chars and converting wide tables (> 120 chars) to clean nested bullet lists. Use when asked to format, align, or clean up markdown tables in a file, or when generating/editing markdown content with tables.
---

# Format Markdown Tables

A skill to enforce consistent, readable markdown table presentation across documentation, implementation plans, and reports.

## Core Rules

1. **Width Threshold (120 Characters)**:
   - Calculate the formatted width of each table (sum of padded column widths plus borders and spacing).
   - If a table would exceed **120 characters** in width, do **NOT** render it as a wide, horizontal table. Convert it to **nested bullet format**.
   - If a table is **<= 120 characters**, format the table so that every column delimiter (`|`) in the raw text is vertically aligned using monospaced space padding.

2. **Nested Bullet Format for Wide Tables (> 120 chars)**:
   When converting a wide table to nested bullets:
   - Use the first column (e.g., entity name, title, or key) as the top-level bullet with bold text.
   - Indent remaining column values as child bullets with bold field labels.

   **Example:**
   ```markdown
   - **User Service**
     - **Path**: `src/services/user.service.ts`
     - **Responsibility**: Manages user lifecycle, authentication orchestration, and profile queries.
     - **Status**: Production Ready
   ```

3. **Aligned Monospaced Table Format (<= 120 chars)**:
   All raw markdown tables MUST have columns aligned in raw text with monospaced padding:
   ```markdown
   | Status | Count | Notes       |
   | :----- | :---- | :---------- |
   | Active | 142   | Verified    |
   | Paused | 12    | Pending rev |
   ```

---

## Automated Execution via Helper Script

This skill includes a Node.js utility script located at:
```
./format-md-tables/scripts/format-tables.js
```

### Command Usage

Run the formatter on any target markdown file:

```powershell
node ./skills/format-md-tables/scripts/format-tables.js <path-to-file>
```

### Options

- `--max-width <number>`: Customize the width threshold (default: `120`).
- `--check`: Preview which tables will be converted or aligned without modifying the file.

```powershell
# Preview changes without modifying
node ./skills/format-md-tables/scripts/format-tables.js .\docs\architecture.md --check

# Custom threshold
node ./skills/format-md-tables/scripts/format-tables.js .\docs\architecture.md --max-width 100
```

---

## Manual Execution Workflow (When Not Using the Script)

1. **Scan**: Locate all markdown tables in the document (delimited by `|` lines, ignoring lines inside code fences).
2. **Measure**: Determine the max string length in each column across the header and all rows. Calculate total line width:
   `totalWidth = 4 + sum(colWidths) + 3 * (colCount - 1)`.
3. **Decide**:
   - If `totalWidth > 120`: Convert each row into a top-level bullet using Column 0, with subsequent columns as nested sub-bullets `  - **Header**: Value`.
   - If `totalWidth <= 120`: Pad each cell with trailing spaces so that each column has uniform width across all rows, including the separator row.
4. **Verify**: View the file in a raw text viewer to confirm that all column markers (`|`) form straight vertical lines.
