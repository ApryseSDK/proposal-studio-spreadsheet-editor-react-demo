/**
 * config.ts — every setting the demo depends on, in one place.
 *
 * If you are adapting this demo to your own app, this is the first file to edit.
 */

/**
 * Apryse license key, read from the `.env` file (VITE_APRYSE_LICENSE_KEY).
 * With no key, WebViewer still runs in demo mode with a watermark.
 */
export const LICENSE_KEY: string = import.meta.env.VITE_APRYSE_LICENSE_KEY ?? '';

/**
 * Where WebViewer's static worker, engine and UI files are served from.
 * scripts/copy-webviewer-assets.mjs copies them to public/lib/webviewer on install.
 */
export const WEBVIEWER_PATH = '/lib/webviewer';

/**
 * The sample workbook in public/files. It avoids features Spreadsheet Editor 12.2 doesn't
 * display yet (conditional formatting, data validation), so it looks the same in Excel,
 * in the browser editor and after saving back to XLSX.
 */
export const SAMPLE_WORKBOOK_URL = '/files/Project_Alpha_Proposal_Clean.xlsx';

/**
 * Cells the portal reads from the workbook to show live KPI cards above the editor.
 *
 * The Workbook API uses ZERO-BASED indexes:
 *   Excel cell I6  ->  row 5, column 8   (column A = 0, row 1 = 0)
 *
 * These point at the "Key Metrics" block on the Executive Summary sheet of
 * Project_Alpha_Proposal_Clean.xlsx. If you change the workbook layout, update these.
 */
export const KPI_CELLS = [
  { id: 'budget', label: 'Total budget', sheet: 'Executive Summary', excelRef: 'I6', row: 5, col: 8 },
  { id: 'spent', label: 'Spent to date', sheet: 'Executive Summary', excelRef: 'I7', row: 6, col: 8 },
  { id: 'complete', label: 'Overall complete', sheet: 'Executive Summary', excelRef: 'I10', row: 9, col: 8 },
  { id: 'health', label: 'Project health', sheet: 'Executive Summary', excelRef: 'I13', row: 12, col: 8 },
] as const;

export type KpiId = (typeof KPI_CELLS)[number]['id'];
