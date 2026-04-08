// config/seed.js — Populate the database with demo data
// Run with: npm run seed
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/uniportal');
  console.log('✅  Connected to MongoDB');

  const { User, Announcement, News, Event, Gallery, Feedback, Registration } = require('../models');

  // Clear collections
  await Promise.all([
    Announcement.deleteMany({}), News.deleteMany({}),
    Event.deleteMany({}),        Gallery.deleteMany({})
  ]);
  console.log('🧹  Cleared existing data');

  // Admin user
  if (!await User.findOne({ studentId: 'ADMIN001' })) {
    await User.create({ studentId:'ADMIN001', firstName:'Admin', lastName:'User', email:'admin@university.edu', password:'Admin@1234', department:'Faculty of Engineering', role:'admin' });
    console.log('👤  Admin created  →  ID: ADMIN001  |  Password: Admin@1234');
  }

  // Demo student
  if (!await User.findOne({ studentId: '2021CS0234' })) {
    await User.create({ studentId:'2021CS0234', firstName:'Kasun', lastName:'Perera', email:'kasun.perera@university.edu', password:'Student@123', department:'Faculty of Engineering', role:'student' });
    console.log('👤  Student created  →  ID: 2021CS0234  |  Password: Student@123');
  }

  // Announcements
  await Announcement.insertMany([
    { title:'Final Exam Timetable Published — Check Now', description:'Semester 2 final examination timetable is now available on the portal. Verify your schedule immediately and report any discrepancies to the Examinations Board by April 5, 2025.', priority:'urgent', badge:'Urgent', department:'Examinations Board', isPinned:true },
    { title:'Semester 2 Course Registration Now Open',    description:'Registration window open March 25 – April 15. Log in to your student account to add or drop courses. Contact your faculty advisor if you need assistance.', priority:'info', badge:'New', department:'Academic Registrar' },
    { title:'Scholarship Application Deadline — April 30',description:'Merit and need-based scholarship applications for 2025/26 academic year close April 30. Visit the Financial Aid Office or apply online.', priority:'warning', badge:'Reminder', department:'Financial Aid' },
    { title:'Library Database Access Extended to All Students', description:'Premium academic databases including Scopus and JSTOR are now free for all registered students. Access via the library portal using your student credentials.', priority:'success', badge:'Info', department:'University Library' },
    { title:'Parking Policy Update — Block C Restricted Zones', description:'Block C parking will be restricted from April 1–14 due to construction works. Alternative parking available at Block F. Campus shuttle service extended during this period.', priority:'info', badge:'Info', department:'Campus Operations' }
  ]);
  console.log('📢  Announcements seeded');

  // News
  await News.insertMany([
    { title:'University Ranked 5th Nationally in Engineering Research Output 2024', content:'The University\'s Faculty of Engineering has achieved a national ranking of 5th for research output in 2024, reflecting the dedication of our faculty and researchers who contributed 312 peer-reviewed publications — a 22% increase over 2023.', summary:'Faculty of Engineering achieves top 5 national ranking.', category:'Academic', imageEmoji:'🏛️', author:'University Communications' },
    { title:'Faculty of Science Awarded $2.4M Grant for Climate Research Initiative', content:'The Faculty of Science has been awarded a $2.4 million research grant for a three-year climate research initiative focusing on tropical ecosystems and sustainable development.', summary:'Major research grant secured for climate science.', category:'Research', imageEmoji:'🔬', author:'Research Office' },
    { title:"Men's Basketball Team Advances to National Championship Quarter-Finals", content:'The University\'s men\'s basketball team has secured a place in the national championship quarter-finals after a decisive 78–62 victory over the defending champions.', summary:'Basketball team reaches national quarter-finals.', category:'Sports', imageEmoji:'🏆', author:'Sports Department' },
    { title:'Convocation Ceremony 2025 Scheduled for June 14–16 at Central Auditorium', content:'The Convocation Ceremony 2025 will be held over three days at the Central Auditorium. All graduating students must confirm their attendance by May 15, 2025 via the student portal.', summary:'Graduation ceremony dates confirmed for June 2025.', category:'Event', imageEmoji:'🎓', author:'Registry' },
    { title:'New Student Services Portal Launched — Access All Requests Online', content:'The IT Department has launched a unified student services portal allowing students to submit all administrative requests online, significantly reducing processing times from 5 days to 24 hours.', summary:'New online portal streamlines student services.', category:'Administrative', imageEmoji:'📋', author:'IT Department' }
  ]);
  console.log('📰  News seeded');

  // Events
  await Event.insertMany([
    { title:'Annual Research Symposium 2025',      description:'The Annual Research Symposium brings together researchers, academics, and students to present and discuss the latest research developments across all faculties. Features keynote addresses, panel discussions, and poster presentations.',  eventDate:new Date('2025-04-12'), startTime:'9:00 AM',  endTime:'5:00 PM', venue:'Main Auditorium, Block A',   capacity:500,  registered:187, theme:'navy',  isFeatured:true,  audience:'Open to all students & staff' },
    { title:'Faculty of Engineering Open Day',     description:'Prospective students and parents are invited to explore the Faculty of Engineering facilities, meet lecturers, and learn about undergraduate and postgraduate degree programmes.',                                                         eventDate:new Date('2025-04-05'), startTime:'9:00 AM',  endTime:'1:00 PM', venue:'Engineering Block, E1–E3',   capacity:300,  registered:94,  theme:'green', isFeatured:true,  audience:'Prospective students welcome' },
    { title:'Sports Complex Inauguration Ceremony',description:'Join us for the official inauguration of the state-of-the-art sports complex featuring Olympic-standard facilities including an aquatic centre, indoor courts, and athletics track.',                                                        eventDate:new Date('2025-03-30'), startTime:'3:00 PM',  endTime:'6:00 PM', venue:'East Campus Sports Complex', capacity:1000, registered:432, theme:'blue', isFeatured:false, audience:'All welcome — free entry' },
    { title:'Career Fair 2025',                    description:'Over 80 leading employers across engineering, finance, healthcare, and technology sectors will be present. Bring multiple copies of your CV and dress professionally.',                                                                      eventDate:new Date('2025-04-20'), startTime:'10:00 AM', endTime:'4:00 PM', venue:'University Sports Hall',     capacity:2000, registered:560, theme:'navy', isFeatured:false, audience:'Final year & postgraduate students' },
    { title:'Cultural Night 2025',                 description:'An evening celebrating the rich cultural diversity of our student community with musical performances, traditional food stalls, dance showcases, and art exhibitions.',                                                                        eventDate:new Date('2025-04-25'), startTime:'6:00 PM',  endTime:'10:00 PM',venue:'Main Auditorium & Foyer',     capacity:800,  registered:312, theme:'navy', isFeatured:false, audience:'All students, staff & guests' }
  ]);
  console.log('📅  Events seeded');

  // Gallery
  await Gallery.insertMany([
    { title:'Convocation 2024',  subtitle:'Main Auditorium · June 2024',   emoji:'🎓', bgClass:'gi-1', category:'Events',    isFeatured:true,  order:1 },
    { title:'Campus Green',      subtitle:'Central Gardens',                emoji:'🌿', bgClass:'gi-2', category:'Campus',    isFeatured:false, order:2 },
    { title:'Sports Complex',    subtitle:'Opened March 2025',              emoji:'🏟️', bgClass:'gi-3', category:'Facilities',isFeatured:false, order:3 },
    { title:'Central Library',   subtitle:'Level 3 Reading Hall',           emoji:'📚', bgClass:'gi-4', category:'Facilities',isFeatured:false, order:4 },
    { title:'Science Labs',      subtitle:'New Research Wing',              emoji:'🔭', bgClass:'gi-5', category:'Academic',  isFeatured:false, order:5 }
  ]);
  console.log('🖼️   Gallery seeded');

  console.log('\n✅  Database seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log('  Demo login credentials:');
  console.log('  Admin    →  ID: ADMIN001      Password: Admin@1234');
  console.log('  Student  →  ID: 2021CS0234    Password: Student@123');
  console.log('─────────────────────────────────────────\n');
  process.exit(0);
}

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
