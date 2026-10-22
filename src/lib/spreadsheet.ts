/**
 * spreadsheet.ts — small, framework-free helpers around the Apryse
 * Spreadsheet Editor API. Each function does one thing and is safe to copy into
 * another project (React, Angular, Vue or plain JS).
 *
 * API map (WebViewer 12.x):
 *   instance.Core.documentViewer.getSpreadsheetEditorManager()  -> the editor manager
 *   manager.addEventListener(Events.SPREADSHEET_EDITOR_READY)   -> workbook loaded
 *   manager.addEventListener(Events.DATA_CHANGED)               -> a cell/style/range changed
 *   manager.setEditMode(SpreadsheetEditorEditMode.EDITING | VIEW_ONLY)
 *   manager.getWorkbook().getSheet(name).getCellAt(row, col)    -> zero-based cell access
 *   cell.getDisplayStringValue()                                -> the formatted value shown in the grid
 *   instance.UI.downloadPdf({ downloadType: 'spreadsheetEditor' }) -> save as .xlsx
 *   instance.UI.downloadPdf({ downloadType: 'pdf' })               -> export as .pdf
 */
import type { Core, WebViewerInstance } from '@pdftron/webviewer';
import { KPI_CELLS, type KpiId } from '../config';

export type SpreadsheetEditorManager = Core.SpreadsheetEditor.SpreadsheetEditorManager;

/** Returns the Spreadsheet Editor manager for a WebViewer instance. */
export function getManager(instance: WebViewerInstance): SpreadsheetEditorManager {
  return instance.Core.documentViewer.getSpreadsheetEditorManager();
}

/** The event names the Spreadsheet Editor manager emits. */
export function getEvents(instance: WebViewerInstance) {
  return instance.Core.SpreadsheetEditor.SpreadsheetEditorManager.Events;
}

/**
 * Switches between editing and read-only viewing.
 * Use VIEW_ONLY for reviewers and approvers, EDITING for authors.
 */
export function setEditing(instance: WebViewerInstance, editing: boolean): void {
  const { SpreadsheetEditorEditMode } = instance.Core.SpreadsheetEditor;
  getManager(instance).setEditMode(
    editing ? SpreadsheetEditorEditMode.EDITING : SpreadsheetEditorEditMode.VIEW_ONLY,
  );
}

/** True when the editor is currently in editing mode. */
export function isEditing(instance: WebViewerInstance): boolean {
  const { SpreadsheetEditorEditMode } = instance.Core.SpreadsheetEditor;
  return getManager(instance).getEditMode() === SpreadsheetEditorEditMode.EDITING;
}

/**
 * Reads the KPI cells defined in config.ts and returns their *displayed* values
 * (the formatted text you see in the grid, e.g. "$796,345" or "46.9%").
 * Formula cells return their calculated result, so this updates as users edit.
 */
export function readKpis(instance: WebViewerInstance): Partial<Record<KpiId, string>> {
  const workbook = getManager(instance).getWorkbook();
  const values: Partial<Record<KpiId, string>> = {};
  if (!workbook) return values;

  for (const kpi of KPI_CELLS) {
    try {
      const sheet = workbook.getSheet(kpi.sheet);
      values[kpi.id] = sheet?.getCellAt(kpi.row, kpi.col)?.getDisplayStringValue() ?? '';
    } catch {
      // A sheet or cell is missing (for example, the user opened a different file).
      values[kpi.id] = '';
    }
  }
  return values;
}

/** Saves the current workbook, including every edit made in the browser, as an .xlsx download. */
export function downloadXlsx(instance: WebViewerInstance, filename = 'Project_Alpha_Proposal.xlsx') {
  return instance.UI.downloadPdf({ downloadType: 'spreadsheetEditor', filename });
}

/** Exports the current workbook as a PDF download. Conversion happens in the browser. */
export function downloadPdf(instance: WebViewerInstance, filename = 'Project_Alpha_Proposal.pdf') {
  return instance.UI.downloadPdf({ downloadType: 'pdf', filename });
}

/**
 * Opens a spreadsheet the user picked from their computer (XLSX, XLS or CSV).
 * The File object is read locally; it is never uploaded anywhere.
 */
export function openLocalFile(instance: WebViewerInstance, file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'xlsx';
  return instance.UI.loadDocument(file, { filename: file.name, extension, enableOfficeEditing: true });
}
