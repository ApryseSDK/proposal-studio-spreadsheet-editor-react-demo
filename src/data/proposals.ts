/**
 * proposals.ts — sample data for the portal's sidebar and header.
 *
 * Everything here is fictional. Only "Project Alpha" has a workbook attached
 * (public/files/Project_Alpha_Proposal_Master.xlsx); the others make the portal
 * look like a real list of work.
 */
export type ProposalStatus = 'Draft' | 'In Review' | 'Approved' | 'Changes Requested';

export interface Proposal {
  id: string;
  name: string;
  client: string;
  owner: string;
  status: ProposalStatus;
  value: string; // display string, e.g. "$796K"
  updated: string; // display string, e.g. "2h ago"
  hasWorkbook: boolean;
}

export const PROPOSALS: Proposal[] = [
  {
    id: 'alpha',
    name: 'Project Alpha — Client Portal Modernization',
    client: 'Northwind Financial Group',
    owner: 'Jordan Lee',
    status: 'In Review',
    value: '$796K',
    updated: '2h ago',
    hasWorkbook: true,
  },
  {
    id: 'harbor',
    name: 'Records Migration',
    client: 'Harbor Health Partners',
    owner: 'Kim Nguyen',
    status: 'Draft',
    value: '$412K',
    updated: 'Yesterday',
    hasWorkbook: false,
  },
  {
    id: 'cedar',
    name: 'Fleet Data Platform',
    client: 'Cedar Logistics',
    owner: 'Sam Patel',
    status: 'Approved',
    value: '$1.2M',
    updated: 'Sep 24',
    hasWorkbook: false,
  },
  {
    id: 'summit',
    name: 'Claims Intake Redesign',
    client: 'Summit Mutual Insurance',
    owner: 'Rosa Alvarez',
    status: 'Changes Requested',
    value: '$268K',
    updated: 'Sep 19',
    hasWorkbook: false,
  },
];

/** Approvers shown in the Details panel. Mirrors the Approvals table in the workbook. */
export const APPROVERS = [
  { name: 'Dana Whitfield', role: 'Executive sponsor', decision: 'Approved' },
  { name: 'Kim Nguyen', role: 'IT security', decision: 'Approved' },
  { name: 'Priya Shah', role: 'Finance', decision: 'Pending' },
] as const;

/** Recent activity shown in the Details panel. */
export const ACTIVITY = [
  { who: 'Jordan Lee', what: 'updated Cost Breakdown', when: '2h ago' },
  { who: 'Kim Nguyen', what: 'approved the security review', when: 'Yesterday' },
  { who: 'Dana Whitfield', what: 'approved the proposal', when: 'Sep 28' },
  { who: 'Jordan Lee', what: 'created the proposal', when: 'Sep 21' },
] as const;
