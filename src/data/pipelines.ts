export type PipelineStage = {
  id: string;
  name: string;
  color: string;
  background: string;
};

export type Pipeline = {
  id: string;
  name: string;
  stages: PipelineStage[];
};

export const pipelines: Pipeline[] = [
  {
    id: 'pipeline-sales',
    name: 'Sales Pipeline',
    stages: [
      { id: 'lead', name: 'New Leads', color: '#133159', background: '#e6ecf6' },
      { id: 'qualified', name: 'Lead Engaged', color: '#133159', background: '#e6ecf6' },
      { id: 'proposal', name: 'Working', color: '#133159', background: '#e6ecf6' },
      { id: 'negotiation', name: 'Quote Ready', color: '#133159', background: '#e6ecf6' },
      { id: 'won', name: 'Quote Sent', color: '#133159', background: '#e6ecf6' },
      { id: 'lost', name: 'Closed', color: '#133159', background: '#e6ecf6' },
    ],
  },
  {
    id: 'pipeline-renewals',
    name: 'Renewals',
    stages: [
      { id: 'renewal-review', name: 'Review', color: '#133159', background: '#e6ecf6' },
      { id: 'renewal-risk', name: 'At Risk', color: '#133159', background: '#e6ecf6' },
      { id: 'renewal-confirmed', name: 'Confirmed', color: '#133159', background: '#e6ecf6' },
    ],
  },
];
