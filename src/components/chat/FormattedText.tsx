import React from 'react';

interface FormattedTextProps {
  content: string;
}

export function FormattedText({ content }: FormattedTextProps) {
  const rawLines = content.split('\n');

  function formatInline(text: string): React.ReactNode[] {
    // Split by citations [S1] or 【S1】, bold **text**, italic *text* or _text_, and code `code`
    const parts = text.split(/(\[S\d+\]|【S\d+】|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g);

    return parts.map((part, index) => {
      if (/^(\[S\d+\]|【S\d+】)$/.test(part)) {
        const cleanTag = part.replace(/[【】]/g, (m) => (m === '【' ? '[' : ']'));
        return (
          <span key={index} className="citation-badge" title="Tariff source reference">
            {cleanTag}
          </span>
        );
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) && part.length > 2) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  }

  const elements: React.ReactNode[] = [];
  let inBulletList = false;
  let bulletItems: React.ReactNode[] = [];
  let inNumberedList = false;
  let numberedItems: React.ReactNode[] = [];

  function flushLists() {
    if (inBulletList && bulletItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="chat-markdown__list">
          {bulletItems}
        </ul>
      );
      bulletItems = [];
      inBulletList = false;
    }
    if (inNumberedList && numberedItems.length > 0) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="chat-markdown__ol">
          {numberedItems}
        </ol>
      );
      numberedItems = [];
      inNumberedList = false;
    }
  }

  // Helper to check if a line is a markdown table row
  function isTableRow(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && (trimmed.endsWith('|') || trimmed.includes('|'));
  }

  function isTableDelimiter(line: string): boolean {
    const trimmed = line.trim();
    return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed);
  }

  function parseCells(row: string): string[] {
    let s = row.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    return s.split('|').map((c) => c.trim());
  }

  let i = 0;
  while (i < rawLines.length) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushLists();
      i++;
      continue;
    }

    // Check if beginning of a markdown table
    if (isTableRow(trimmed)) {
      flushLists();
      const tableLines: string[] = [];

      // Collect all consecutive table rows (allowing blank lines between them if subsequent line is still a table row)
      while (i < rawLines.length) {
        const cur = rawLines[i].trim();
        if (isTableRow(cur)) {
          tableLines.push(cur);
          i++;
        } else if (!cur && i + 1 < rawLines.length && isTableRow(rawLines[i + 1].trim())) {
          // Empty line in between table rows, skip empty line
          i++;
        } else {
          break;
        }
      }

      // Filter out delimiter row and extract cells
      const nonDelimiterRows = tableLines.filter(row => !isTableDelimiter(row));
      if (nonDelimiterRows.length > 0) {
        const headerCells = parseCells(nonDelimiterRows[0]);
        const bodyRows = nonDelimiterRows.slice(1).map(parseCells);

        elements.push(
          <div key={`table-${elements.length}`} className="table-responsive-wrapper">
            <table className="chat-markdown__table">
              <thead>
                <tr>
                  {headerCells.map((h, hIdx) => (
                    <th key={hIdx}>{formatInline(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx}>{formatInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushLists();
      elements.push(<hr key={`hr-${i}`} className="chat-markdown__hr" />);
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
      flushLists();
      const headingText = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h2 key={`h2-${i}`} className="chat-markdown__h2">
          {formatInline(headingText)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushLists();
      elements.push(
        <h3 key={`h3-${i}`} className="chat-markdown__h3">
          {formatInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      flushLists();
      elements.push(
        <h4 key={`h4-${i}`} className="chat-markdown__h4">
          {formatInline(trimmed.slice(5))}
        </h4>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushLists();
      elements.push(
        <blockquote key={`quote-${i}`} className="chat-markdown__quote">
          {formatInline(trimmed.slice(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Numbered list: "1. " or "1) "
    const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
    if (numberedMatch) {
      if (inBulletList) flushLists();
      inNumberedList = true;
      numberedItems.push(
        <li key={`num-${i}`}>{formatInline(numberedMatch[2])}</li>
      );
      i++;
      continue;
    }

    // Bullet list: "- " or "* "
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (inNumberedList) flushLists();
      inBulletList = true;
      bulletItems.push(
        <li key={`li-${i}`}>{formatInline(trimmed.slice(2))}</li>
      );
      i++;
      continue;
    }

    // Regular paragraph
    flushLists();
    elements.push(
      <p key={`p-${i}`} className="chat-markdown__p">
        {formatInline(trimmed)}
      </p>
    );
    i++;
  }

  flushLists();

  return <div className="chat-markdown">{elements}</div>;
}
