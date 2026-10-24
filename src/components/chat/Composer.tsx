import React from 'react';
import { SUGGESTED_CHIPS } from '../../constants/presets';

interface ComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (event?: React.FormEvent) => void;
  loading: boolean;
  onSelectChip: (chip: string) => void;
}

export function Composer({
  input,
  setInput,
  onSubmit,
  loading,
  onSelectChip
}: ComposerProps) {
  return (
    <>
      <div className="quick-suggestions-bar">
        <span className="quick-hint">Popular:</span>
        {SUGGESTED_CHIPS.slice(0, 4).map(chip => (
          <button
            key={chip}
            type="button"
            className="quick-chip"
            onClick={() => onSelectChip(chip)}
            disabled={loading}
          >
            {chip}
          </button>
        ))}
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <div className="composer-container">
          <div className="composer-input-wrapper">
            <span className="input-search-icon">🔍</span>
            <input
              id="product-query"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe product (e.g. cotton t-shirt, laptop, drone) or enter HSN code (e.g. 01011010)..."
              maxLength={300}
              minLength={2}
              disabled={loading}
              autoComplete="off"
            />
            {input && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => setInput('')}
                aria-label="Clear query"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            className="composer-submit-btn"
            disabled={loading || input.trim().length < 2}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                <span>Searching…</span>
              </>
            ) : (
              <>
                <span>Search Tariff</span>
                <span className="submit-arrow" aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>

        <div className="composer-footer">
          <span className="helper-text">
            Grounded search in official GST tariff database • Press <kbd>Enter ↵</kbd> to search
          </span>
          <span className="char-count">{input.length}/300</span>
        </div>
      </form>
    </>
  );
}
