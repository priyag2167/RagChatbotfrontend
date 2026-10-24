interface TopbarProps {
  onOpenSidebar: () => void;
  onResetChat: () => void;
}

export function Topbar({ onOpenSidebar, onResetChat }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="menu-toggle"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <div>
          <div className="topbar__breadcrumbs">
            <span>Tariff Schedule</span>
            <span className="crumb-sep">/</span>
            <span>GST Act 2017</span>
          </div>
          <h1 className="topbar__title">HSN & SAC Classification Search</h1>
        </div>
      </div>

      <div className="topbar__right">
        <span className="tariff-badge">
          <span className="dot dot--green" />
          Dataset Grounded
        </span>
        <button
          type="button"
          className="topbar-action-btn"
          onClick={onResetChat}
          title="Clear current chat"
        >
          Restart
        </button>
      </div>
    </header>
  );
}
