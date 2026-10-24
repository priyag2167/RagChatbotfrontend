import { CATEGORY_PRESETS } from '../../constants/presets';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onResetChat: () => void;
  onSelectQuery: (query: string) => void;
  searchHistory: string[];
  onClearHistory: () => void;
  loading: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  onResetChat,
  onSelectQuery,
  searchHistory,
  onClearHistory,
  loading
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="brand-logo">
            <span className="brand-logo__letter">RC</span>
          </div>
          <div className="brand-text">
            <h2>RAGChatbot</h2>
            <span className="brand-sub">GST & HSN Classifier</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <button
          type="button"
          className="new-search-btn"
          onClick={onResetChat}
        >
          <span className="plus-icon">+</span>
          <span>New Classification Session</span>
        </button>

        <div className="sidebar__status-card">
          <div className="status-indicator">
            <span className="status-ping" />
            <span className="status-label">Tariff Engine Online</span>
          </div>
          <div className="status-stats">
            <div className="stat-pill">
              <strong>21,921+</strong>
              <span>HSN / SAC Records</span>
            </div>
            <div className="stat-pill">
              <strong>98</strong>
              <span>Tariff Chapters</span>
            </div>
          </div>
        </div>

        <div className="sidebar__section">
          <div className="section-title-row">
            <span className="section-title">QUICK TARIFF PRESETS</span>
          </div>
          <div className="category-list">
            {CATEGORY_PRESETS.map(preset => (
              <button
                key={preset.label}
                type="button"
                className="category-btn"
                onClick={() => {
                  onSelectQuery(preset.query);
                  onClose();
                }}
                disabled={loading}
              >
                <span className="cat-icon">{preset.icon}</span>
                <span className="cat-label">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {searchHistory.length > 0 && (
          <div className="sidebar__section">
            <div className="section-title-row">
              <span className="section-title">RECENT SEARCHES</span>
              <button
                type="button"
                className="clear-history-btn"
                onClick={onClearHistory}
              >
                Clear
              </button>
            </div>
            <div className="history-list">
              {searchHistory.map((item, idx) => (
                <button
                  key={`${item}-${idx}`}
                  type="button"
                  className="history-item"
                  onClick={() => {
                    onSelectQuery(item);
                    onClose();
                  }}
                  disabled={loading}
                >
                  <span className="history-icon">🔍</span>
                  <span className="history-query">{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar__footer">
          <div className="footer-badge">
            <span className="badge-dot" />
            <span>Official CBIC Tariff Grounded</span>
          </div>
          <p className="footer-copy">
            Classification suggestions must be validated with official notifications before tax filing.
          </p>
        </div>
      </aside>
    </>
  );
}
