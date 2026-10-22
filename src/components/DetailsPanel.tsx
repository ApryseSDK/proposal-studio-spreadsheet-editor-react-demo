/** DetailsPanel — approvals, activity and a data-residency note. Presentational. */
import { ACTIVITY, APPROVERS } from '../data/proposals';
import { StatusPill } from './StatusPill';

export function DetailsPanel() {
  return (
    <aside className="details" aria-label="Proposal details">
      <section>
        <h3>Approvals</h3>
        <ul className="approvers">
          {APPROVERS.map((a) => (
            <li key={a.name}>
              <span className="avatar avatar-sm">{a.name.split(' ').map((n) => n[0]).join('')}</span>
              <span className="approver-text">
                <strong>{a.name}</strong>
                <span className="muted">{a.role}</span>
              </span>
              <StatusPill status={a.decision} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Activity</h3>
        <ul className="activity">
          {ACTIVITY.map((item) => (
            <li key={item.what}>
              <strong>{item.who}</strong> {item.what}
              <span className="muted"> · {item.when}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="residency">
        <h3>Where is this file?</h3>
        <p>
          This workbook is opened, edited and saved <strong>in your browser</strong>. It is not
          uploaded to a server or sent to a third-party service.
        </p>
      </section>
    </aside>
  );
}
