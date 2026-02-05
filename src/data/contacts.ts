export interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  avatar: string;
  recentDeals: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    amount: string;
  }>;
}

export const contacts: Contact[] = [
  {
    id: 'deanna-annis',
    name: 'Deanna Annis',
    firstName: 'Deanna',
    lastName: 'Annis',
    email: 'deannaannis@gmail.com',
    phone: '999-999-9999',
    address: '475 Spruce Drive, Pittsburgh, PA 12345',
    addressLine: '475 Spruce Drive',
    city: 'Pittsburgh',
    state: 'PA',
    zipCode: '12345',
    avatar: 'DA',
    recentDeals: [
      {
        id: 'deanna-deal-1',
        title: '319 Haul Road, Saint Paul, MN',
        date: 'Nov 14',
        time: '09:00',
        amount: '$ 5000',
      },
      {
        id: 'deanna-deal-2',
        title: '3290 Levy Court, Lawrence, MA',
        date: 'Nov 14',
        time: '09:00',
        amount: '$ 6000',
      },
      {
        id: 'deanna-deal-3',
        title: '416 Woodward Terrace, New York, NY',
        date: 'Nov 14',
        time: '09:00',
        amount: '$ 6000',
      },
    ],
  },
  {
    id: 'george-gamble',
    name: 'George Gamble',
    firstName: 'George',
    lastName: 'Gamble',
    email: 'georgegamble@gmail.com',
    phone: '999-999-9999',
    address: '2213 Thorn Street, Glenrock, WY 12345',
    addressLine: '2213 Thorn Street',
    city: 'Glenrock',
    state: 'WY',
    zipCode: '12345',
    avatar: 'GG',
    recentDeals: [
      {
        id: 'george-deal-1',
        title: '1432 Main Street, Denver, CO',
        date: 'Nov 10',
        time: '11:30',
        amount: '$ 4200',
      },
      {
        id: 'george-deal-2',
        title: '88 Walnut Drive, Aurora, CO',
        date: 'Nov 08',
        time: '10:15',
        amount: '$ 3900',
      },
      {
        id: 'george-deal-3',
        title: '512 River Lane, Boulder, CO',
        date: 'Nov 05',
        time: '13:45',
        amount: '$ 6100',
      },
    ],
  },
  {
    id: 'andrea-willis-1',
    name: 'Andrea Willis',
    firstName: 'Andrea',
    lastName: 'Willis',
    email: 'andreawillis@gmail.com',
    phone: '999-999-9999',
    address: '1952 Chicago Avenue, Fresno, PA 12345',
    addressLine: '1952 Chicago Avenue',
    city: 'Fresno',
    state: 'PA',
    zipCode: '12345',
    avatar: 'AW',
    recentDeals: [
      {
        id: 'andrea1-deal-1',
        title: '17 Elm Street, Fresno, PA',
        date: 'Nov 12',
        time: '09:30',
        amount: '$ 2800',
      },
      {
        id: 'andrea1-deal-2',
        title: '92 Pine Avenue, Fresno, PA',
        date: 'Nov 09',
        time: '14:00',
        amount: '$ 3300',
      },
      {
        id: 'andrea1-deal-3',
        title: '210 Cedar Road, Fresno, PA',
        date: 'Nov 06',
        time: '16:15',
        amount: '$ 4700',
      },
    ],
  },
  {
    id: 'andrea-willis-2',
    name: 'Andrea Willis',
    firstName: 'Andrea',
    lastName: 'Willis',
    email: 'andreawillis@gmail.com',
    phone: '999-999-9999',
    address: '1952 Chicago Avenue, Fresno, PA 12345',
    addressLine: '1952 Chicago Avenue',
    city: 'Fresno',
    state: 'PA',
    zipCode: '12345',
    avatar: 'AW',
    recentDeals: [
      {
        id: 'andrea2-deal-1',
        title: '17 Elm Street, Fresno, PA',
        date: 'Nov 12',
        time: '09:30',
        amount: '$ 2800',
      },
      {
        id: 'andrea2-deal-2',
        title: '92 Pine Avenue, Fresno, PA',
        date: 'Nov 09',
        time: '14:00',
        amount: '$ 3300',
      },
      {
        id: 'andrea2-deal-3',
        title: '210 Cedar Road, Fresno, PA',
        date: 'Nov 06',
        time: '16:15',
        amount: '$ 4700',
      },
    ],
  },
  {
    id: 'andrea-willis-3',
    name: 'Andrea Willis',
    firstName: 'Andrea',
    lastName: 'Willis',
    email: 'andreawillis@gmail.com',
    phone: '999-999-9999',
    address: '1952 Chicago Avenue, Fresno, PA 12345',
    addressLine: '1952 Chicago Avenue',
    city: 'Fresno',
    state: 'PA',
    zipCode: '12345',
    avatar: 'AW',
    recentDeals: [
      {
        id: 'andrea3-deal-1',
        title: '17 Elm Street, Fresno, PA',
        date: 'Nov 12',
        time: '09:30',
        amount: '$ 2800',
      },
      {
        id: 'andrea3-deal-2',
        title: '92 Pine Avenue, Fresno, PA',
        date: 'Nov 09',
        time: '14:00',
        amount: '$ 3300',
      },
      {
        id: 'andrea3-deal-3',
        title: '210 Cedar Road, Fresno, PA',
        date: 'Nov 06',
        time: '16:15',
        amount: '$ 4700',
      },
    ],
  },
  {
    id: 'andrea-willis-4',
    name: 'Andrea Willis',
    firstName: 'Andrea',
    lastName: 'Willis',
    email: 'andreawillis@gmail.com',
    phone: '999-999-9999',
    address: '1952 Chicago Avenue, Fresno, PA 12345',
    addressLine: '1952 Chicago Avenue',
    city: 'Fresno',
    state: 'PA',
    zipCode: '12345',
    avatar: 'AW',
    recentDeals: [
      {
        id: 'andrea4-deal-1',
        title: '17 Elm Street, Fresno, PA',
        date: 'Nov 12',
        time: '09:30',
        amount: '$ 2800',
      },
      {
        id: 'andrea4-deal-2',
        title: '92 Pine Avenue, Fresno, PA',
        date: 'Nov 09',
        time: '14:00',
        amount: '$ 3300',
      },
      {
        id: 'andrea4-deal-3',
        title: '210 Cedar Road, Fresno, PA',
        date: 'Nov 06',
        time: '16:15',
        amount: '$ 4700',
      },
    ],
  },
];
