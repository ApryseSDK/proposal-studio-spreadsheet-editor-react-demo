/** TopBar — the portal's global navigation. In focus mode it shows an "Exit focus" button. */
interface Props {
  focus: boolean;
  onExitFocus: () => void;
}

export function TopBar({ focus, onExitFocus }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#0206A8" />
          <path d="M9 9h14v4H9zM9 15h6v8H9zM17 15h6v3h-6zM17 20h6v3h-6z" fill="#00EB9B" />
        </svg>
        <span className="brand-name">Proposal Studio</span>
      </div>

      {!focus && (
        <nav className="topnav" aria-label="Main">
          <a className="active" href="#">Proposals</a>
          <a href="#">Clients</a>
          <a href="#">Reports</a>
        </nav>
      )}

      <div className="topbar-right">
        {focus ? (
          <button className="btn btn-on-dark" type="button" onClick={onExitFocus}>
            Exit focus
          </button>
        ) : (
          <span className="powered">Spreadsheet editing by Apryse</span>
        )}
        <span className="avatar" title="Signed in as April">AS</span>
      </div>
    </header>
  );
}
