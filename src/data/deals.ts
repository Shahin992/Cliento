export interface DealActivity {
  id: number;
  date: string;
  title: string;
  description?: string;
  hasImage?: boolean;
}

export interface DealDetail {
  id: number;
  name: string;
  location: string;
  area: string;
  appointment: string;
  price: string;
  status: 'In Progress' | 'Won' | 'Lost';
  pipelineId: string;
  stageId: string;
  lostReason?: string;
  avatar: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  progress: string;
  roomArea: string;
  people: string;
  roomAccess: string;
  instructions: string;
  activity: DealActivity[];
}

export const deals: DealDetail[] = [
  {
    id: 1,
    name: '475 Spruce Drive',
    location: 'Pittsburgh, PA 23592',
    area: '100m2',
    appointment: 'Nov 14, 2021 07:00 AM',
    price: '$6000',
    status: 'In Progress',
    pipelineId: 'pipeline-sales',
    stageId: 'proposal',
    avatar: 'PS',
    customer: 'Deanna Annis',
    email: 'brodrigues@gmail.com',
    phone: '617-952-4069',
    address: '2893 Austin Secret Lane, Parowan, UT 12413',
    progress: 'In Progress',
    roomArea: '25 m2',
    people: '10',
    roomAccess: 'Keys with doorman',
    instructions:
      'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis.',
    activity: [
      {
        id: 1,
        date: '17 Nov 2021',
        title: 'Installation or inspection of your thermostat',
        description: 'Inspection completed and notes captured for the unit.',
        hasImage: true,
      },
      {
        id: 2,
        date: '16 Nov 2021',
        title: 'Installation of the new air conditioning system',
      },
      {
        id: 3,
        date: '16 Nov 2021',
        title: 'Evaluation and removal of the old system',
      },
    ],
  },
  {
    id: 2,
    name: '1952 Chicago Avenue',
    location: 'Fresno, CA 93711',
    area: '100m2',
    appointment: 'Nov 15, 2021 08:00 AM',
    price: '$6000',
    status: 'Won',
    pipelineId: 'pipeline-sales',
    stageId: 'won',
    avatar: 'CA',
    customer: 'Eric Dean',
    email: 'edean@gmail.com',
    phone: '415-225-0194',
    address: '1952 Chicago Avenue, Fresno, CA 93711',
    progress: 'Closed',
    roomArea: '18 m2',
    people: '6',
    roomAccess: 'Front desk access',
    instructions:
      'Tellus at urna condimentum mattis pellentesque id nibh tortor. Vulputate ut pharetra sit.',
    activity: [
      {
        id: 1,
        date: '12 Nov 2021',
        title: 'Final quality check and handover',
      },
      {
        id: 2,
        date: '10 Nov 2021',
        title: 'On-site installation completed',
      },
    ],
  },
  {
    id: 3,
    name: '4409 Haul Road',
    location: 'Saint Paul, MN 55102',
    area: '100m2',
    appointment: 'Nov 16, 2021 09:00 AM',
    price: '$6000',
    status: 'In Progress',
    pipelineId: 'pipeline-sales',
    stageId: 'qualified',
    avatar: 'HR',
    customer: 'Jorge Meadows',
    email: 'jmeadows@gmail.com',
    phone: '507-773-8831',
    address: '4409 Haul Road, Saint Paul, MN 55102',
    progress: 'In Progress',
    roomArea: '30 m2',
    people: '12',
    roomAccess: 'Security badge',
    instructions:
      'Leo vel orci porta non pulvinar neque laoreet suspendisse interdum.',
    activity: [
      {
        id: 1,
        date: '14 Nov 2021',
        title: 'Site inspection and measurements',
      },
    ],
  },
  {
    id: 4,
    name: '579 Godfrey Street',
    location: 'Monitor, OR 97071',
    area: '100m2',
    appointment: 'Nov 17, 2021 10:00 AM',
    price: '$6000',
    status: 'Lost',
    pipelineId: 'pipeline-sales',
    stageId: 'lost',
    avatar: 'GS',
    customer: 'Laura Wright',
    email: 'laura.wright@gmail.com',
    phone: '503-417-2204',
    address: '579 Godfrey Street, Monitor, OR 97071',
    progress: 'Closed',
    roomArea: '21 m2',
    people: '8',
    roomAccess: 'Office manager',
    instructions:
      'Vitae congue mauris rhoncus aenean vel elit scelerisque mauris.',
    activity: [
      {
        id: 1,
        date: '18 Nov 2021',
        title: 'Client sign-off and documentation',
      },
    ],
  },
  {
    id: 23,
    name: '2705 Canterbury Drive',
    location: 'New York, NY 10011',
    area: '100m2',
    appointment: 'Nov 20, 2021 07:00 AM',
    price: '$6000',
    status: 'In Progress',
    pipelineId: 'pipeline-renewals',
    stageId: 'renewal-review',
    avatar: 'CD',
    customer: 'Miguel Hale',
    email: 'miguel.hale@gmail.com',
    phone: '212-445-2091',
    address: '2705 Canterbury Drive, New York, NY 10011',
    progress: 'In Progress',
    roomArea: '27 m2',
    people: '9',
    roomAccess: 'Concierge desk',
    instructions:
      'Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.',
    activity: [
      {
        id: 1,
        date: '19 Nov 2021',
        title: 'Pre-install checklist completed',
      },
    ],
  },
   {
    id: 55,
    name: '2705 Canterbury Drive',
    location: 'New York, NY 10011',
    area: '100m2',
    appointment: 'Nov 20, 2021 07:00 AM',
    price: '$6000',
    status: 'In Progress',
    pipelineId: 'pipeline-renewals',
    stageId: 'renewal-review',
    avatar: 'CD',
    customer: 'Miguel Hale',
    email: 'miguel.hale@gmail.com',
    phone: '212-445-2091',
    address: '2705 Canterbury Drive, New York, NY 10011',
    progress: 'In Progress',
    roomArea: '27 m2',
    people: '9',
    roomAccess: 'Concierge desk',
    instructions:
      'Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.',
    activity: [
      {
        id: 1,
        date: '19 Nov 2021',
        title: 'Pre-install checklist completed',
      },
    ],
  },
   {
    id: 85,
    name: '2705 Canterbury Drive',
    location: 'New York, NY 10011',
    area: '100m2',
    appointment: 'Nov 20, 2021 07:00 AM',
    price: '$6000',
    status: 'In Progress',
    pipelineId: 'pipeline-renewals',
    stageId: 'renewal-review',
    avatar: 'CD',
    customer: 'Miguel Hale',
    email: 'miguel.hale@gmail.com',
    phone: '212-445-2091',
    address: '2705 Canterbury Drive, New York, NY 10011',
    progress: 'In Progress',
    roomArea: '27 m2',
    people: '9',
    roomAccess: 'Concierge desk',
    instructions:
      'Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.',
    activity: [
      {
        id: 1,
        date: '19 Nov 2021',
        title: 'Pre-install checklist completed',
      },
    ],
  },
  {
    id: 6,
    name: '579 Godfrey Street',
    location: 'Monitor, OR 97071',
    area: '100m2',
    appointment: 'Nov 17, 2021 10:00 AM',
    price: '$6000',
    status: 'Won',
    pipelineId: 'pipeline-renewals',
    stageId: 'renewal-confirmed',
    avatar: 'GS',
    customer: 'Laura Wright',
    email: 'laura.wright@gmail.com',
    phone: '503-417-2204',
    address: '579 Godfrey Street, Monitor, OR 97071',
    progress: 'Closed',
    roomArea: '21 m2',
    people: '8',
    roomAccess: 'Office manager',
    instructions:
      'Vitae congue mauris rhoncus aenean vel elit scelerisque mauris.',
    activity: [
      {
        id: 1,
        date: '18 Nov 2021',
        title: 'Client sign-off and documentation',
      },
    ],
  },
  {
    id: 7,
    name: '2705 Canterbury Drive',
    location: 'New York, NY 10011',
    area: '100m2',
    appointment: 'Nov 20, 2021 07:00 AM',
    price: '$6000',
    status: 'In Progress',
    pipelineId: 'pipeline-sales',
    stageId: 'lead',
    avatar: 'CD',
    customer: 'Miguel Hale',
    email: 'miguel.hale@gmail.com',
    phone: '212-445-2091',
    address: '2705 Canterbury Drive, New York, NY 10011',
    progress: 'In Progress',
    roomArea: '27 m2',
    people: '9',
    roomAccess: 'Concierge desk',
    instructions:
      'Cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl.',
    activity: [
      {
        id: 1,
        date: '19 Nov 2021',
        title: 'Pre-install checklist completed',
      },
    ],
  },
];
