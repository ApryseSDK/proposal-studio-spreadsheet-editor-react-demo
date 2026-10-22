/**
 * KpiStrip — four compact cards whose values are read live from the workbook with the
 * Workbook API (see readKpis in lib/spreadsheet.ts). Edit the workbook and these update,
 * which shows the portal and the spreadsheet sharing one source of truth.
 */
import { KPI_CELLS, type KpiId } from '../config';
import { StatusPill } from './StatusPill';

interface Props {
  ready: boolean;
  kpis: Partial<Record<KpiId, string>>;
}

export function KpiStrip({ ready, kpis }: Props) {
  return (
    <section className="kpis" aria-label="Key metrics, read live from the workbook">
      {KPI_CELLS.map((kpi) => {
        const value = kpis[kpi.id];
        return (
          <div className={`kpi kpi-${kpi.id}`} key={kpi.id} title={`Live from ${kpi.sheet} · ${kpi.excelRef}`}>
            <span className="kpi-label">{kpi.label}</span>
            <span className="kpi-value">
              {!ready ? <span className="skeleton" /> : kpi.id === 'health' ? <StatusPill status={value ?? ''} /> : value || '—'}
            </span>
          </div>
        );
      })}
      <span className="kpi-note">Live from the workbook</span>
    </section>
  );
}
