/**
 * ProposalHeader — one compact row: title and status on the left, actions on the right.
 * The actions call the Spreadsheet Editor API:
 *   View / Edit toggle  -> setEditing()     (SpreadsheetEditorManager.setEditMode)
 *   Download XLSX       -> downloadXlsx()   (UI.downloadPdf with downloadType 'spreadsheetEditor')
 *   Export PDF          -> downloadPdf()    (UI.downloadPdf with downloadType 'pdf')
 *   Open file           -> openLocalFile()  (UI.loadDocument with a local File, nothing uploaded)
 */
import { useRef } from 'react';
import type { WebViewerInstance } from '@pdftron/webviewer';
import type { Proposal } from '../data/proposals';
import { downloadPdf, downloadXlsx, openLocalFile, setEditing } from '../lib/spreadsheet';
import { StatusPill } from './StatusPill';

interface Props {
  proposal: Proposal;
  instance: WebViewerInstance | null;
  ready: boolean;
  editing: boolean;
  listOpen: boolean;
  detailsOpen: boolean;
  onToggleList: () => void;
  onToggleDetails: () => void;
  onToggleFocus: () => void;
  onNotify: (message: string) => void;
}

export function ProposalHeader({
  proposal, instance, ready, editing, listOpen, detailsOpen,
  onToggleList, onToggleDetails, onToggleFocus, onNotify,
}: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const disabled = !instance || !ready;

  return (
    <section className="proposal-header">
      <button
        className="btn btn-icon"
        type="button"
        title={listOpen ? 'Hide proposals' : 'Show proposals'}
        aria-pressed={listOpen}
        onClick={onToggleList}
      >
        ☰
      </button>

      <div className="title-block">
        <h1>{proposal.name}</h1>
        <p className="meta">
          <StatusPill status={proposal.status} />
          <span>{proposal.client}</span>
          <span className="muted">· Owner {proposal.owner}</span>
        </p>
      </div>

      <div className="actions">
        {/* Read-only for reviewers, editing for authors. */}
        <div className="segmented" role="group" aria-label="Mode">
          <button
            type="button"
            className={!editing ? 'on' : ''}
            disabled={disabled}
            onClick={() => instance && setEditing(instance, false)}
          >
            View
          </button>
          <button
            type="button"
            className={editing ? 'on' : ''}
            disabled={disabled}
            onClick={() => instance && setEditing(instance, true)}
          >
            Edit
          </button>
        </div>

        <button className="btn btn-ghost" type="button" disabled={disabled} onClick={() => fileInput.current?.click()}>
          Open file
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".xlsx,.xls,.csv"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && instance) {
              openLocalFile(instance, file);
              onNotify(`Opened ${file.name} in your browser. Nothing was uploaded.`);
            }
            e.target.value = '';
          }}
        />
        <button className="btn btn-ghost" type="button" disabled={disabled} onClick={() => instance && downloadXlsx(instance)}>
          Download XLSX
        </button>
        <button className="btn btn-ghost" type="button" disabled={disabled} onClick={() => instance && downloadPdf(instance)}>
          Export PDF
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={disabled}
          onClick={() => onNotify('Submitted for approval. Priya Shah (Finance) has been notified.')}
        >
          Submit
        </button>
        <button
          className="btn btn-icon"
          type="button"
          title={detailsOpen ? 'Hide details' : 'Show approvals and activity'}
          aria-pressed={detailsOpen}
          onClick={onToggleDetails}
        >
          ⓘ
        </button>
        <button className="btn btn-icon" type="button" title="Focus mode: show only the editor" onClick={onToggleFocus}>
          ⤢
        </button>
      </div>
    </section>
  );
}
