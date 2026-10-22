/** ProposalSidebar — list of proposals. Only proposals with a workbook can be opened. */
import { useState } from 'react';
import type { Proposal } from '../data/proposals';
import { StatusPill } from './StatusPill';

interface Props {
  proposals: Proposal[];
  selectedId: string;
  onUnavailable: (proposal: Proposal) => void;
}

export function ProposalSidebar({ proposals, selectedId, onUnavailable }: Props) {
  const [query, setQuery] = useState('');
  const visible = proposals.filter((p) =>
    `${p.name} ${p.client}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <aside className="sidebar" aria-label="Proposals">
      <div className="sidebar-head">
        <h2>Proposals</h2>
        <button className="btn btn-ghost btn-sm" type="button">+ New</button>
      </div>
      <input
        className="search"
        type="search"
        placeholder="Search proposals"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="proposal-list">
        {visible.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`proposal-item${p.id === selectedId ? ' selected' : ''}`}
              onClick={() => (p.hasWorkbook ? undefined : onUnavailable(p))}
            >
              <span className="proposal-client">{p.client}</span>
              <span className="proposal-name">{p.name}</span>
              <span className="proposal-meta">
                <StatusPill status={p.status} />
                <span>{p.value}</span>
                <span className="muted">· {p.updated}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
