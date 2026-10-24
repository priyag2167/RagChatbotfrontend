import { useState } from 'react';
import type { HsnResult } from '../../types/chat';
import { GstCalculator } from './GstCalculator';

interface ResultCardProps {
  result: HsnResult;
  isFeatured?: boolean;
  rank?: number;
}

function getRateBadge(igst: number | null) {
  if (igst === null) return { label: 'Unspecified Rate', className: 'rate-badge--neutral' };
  if (igst === 0) return { label: '0% Nil / Exempt', className: 'rate-badge--exempt' };
  if (igst <= 5) return { label: `${igst}% Concessional`, className: 'rate-badge--low' };
  if (igst <= 12) return { label: `${igst}% Standard (Low)`, className: 'rate-badge--mid' };
  if (igst <= 18) return { label: `${igst}% Standard`, className: 'rate-badge--standard' };
  return { label: `${igst}% High / Luxury`, className: 'rate-badge--high' };
}

function formatRate(value: number | null): string {
  return value === null ? '—' : `${value}%`;
}

export function ResultCard({ result, isFeatured = false, rank }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const badge = getRateBadge(result.igst);

  function copyCode() {
    navigator.clipboard.writeText(result.hsnCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className={`result-card ${isFeatured ? 'result-card--featured' : ''}`}>
      <div className="result-card__header">
        <div className="result-card__meta">
          {isFeatured ? (
            <span className="featured-pill">★ Primary Match</span>
          ) : rank ? (
            <span className="rank-pill">Option #{rank}</span>
          ) : null}
          <div className="hsn-pill-group">
            <span className="hsn-label">HSN/SAC</span>
            <code className="hsn-code">{result.hsnCode}</code>
            <button
              type="button"
              className="copy-btn"
              onClick={copyCode}
              title="Copy HSN code to clipboard"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <span className={`rate-badge ${badge.className}`}>{badge.label}</span>
      </div>

      <h3 className="result-card__desc">{result.description}</h3>

      <div className="rate-grid">
        <div className="rate-grid__item">
          <span className="rate-type">IGST (Inter-State)</span>
          <strong className="rate-value">{formatRate(result.igst)}</strong>
        </div>
        <div className="rate-grid__item">
          <span className="rate-type">CGST (Central Tax)</span>
          <strong className="rate-value">{formatRate(result.cgst)}</strong>
        </div>
        <div className="rate-grid__item">
          <span className="rate-type">SGST (State Tax)</span>
          <strong className="rate-value">{formatRate(result.sgst)}</strong>
        </div>
      </div>

      {result.condition && (
        <div className="result-card__condition">
          <span className="condition-icon">ℹ</span>
          <div>
            <strong>Applicability / Condition:</strong>
            <p>{result.condition}</p>
          </div>
        </div>
      )}

      <div className="result-card__footer">
        <span className="source-tag">Source: {result.source}</span>
        <button
          type="button"
          className={`calc-toggle-btn ${showCalculator ? 'active' : ''}`}
          onClick={() => setShowCalculator(prev => !prev)}
        >
          {showCalculator ? 'Hide Calculator' : '🧮 Calculate GST'}
        </button>
      </div>

      {showCalculator && (
        <GstCalculator
          result={result}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </article>
  );
}
