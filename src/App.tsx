/**
 * App.tsx — the Proposal Studio layout.
 *
 *  ┌──────────────────────────── TopBar ─────────────────────────────┐
 *  │ ProposalHeader: title, status, actions (one row)                │
 *  │ KpiStrip: four compact cards read live from the workbook        │
 *  │ ┌─────────────────────────────────────────────────────────────┐ │
 *  │ │ Spreadsheet Editor (WebViewer) — gets almost all the space  │ │
 *  │ └─────────────────────────────────────────────────────────────┘ │
 *  └─────────────────────────────────────────────────────────────────┘
 *   Optional, toggled from the header: Proposals drawer (left), Details panel (right).
 *
 * The WebViewer <div> stays mounted for the life of the page; toggles only change
 * CSS classes around it.
 *
 * URL options (handy for screen recordings):
 *   ?focus=1        start in focus mode (only the top bar and the editor)
 *   ?file=master    open the Master workbook instead of the Clean one
 */
import { useEffect, useRef, useState } from 'react';
import { TopBar } from './components/TopBar';
import { ProposalSidebar } from './components/ProposalSidebar';
import { ProposalHeader } from './components/ProposalHeader';
import { KpiStrip } from './components/KpiStrip';
import { DetailsPanel } from './components/DetailsPanel';
import { PROPOSALS } from './data/proposals';
import { useSpreadsheetEditor } from './hooks/useSpreadsheetEditor';

export default function App() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const { instance, ready, editing, kpis } = useSpreadsheetEditor(viewerRef);

  const [listOpen, setListOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [focus, setFocus] = useState(() => new URLSearchParams(location.search).has('focus'));
  const [toast, setToast] = useState<string | null>(null);

  // Auto-hide toasts after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const proposal = PROPOSALS[0];
  const classes = ['app', focus && 'focus', listOpen && !focus && 'list-open', detailsOpen && !focus && 'details-open']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <TopBar focus={focus} onExitFocus={() => setFocus(false)} />

      {listOpen && !focus && (
        <ProposalSidebar
          proposals={PROPOSALS}
          selectedId={proposal.id}
          onUnavailable={(p) => setToast(`${p.name} is sample data. Only Project Alpha has a workbook in this demo.`)}
        />
      )}

      <main className="main">
        {!focus && (
          <>
            <ProposalHeader
              proposal={proposal}
              instance={instance}
              ready={ready}
              editing={editing}
              listOpen={listOpen}
              detailsOpen={detailsOpen}
              onToggleList={() => setListOpen((v) => !v)}
              onToggleDetails={() => setDetailsOpen((v) => !v)}
              onToggleFocus={() => setFocus(true)}
              onNotify={setToast}
            />
            <KpiStrip ready={ready} kpis={kpis} />
          </>
        )}

        <section className="editor-card" aria-label="Spreadsheet editor">
          {/* WebViewer mounts into this element. It needs an explicit height. */}
          <div ref={viewerRef} className="viewer" />
        </section>
      </main>

      {detailsOpen && !focus && <DetailsPanel />}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
