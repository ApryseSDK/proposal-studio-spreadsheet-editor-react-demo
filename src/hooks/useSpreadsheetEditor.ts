/**
 * useSpreadsheetEditor — a React hook that mounts Apryse WebViewer in
 * Spreadsheet Editor mode inside a <div> and exposes its state to the rest of the app.
 *
 * Usage:
 *   const viewerRef = useRef<HTMLDivElement>(null);
 *   const { instance, ready, editing, kpis } = useSpreadsheetEditor(viewerRef);
 *   return <div ref={viewerRef} style={{ height: '100%' }} />;
 *
 * The three settings that turn WebViewer into a spreadsheet editor:
 *   initialMode: WebViewer.Modes.SPREADSHEET_EDITOR   open the spreadsheet UI instead of the PDF viewer
 *   enableOfficeEditing: true                          allow editing of Office formats
 *   spreadsheetEditorOptions.initialEditMode           'editing' or 'viewOnly' when the file opens
 */
import { useEffect, useRef, useState, type RefObject } from 'react';
import WebViewer, { type WebViewerInstance } from '@pdftron/webviewer';
import { LICENSE_KEY, SAMPLE_WORKBOOK_URL, WEBVIEWER_PATH, type KpiId } from '../config';
import { getEvents, getManager, isEditing, readKpis } from '../lib/spreadsheet';

export function useSpreadsheetEditor(viewerRef: RefObject<HTMLDivElement>) {
  const [instance, setInstance] = useState<WebViewerInstance | null>(null);
  const [ready, setReady] = useState(false); // true once the workbook is loaded in memory
  const [editing, setEditingState] = useState(true);
  const [kpis, setKpis] = useState<Partial<Record<KpiId, string>>>({});
  const started = useRef(false); // guards against React StrictMode mounting twice in dev

  useEffect(() => {
    const element = viewerRef.current;
    if (!element || started.current) return;
    started.current = true;

    WebViewer(
      {
        path: WEBVIEWER_PATH,
        licenseKey: LICENSE_KEY,
        initialDoc: SAMPLE_WORKBOOK_URL,
        initialMode: WebViewer.Modes.SPREADSHEET_EDITOR,
        enableOfficeEditing: true,
        spreadsheetEditorOptions: { initialEditMode: WebViewer.InitialEditModes.EDITING },
      },
      element,
    ).then((wv) => {
      const manager = getManager(wv);
      const Events = getEvents(wv);

      // Fires every time a workbook finishes loading (initial file or one the user opens).
      manager.addEventListener(Events.SPREADSHEET_EDITOR_READY, () => {
        setReady(true);
        setEditingState(isEditing(wv));
        setKpis(readKpis(wv));
      });

      // Fires when cell values, styles or ranges change. Formulas recalculate first,
      // so re-reading the KPI cells shows the new totals right away.
      manager.addEventListener(Events.DATA_CHANGED, () => setKpis(readKpis(wv)));

      // Keep the portal's View/Edit toggle in sync if the mode changes from the ribbon.
      manager.addEventListener(Events.EDIT_MODE_CHANGED, () => setEditingState(isEditing(wv)));

      // Dev convenience: inspect the editor from the browser console, e.g.
      //   webviewer.Core.documentViewer.getSpreadsheetEditorManager().getWorkbook()
      if (import.meta.env.DEV) (window as unknown as { webviewer: WebViewerInstance }).webviewer = wv;

      setInstance(wv);
    });
  }, [viewerRef]);

  return { instance, ready, editing, kpis };
}
