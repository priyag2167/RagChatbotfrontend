import { SUGGESTED_CHIPS } from '../../constants/presets';

interface HeroBannerProps {
  onSelectQuery: (query: string) => void;
  loading: boolean;
}

export function HeroBanner({ onSelectQuery, loading }: HeroBannerProps) {
  return (
    <div className="hero-banner">
      <div className="hero-badge">✦ RAGChatbot Tariff Intelligence</div>
      <h2 className="hero-title">Find HSN Codes & GST Rates Instantly</h2>
      <p className="hero-subtitle">
        Search over 21,920+ official tariff entries. Discover applicable CGST, SGST, IGST rates, conditions, and calculate invoice tax liabilities.
      </p>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-card__icon">🎯</div>
          <h4>Precision Match</h4>
          <p>Hybrid lexical & semantic search across headings and subheadings.</p>
        </div>
        <div className="feature-card">
          <div className="feature-card__icon">📊</div>
          <h4>Full Rate Matrix</h4>
          <p>Breakdown for Intra-State (CGST + SGST) and Inter-State (IGST).</p>
        </div>
        <div className="feature-card">
          <div className="feature-card__icon">🧮</div>
          <h4>Live Invoice Calculator</h4>
          <p>Estimate tax on your invoice amount with one click.</p>
        </div>
      </div>

      <div className="popular-searches">
        <span className="popular-label">Try searching:</span>
        <div className="popular-chips">
          {SUGGESTED_CHIPS.map(chip => (
            <button
              key={chip}
              type="button"
              className="popular-chip"
              onClick={() => onSelectQuery(chip)}
              disabled={loading}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
