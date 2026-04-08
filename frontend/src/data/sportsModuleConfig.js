export const moduleNavLinks = [
  { label: 'Overview', to: '/dashboard/module', end: true },
  { label: 'Directory', to: '/dashboard/module/directory' },
  { label: 'Join Directory', to: '/dashboard/module/join' },
  { label: 'Matches', to: '/dashboard/module/matches' },
  { label: 'Players', to: '/dashboard/module/players' },
  { label: 'Facilities', to: '/dashboard/module/facilities' }
]

export const moduleFeatureHighlights = [
  {
    title: 'Sports, Clubs & Teams',
    description: 'Browse every team or community in one secured internal module.',
    icon: 'Arena'
  },
  {
    title: 'Directory Management',
    description: 'Keep captains, presidents, and support contacts current with editable records.',
    icon: 'Contacts'
  },
  {
    title: 'Fixtures & Results',
    description: 'Publish live, upcoming, and completed matches through the same backend.',
    icon: 'Matches'
  },
  {
    title: 'Player Profiles',
    description: 'Track player roles, sports, and leadership contacts in one searchable space.',
    icon: 'Players'
  },
  {
    title: 'Facilities Availability',
    description: 'Manage grounds, courts, and gym slot visibility from the dashboard.',
    icon: 'Facilities'
  },
  {
    title: 'Stored Inquiries',
    description: 'Contact actions are authenticated and written through the backend instead of mocked.',
    icon: 'Inquiries'
  }
]

export const matchStatusOptions = [
  { label: 'Live', value: 'live' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Result', value: 'result' }
]

export const playerRoleOptions = ['Captain', 'Vice Captain', 'Member']
export const facilityStatusOptions = ['Open', 'Limited', 'Booked']

export const createEmptyContact = () => ({
  name: '',
  email: '',
  phone: ''
})

export const createEmptySportForm = () => ({
  name: '',
  icon: '',
  team: '',
  description: '',
  captain: createEmptyContact(),
  viceCaptain: createEmptyContact()
})

export const createEmptyClubForm = () => ({
  name: '',
  icon: '',
  description: '',
  president: createEmptyContact(),
  secretary: createEmptyContact()
})

export const createEmptyMatchForm = () => ({
  sport: '',
  homeTeam: '',
  awayTeam: '',
  score: '',
  status: 'upcoming',
  liveNote: '',
  date: '',
  time: '',
  venue: ''
})

export const createEmptyPlayerForm = () => ({
  name: '',
  sport: '',
  role: 'Member',
  email: '',
  phone: '',
  batch: ''
})

export const createEmptyFacilityForm = () => ({
  facility: '',
  description: '',
  slots: [
    {
      time: '',
      status: 'Open'
    }
  ]
})
