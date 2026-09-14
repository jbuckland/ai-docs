#!/usr/bin/env node
/**
 * format-tables.js
 * 
 * Scans markdown files for tables:
 * - Tables with width > max-width (default 120 chars) are converted to nested bullet lists.
 * - Tables with width <= max-width have their raw markdown columns aligned with monospaced padding.
 * 
 * Usage:
 *   node format-tables.js <path-to-markdown-file> [--max-width 120] [--check]
 */

const fs = require('fs');
const path = require('path');

function splitTableRow(row) {
    let text = row.trim();
    if (text.startsWith('|')) text = text.slice(1);
    if (text.endsWith('|')) text = text.slice(0, -1);
    
    const cells = [];
    let current = '';
    let isEscaped = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '\\' && !isEscaped) {
            isEscaped = true;
            current += char;
        } else if (char === '|' && !isEscaped) {
            cells.push(current.trim());
            current = '';
        } else {
            isEscaped = false;
            current += char;
        }
    }
    cells.push(current.trim());
    return cells;
}

function isSeparatorRow(cells) {
    if (!cells || cells.length === 0) return false;
    return cells.every(c => /^:?-+:?$/.test(c.replace(/\s+/g, '')));
}

function parseTable(lines) {
    if (lines.length < 2) return null;
    const headerCells = splitTableRow(lines[0]);
    const sepCells = splitTableRow(lines[1]);
    if (!isSeparatorRow(sepCells)) return null;

    const dataRows = lines.slice(2).map(splitTableRow);
    return {
        headers: headerCells,
        separators: sepCells,
        rows: dataRows
    };
}

function calculateTableMetrics(table) {
    const colCount = Math.max(
        table.headers.length,
        table.separators.length,
        ...table.rows.map(r => r.length)
    );
    const colWidths = new Array(colCount).fill(3);

    for (let c = 0; c < colCount; c++) {
        if (table.headers[c]) colWidths[c] = Math.max(colWidths[c], table.headers[c].length);
        table.rows.forEach(r => {
            if (r[c]) colWidths[c] = Math.max(colWidths[c], r[c].length);
        });
    }

    // Calculate total formatted table line length:
    // '| ' (2) + sum(colWidths) + ' | ' * (colCount - 1) + ' |' (2)
    const totalWidth = 4 + colWidths.reduce((a, b) => a + b, 0) + 3 * (colCount - 1);
    return { totalWidth, colWidths, colCount };
}

function formatAlignedTable(table, colWidths, colCount) {
    const formatRow = (cells) => {
        const padded = [];
        for (let c = 0; c < colCount; c++) {
            const cell = cells[c] || '';
            padded.push(cell.padEnd(colWidths[c], ' '));
        }
        return `| ${padded.join(' | ')} |`;
    };

    const sepRow = () => {
        const padded = [];
        for (let c = 0; c < colCount; c++) {
            const sep = table.separators[c] || '---';
            const alignLeft = sep.startsWith(':');
            const alignRight = sep.endsWith(':');
            const prefix = alignLeft ? ':' : '';
            const suffix = alignRight ? ':' : '';
            const dashCount = colWidths[c] - (alignLeft ? 1 : 0) - (alignRight ? 1 : 0);
            const dashes = '-'.repeat(Math.max(dashCount, 1));
            padded.push(`${prefix}${dashes}${suffix}`);
        }
        return `| ${padded.join(' | ')} |`;
    };

    const outLines = [];
    outLines.push(formatRow(table.headers));
    outLines.push(sepRow());
    table.rows.forEach(r => outLines.push(formatRow(r)));
    return outLines;
}

function formatNestedBullets(table) {
    const outLines = [];
    const headers = table.headers;

    table.rows.forEach((row, rowIdx) => {
        if (row.length === 0 || row.every(c => !c)) return;

        // Use column 0 value as primary item heading, stripping redundant bolding
        const rawTitle = row[0] || `Item ${rowIdx + 1}`;
        const cleanTitle = rawTitle.replace(/\*\*/g, '').trim();
        outLines.push(`- **${cleanTitle}**`);

        for (let c = 1; c < headers.length; c++) {
            const rawHeader = headers[c] || `Field ${c + 1}`;
            const cleanHeader = rawHeader.replace(/\*\*/g, '').trim();
            const val = row[c] || '';
            if (val) {
                outLines.push(`  - **${cleanHeader}**: ${val}`);
            }
        }
    });

    return outLines;
}

function processMarkdown(content, maxWidth = 120) {
    const lines = content.split(/\r?\n/);
    const resultLines = [];
    let inCodeBlock = false;
    let i = 0;
    let modified = false;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        // Track code blocks
        if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
            inCodeBlock = !inCodeBlock;
            resultLines.push(line);
            i++;
            continue;
        }

        if (inCodeBlock) {
            resultLines.push(line);
            i++;
            continue;
        }

        // Check for table start
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const tableLines = [line];
            let j = i + 1;
            while (j < lines.length) {
                const nextTrimmed = lines[j].trim();
                if (nextTrimmed.startsWith('|') && nextTrimmed.endsWith('|')) {
                    tableLines.push(lines[j]);
                    j++;
                } else {
                    break;
                }
            }

            const parsed = parseTable(tableLines);
            if (parsed) {
                const { totalWidth, colWidths, colCount } = calculateTableMetrics(parsed);
                if (totalWidth > maxWidth) {
                    console.log(`  - Converting wide table (${totalWidth} chars > ${maxWidth}) to nested bullets`);
                    const bulletLines = formatNestedBullets(parsed);
                    resultLines.push(...bulletLines);
                    modified = true;
                } else {
                    console.log(`  - Aligning table columns (${totalWidth} chars <= ${maxWidth})`);
                    const alignedLines = formatAlignedTable(parsed, colWidths, colCount);
                    resultLines.push(...alignedLines);
                    modified = true;
                }
                i = j;
                continue;
            }
        }

        resultLines.push(line);
        i++;
    }

    return { result: resultLines.join('\n'), modified };
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log(`
Usage: node format-tables.js <file-path> [--max-width <number>] [--check]

Options:
  --max-width <number>  Max column width before converting table to nested bullets (default: 120)
  --check               Preview changes without overwriting file
`);
        process.exit(0);
    }

    const filePath = path.resolve(args[0]);
    let maxWidth = 120;
    const maxWidthIdx = args.indexOf('--max-width');
    if (maxWidthIdx !== -1 && args[maxWidthIdx + 1]) {
        maxWidth = parseInt(args[maxWidthIdx + 1], 10);
    }
    const checkOnly = args.includes('--check');

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    console.log(`Formatting tables in: ${filePath} (Max Width: ${maxWidth})`);
    const content = fs.readFileSync(filePath, 'utf8');
    const { result, modified } = processMarkdown(content, maxWidth);

    if (modified && !checkOnly) {
        fs.writeFileSync(filePath, result, 'utf8');
        console.log(`Successfully updated ${filePath}`);
    } else if (checkOnly) {
        console.log(`[Check Mode] Completed dry run for ${filePath}`);
    } else {
        console.log(`No tables required formatting in ${filePath}`);
    }
}

main();
