/** StatusPill — colored label for a proposal, approval or project-health status. */
const TONE: Record<string, string> = {
  'In Review': 'info',
  Draft: 'neutral',
  Approved: 'good',
  'Changes Requested': 'warn',
  Pending: 'pending',
  'On Track': 'good',
  'At Risk': 'pending',
  'Off Track': 'warn',
};

export function StatusPill({ status }: { status: string }) {
  return <span className={`pill pill-${TONE[status] ?? 'neutral'}`}>{status || '—'}</span>;
}
