import { useEffect, useState } from 'react'
import Layout  from '../components/Layout'
import dataApi from '../api/dataApi'

const FALLBACK = [
  { _id:'1', title:'Annual Research Symposium 2025',       eventDate:'2025-04-12', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Main Auditorium, Block A',   theme:'navy',   audience:'Open to all students & staff', capacity:500,  registered:187 },
  { _id:'2', title:'Faculty of Engineering Open Day',      eventDate:'2025-04-05', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Engineering Block, E1-E3',   theme:'green',  audience:'Prospective students welcome', capacity:300,  registered:94  },
  { _id:'3', title:'Sports Complex Inauguration Ceremony', eventDate:'2025-03-30', startTime:'3:00 PM',  endTime:'6:00 PM',  venue:'East Campus Sports Complex',  theme:'blue',   audience:'All welcome - free entry',     capacity:1000, registered:432 },
  { _id:'4', title:'Career Fair 2025',                     eventDate:'2025-04-20', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Convention Centre',           theme:'orange', audience:'Final year students',          capacity:800,  registered:310 },
  { _id:'5', title:'Cultural Night 2025',                  eventDate:'2025-04-25', startTime:'6:00 PM',  endTime:'10:00 PM', venue:'Open Air Theatre',            theme:'navy',   audience:'All students & families',      capacity:1200, registered:620 },
  { _id:'6', title:'International Student Orientation',    eventDate:'2025-05-02', startTime:'8:00 AM',  endTime:'12:00 PM', venue:'Main Hall, Block A',          theme:'green',  audience:'New international students',   capacity:200,  registered:88  },
]

// All events used only in the calendar (full year)
const ALL_CALENDAR_EVENTS = [
  ...FALLBACK,
  { _id:'jan1', title:'New Year Welcome Assembly',           eventDate:'2025-01-08', startTime:'9:00 AM',  endTime:'11:00 AM', venue:'Main Auditorium, Block A',     theme:'navy',   audience:'All students & staff',           capacity:800,  registered:612 },
  { _id:'jan2', title:'Semester 1 Kickoff Mixer',           eventDate:'2025-01-14', startTime:'4:00 PM',  endTime:'7:00 PM',  venue:'Student Union Hall',           theme:'orange', audience:'All students',                   capacity:400,  registered:287 },
  { _id:'jan3', title:'Academic Writing Workshop',          eventDate:'2025-01-21', startTime:'10:00 AM', endTime:'12:00 PM', venue:'Language Centre, Block D',     theme:'green',  audience:'Undergraduate students',         capacity:80,   registered:65  },
  { _id:'jan4', title:'IT Security Awareness Day',          eventDate:'2025-01-28', startTime:'9:00 AM',  endTime:'3:00 PM',  venue:'IT Block, Lab 3',              theme:'blue',   audience:'All students & staff',           capacity:150,  registered:98  },
  { _id:'feb1', title:'Faculty Arts Exhibition Opening',    eventDate:'2025-02-05', startTime:'3:00 PM',  endTime:'7:00 PM',  venue:'Arts Block Gallery',           theme:'orange', audience:'Open to all',                    capacity:300,  registered:189 },
  { _id:'feb2', title:'University Chess Championship',      eventDate:'2025-02-11', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Student Union, Room 2A',       theme:'navy',   audience:'Registered competitors',         capacity:100,  registered:76  },
  { _id:'feb3', title:'Orientation Day - Semester 2',      eventDate:'2025-02-17', startTime:'8:00 AM',  endTime:'12:00 PM', venue:'Main Square & Block A',        theme:'green',  audience:'New & returning students',       capacity:1200, registered:980 },
  { _id:'feb4', title:'Mental Health Awareness Seminar',   eventDate:'2025-02-25', startTime:'11:00 AM', endTime:'1:00 PM',  venue:'Student Services Centre',      theme:'blue',   audience:'All students',                   capacity:120,  registered:88  },
  { _id:'mar1', title:'Inter-Faculty Debate Championship', eventDate:'2025-03-06', startTime:'2:00 PM',  endTime:'6:00 PM',  venue:'Lecture Hall B2',              theme:'orange', audience:'Open to all students',           capacity:350,  registered:280 },
  { _id:'mar2', title:'Tree Planting & Campus Green Day',  eventDate:'2025-03-14', startTime:'8:00 AM',  endTime:'1:00 PM',  venue:'Central Gardens',              theme:'green',  audience:'All students & staff',           capacity:500,  registered:340 },
  { _id:'mar3', title:'End-of-Term Student Assembly',      eventDate:'2025-03-21', startTime:'10:00 AM', endTime:'12:00 PM', venue:'Main Auditorium, Block A',     theme:'navy',   audience:'All students',                   capacity:800,  registered:540 },
  { _id:'apr1', title:'Psychology & Wellbeing Workshop',   eventDate:'2025-04-08', startTime:'11:00 AM', endTime:'1:00 PM',  venue:'Student Services Centre',      theme:'blue',   audience:'All students',                   capacity:120,  registered:75  },
  { _id:'apr2', title:'Science & Technology Expo',         eventDate:'2025-04-17', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'Science Block Atrium',         theme:'orange', audience:'Open to all',                    capacity:600,  registered:310 },
  { _id:'apr3', title:'Photography Walk - Campus Heritage',eventDate:'2025-04-22', startTime:'8:00 AM',  endTime:'11:00 AM', venue:'Central Gardens',              theme:'green',  audience:'Media club members & guests',    capacity:60,   registered:38  },
  { _id:'may1', title:'Faculty Sports Day',                eventDate:'2025-05-10', startTime:'8:00 AM',  endTime:'5:00 PM',  venue:'University Sports Grounds',    theme:'orange', audience:'All faculties welcome',           capacity:2000, registered:870 },
  { _id:'may2', title:'Entrepreneurship Summit 2025',      eventDate:'2025-05-14', startTime:'9:00 AM',  endTime:'6:00 PM',  venue:'Business School, Block F',     theme:'navy',   audience:'Students & industry guests',     capacity:400,  registered:195 },
  { _id:'may3', title:'Finals Week Study Bootcamp',        eventDate:'2025-05-19', startTime:'8:00 AM',  endTime:'8:00 PM',  venue:'Central Library - All Floors', theme:'blue',   audience:'All students',                   capacity:500,  registered:422 },
  { _id:'may4', title:'Graduation Rehearsal',              eventDate:'2025-05-24', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Main Auditorium, Block A',     theme:'green',  audience:'Graduating students only',       capacity:600,  registered:547 },
  { _id:'may5', title:'Alumni Networking Evening',         eventDate:'2025-05-28', startTime:'5:00 PM',  endTime:'9:00 PM',  venue:'Faculty Club, Block H',        theme:'navy',   audience:'Final year & postgrad students', capacity:250,  registered:130 },
  { _id:'jun1', title:'Convocation Ceremony 2025',         eventDate:'2025-06-06', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'Graduates, staff & families',   capacity:1500, registered:1180},
  { _id:'jun2', title:'Mid-Year Open Campus Day',          eventDate:'2025-06-12', startTime:'10:00 AM', endTime:'3:00 PM',  venue:'Entire Campus',                theme:'orange', audience:'Prospective students & public',  capacity:3000, registered:940 },
  { _id:'jun3', title:'Postgraduate Research Colloquium',  eventDate:'2025-06-19', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Research Centre, Block G',     theme:'blue',   audience:'Postgraduate students & staff', capacity:180,  registered:102 },
  { _id:'jun4', title:'Year-End Cultural Showcase',        eventDate:'2025-06-27', startTime:'5:00 PM',  endTime:'10:00 PM', venue:'Open Air Theatre',             theme:'green',  audience:'All students & families',        capacity:1200, registered:720 },
  { _id:'jul1', title:'Winter School - Data Science',      eventDate:'2025-07-07', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'IT Block, Lab 1 & 2',          theme:'blue',   audience:'All students',                   capacity:120,  registered:87  },
  { _id:'jul2', title:'Community Outreach Volunteer Day',  eventDate:'2025-07-15', startTime:'7:00 AM',  endTime:'2:00 PM',  venue:'Meet at Main Gate',            theme:'green',  audience:'All students & staff',           capacity:200,  registered:134 },
  { _id:'jul3', title:'Mid-Year Film Festival',            eventDate:'2025-07-22', startTime:'5:00 PM',  endTime:'10:00 PM', venue:'Open Air Theatre',             theme:'navy',   audience:'All students & public',          capacity:600,  registered:290 },
  { _id:'jul4', title:'Coding Hackathon 24hr',             eventDate:'2025-07-26', startTime:'9:00 AM',  endTime:'9:00 AM',  venue:'IT Block, Labs 1-4',           theme:'orange', audience:'All students - team of 3-5',     capacity:300,  registered:156 },
  { _id:'aug1', title:'Semester 2 Welcome Back Carnival',  eventDate:'2025-08-04', startTime:'12:00 PM', endTime:'6:00 PM',  venue:'Main Square',                  theme:'orange', audience:'All students',                   capacity:2000, registered:1100},
  { _id:'aug2', title:'Language Exchange Social',          eventDate:'2025-08-12', startTime:'3:00 PM',  endTime:'6:00 PM',  venue:'Student Union Courtyard',      theme:'green',  audience:'All students',                   capacity:150,  registered:88  },
  { _id:'aug3', title:'Engineering Robotics Showcase',     eventDate:'2025-08-19', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Engineering Block, E1',        theme:'blue',   audience:'Open to all',                    capacity:400,  registered:215 },
  { _id:'aug4', title:'Postgraduate Info Evening',         eventDate:'2025-08-26', startTime:'5:00 PM',  endTime:'7:30 PM',  venue:'Research Centre, Block G',     theme:'navy',   audience:'Final year & honours students',  capacity:200,  registered:140 },
  { _id:'sep1', title:'Faculty Open Lecture - AI & Society',eventDate:'2025-09-04', startTime:'2:00 PM', endTime:'4:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'Open to all',                    capacity:500,  registered:320 },
  { _id:'sep2', title:'Student Government Elections',      eventDate:'2025-09-10', startTime:'8:00 AM',  endTime:'5:00 PM',  venue:'Online & Student Union',       theme:'orange', audience:'All enrolled students',          capacity:5000, registered:2100},
  { _id:'sep3', title:'International Food Festival',       eventDate:'2025-09-18', startTime:'11:00 AM', endTime:'8:00 PM',  venue:'Main Square',                  theme:'green',  audience:'All students & public',          capacity:3000, registered:1800},
  { _id:'sep4', title:'Law Moot Court Competition',        eventDate:'2025-09-25', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Faculty of Law, Block L',      theme:'blue',   audience:'Law students & observers',       capacity:150,  registered:98  },
  { _id:'oct1', title:'World Mental Health Day Walk',      eventDate:'2025-10-10', startTime:'7:00 AM',  endTime:'10:00 AM', venue:'University Track',             theme:'green',  audience:'All students & staff',           capacity:500,  registered:310 },
  { _id:'oct2', title:'Entrepreneurship Pitch Competition',eventDate:'2025-10-16', startTime:'10:00 AM', endTime:'5:00 PM',  venue:'Business School, Block F',     theme:'orange', audience:'All students',                   capacity:300,  registered:175 },
  { _id:'oct3', title:'Annual Science Quiz Bowl',          eventDate:'2025-10-22', startTime:'1:00 PM',  endTime:'5:00 PM',  venue:'Science Block, Lecture Hall 1',theme:'navy',   audience:'All students - teams of 4',      capacity:200,  registered:136 },
  { _id:'oct4', title:'Intercultural Dialogue Forum',      eventDate:'2025-10-30', startTime:'2:00 PM',  endTime:'5:00 PM',  venue:'Student Union Hall',           theme:'blue',   audience:'All students',                   capacity:180,  registered:99  },
  { _id:'nov1', title:'Research Poster Exhibition',        eventDate:'2025-11-06', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Library Atrium',               theme:'blue',   audience:'Open to all',                    capacity:400,  registered:210 },
  { _id:'nov2', title:'University Football Finals',        eventDate:'2025-11-14', startTime:'3:00 PM',  endTime:'6:00 PM',  venue:'University Stadium',           theme:'green',  audience:'All students & families',        capacity:2500, registered:1900},
  { _id:'nov3', title:'Careers in Medicine Symposium',     eventDate:'2025-11-20', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'Medical Faculty, Block M',     theme:'navy',   audience:'Pre-med & health science students',capacity:250,registered:188 },
  { _id:'nov4', title:'End-of-Year Talent Show',           eventDate:'2025-11-28', startTime:'6:00 PM',  endTime:'10:00 PM', venue:'Open Air Theatre',             theme:'orange', audience:'All students & families',        capacity:1000, registered:750 },
  { _id:'dec1', title:'Final Exams Prep Masterclass',      eventDate:'2025-12-03', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Central Library, Floor 2',     theme:'blue',   audience:'All students',                   capacity:300,  registered:265 },
  { _id:'dec2', title:'Graduation Gala Dinner',            eventDate:'2025-12-10', startTime:'6:00 PM',  endTime:'11:00 PM', venue:'University Grand Hall',        theme:'navy',   audience:'Graduating students & guests',   capacity:700,  registered:610 },
  { _id:'dec3', title:'Year-End Staff & Student Awards',   eventDate:'2025-12-17', startTime:'4:00 PM',  endTime:'7:00 PM',  venue:'Main Auditorium, Block A',     theme:'orange', audience:'All students & staff',           capacity:600,  registered:420 },
  // ── January 2026 ──
  { _id:'26jan1', title:'Semester 1 Welcome Assembly',        eventDate:'2026-01-07', startTime:'9:00 AM',  endTime:'11:00 AM', venue:'Main Auditorium, Block A',     theme:'navy',   audience:'All students & staff',           capacity:900,  registered:0 },
  { _id:'26jan2', title:'Study Skills Bootcamp',              eventDate:'2026-01-13', startTime:'10:00 AM', endTime:'1:00 PM',  venue:'Central Library, Floor 2',     theme:'blue',   audience:'All undergraduate students',     capacity:150,  registered:0 },
  { _id:'26jan3', title:'Campus Photography Contest Launch',  eventDate:'2026-01-20', startTime:'3:00 PM',  endTime:'5:00 PM',  venue:'Arts Block Gallery',           theme:'green',  audience:'All students',                   capacity:200,  registered:0 },
  { _id:'26jan4', title:'Industry Networking Breakfast',      eventDate:'2026-01-27', startTime:'8:00 AM',  endTime:'11:00 AM', venue:'Faculty Club, Block H',        theme:'orange', audience:'Final year students',            capacity:120,  registered:0 },
  // ── February 2026 ──
  { _id:'26feb1', title:'Faculty Research Open Day',          eventDate:'2026-02-04', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'Research Centre, Block G',     theme:'blue',   audience:'All students & staff',           capacity:300,  registered:0 },
  { _id:'26feb2', title:'University Debating Finals',         eventDate:'2026-02-10', startTime:'2:00 PM',  endTime:'6:00 PM',  venue:'Lecture Hall B2',              theme:'navy',   audience:'Open to all students',           capacity:350,  registered:0 },
  { _id:'26feb3', title:'Semester 2 Orientation',             eventDate:'2026-02-16', startTime:'8:00 AM',  endTime:'12:00 PM', venue:'Main Square & Block A',        theme:'green',  audience:'New & returning students',       capacity:1200, registered:0 },
  { _id:'26feb4', title:'Wellbeing & Mindfulness Workshop',   eventDate:'2026-02-24', startTime:'11:00 AM', endTime:'1:00 PM',  venue:'Student Services Centre',      theme:'orange', audience:'All students',                   capacity:100,  registered:0 },
  // ── March 2026 ──
  { _id:'26mar1', title:'Women in STEM Symposium',            eventDate:'2026-03-05', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Engineering Block, E1',        theme:'blue',   audience:'All students & staff',           capacity:400,  registered:0 },
  { _id:'26mar2', title:'Campus Green Sustainability Fair',   eventDate:'2026-03-12', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Central Gardens',              theme:'green',  audience:'Open to all',                    capacity:600,  registered:0 },
  { _id:'26mar3', title:'Inter-Faculty Sports Tournament',    eventDate:'2026-03-19', startTime:'8:00 AM',  endTime:'6:00 PM',  venue:'University Sports Grounds',    theme:'orange', audience:'All faculties',                  capacity:1500, registered:0 },
  { _id:'26mar4', title:'End-of-Term Academic Awards',        eventDate:'2026-03-27', startTime:'4:00 PM',  endTime:'7:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'All students & staff',           capacity:700,  registered:0 },
  // ── April 2026 ──
  { _id:'26apr1', title:'Annual Research Symposium 2026',     eventDate:'2026-04-09', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'Open to all students & staff',   capacity:500,  registered:0 },
  { _id:'26apr2', title:'Engineering Innovation Expo',        eventDate:'2026-04-14', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'Engineering Block, E1-E3',     theme:'blue',   audience:'Open to all',                    capacity:600,  registered:0 },
  { _id:'26apr3', title:'Career Fair 2026',                   eventDate:'2026-04-19', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Convention Centre',            theme:'orange', audience:'Final year students',            capacity:800,  registered:0 },
  { _id:'26apr4', title:'Cultural Night 2026',                eventDate:'2026-04-24', startTime:'6:00 PM',  endTime:'10:00 PM', venue:'Open Air Theatre',             theme:'green',  audience:'All students & families',        capacity:1200, registered:0 },
  // ── May 2026 ──
  { _id:'26may1', title:'International Student Orientation',  eventDate:'2026-05-04', startTime:'8:00 AM',  endTime:'12:00 PM', venue:'Main Hall, Block A',           theme:'green',  audience:'New international students',     capacity:200,  registered:0 },
  { _id:'26may2', title:'Faculty Sports Day 2026',            eventDate:'2026-05-09', startTime:'8:00 AM',  endTime:'5:00 PM',  venue:'University Sports Grounds',    theme:'orange', audience:'All faculties welcome',          capacity:2000, registered:0 },
  { _id:'26may3', title:'Entrepreneurship Summit 2026',       eventDate:'2026-05-13', startTime:'9:00 AM',  endTime:'6:00 PM',  venue:'Business School, Block F',     theme:'navy',   audience:'Students & industry guests',     capacity:400,  registered:0 },
  { _id:'26may4', title:'Postgraduate Research Showcase',     eventDate:'2026-05-21', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Research Centre, Block G',     theme:'blue',   audience:'Postgrad students & staff',      capacity:250,  registered:0 },
  { _id:'26may5', title:'Graduation Rehearsal 2026',          eventDate:'2026-05-28', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Main Auditorium, Block A',     theme:'green',  audience:'Graduating students only',       capacity:600,  registered:0 },
  // ── June 2026 ──
  { _id:'26jun1', title:'Convocation Ceremony 2026',          eventDate:'2026-06-05', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'Graduates, staff & families',   capacity:1500, registered:0 },
  { _id:'26jun2', title:'Mid-Year Open Campus Day',           eventDate:'2026-06-11', startTime:'10:00 AM', endTime:'3:00 PM',  venue:'Entire Campus',                theme:'orange', audience:'Prospective students & public',  capacity:3000, registered:0 },
  { _id:'26jun3', title:'Language & Culture Festival',        eventDate:'2026-06-18', startTime:'11:00 AM', endTime:'8:00 PM',  venue:'Main Square',                  theme:'green',  audience:'All students & public',          capacity:2000, registered:0 },
  { _id:'26jun4', title:'Alumni Homecoming Evening',          eventDate:'2026-06-26', startTime:'5:00 PM',  endTime:'10:00 PM', venue:'University Grand Hall',        theme:'blue',   audience:'Alumni, staff & final year',    capacity:800,  registered:0 },
  // ── July 2026 ──
  { _id:'26jul1', title:'Winter School — Machine Learning',   eventDate:'2026-07-06', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'IT Block, Lab 1 & 2',          theme:'blue',   audience:'All students',                   capacity:120,  registered:0 },
  { _id:'26jul2', title:'Community Service Volunteer Day',    eventDate:'2026-07-14', startTime:'7:00 AM',  endTime:'2:00 PM',  venue:'Meet at Main Gate',            theme:'green',  audience:'All students & staff',           capacity:200,  registered:0 },
  { _id:'26jul3', title:'Startup Pitch Night',                eventDate:'2026-07-21', startTime:'5:00 PM',  endTime:'9:00 PM',  venue:'Business School, Block F',     theme:'orange', audience:'All students',                   capacity:300,  registered:0 },
  { _id:'26jul4', title:'Interfaculty Hackathon 2026',        eventDate:'2026-07-25', startTime:'9:00 AM',  endTime:'9:00 AM',  venue:'IT Block, Labs 1-4',           theme:'navy',   audience:'All students — team of 3-5',     capacity:300,  registered:0 },
  // ── August 2026 ──
  { _id:'26aug1', title:'Semester 2 Welcome Back Carnival',   eventDate:'2026-08-03', startTime:'12:00 PM', endTime:'6:00 PM',  venue:'Main Square',                  theme:'orange', audience:'All students',                   capacity:2000, registered:0 },
  { _id:'26aug2', title:'Creative Writing Workshop',          eventDate:'2026-08-11', startTime:'10:00 AM', endTime:'1:00 PM',  venue:'Language Centre, Block D',     theme:'green',  audience:'All students',                   capacity:80,   registered:0 },
  { _id:'26aug3', title:'Medical Sciences Open Lab Day',      eventDate:'2026-08-18', startTime:'10:00 AM', endTime:'3:00 PM',  venue:'Medical Faculty, Block M',     theme:'blue',   audience:'Open to all',                    capacity:200,  registered:0 },
  { _id:'26aug4', title:'Postgraduate Info & Open Evening',   eventDate:'2026-08-25', startTime:'5:00 PM',  endTime:'7:30 PM',  venue:'Research Centre, Block G',     theme:'navy',   audience:'Final year & honours students',  capacity:200,  registered:0 },
  // ── September 2026 ──
  { _id:'26sep1', title:'Faculty Lecture — Future of Work',   eventDate:'2026-09-03', startTime:'2:00 PM',  endTime:'4:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'Open to all',                    capacity:500,  registered:0 },
  { _id:'26sep2', title:'Student Government Elections 2026',  eventDate:'2026-09-09', startTime:'8:00 AM',  endTime:'5:00 PM',  venue:'Online & Student Union',       theme:'orange', audience:'All enrolled students',          capacity:5000, registered:0 },
  { _id:'26sep3', title:'International Food & Culture Fair',  eventDate:'2026-09-17', startTime:'11:00 AM', endTime:'8:00 PM',  venue:'Main Square',                  theme:'green',  audience:'All students & public',          capacity:3000, registered:0 },
  { _id:'26sep4', title:'Business Case Competition',          eventDate:'2026-09-24', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'Business School, Block F',     theme:'blue',   audience:'Business & commerce students',   capacity:200,  registered:0 },
  // ── October 2026 ──
  { _id:'26oct1', title:'Mental Health Awareness Week Kick-off',eventDate:'2026-10-05',startTime:'9:00 AM', endTime:'12:00 PM', venue:'Student Services Centre',      theme:'green',  audience:'All students & staff',           capacity:300,  registered:0 },
  { _id:'26oct2', title:'Innovation & Tech Expo 2026',        eventDate:'2026-10-13', startTime:'9:00 AM',  endTime:'5:00 PM',  venue:'IT Block & Engineering Block', theme:'blue',   audience:'Open to all',                    capacity:800,  registered:0 },
  { _id:'26oct3', title:'Intercampus Athletics Meet',         eventDate:'2026-10-20', startTime:'8:00 AM',  endTime:'6:00 PM',  venue:'University Stadium',           theme:'orange', audience:'All students & supporters',      capacity:3000, registered:0 },
  { _id:'26oct4', title:'Annual Law Symposium',               eventDate:'2026-10-29', startTime:'9:00 AM',  endTime:'4:00 PM',  venue:'Faculty of Law, Block L',      theme:'navy',   audience:'Law students & public',          capacity:300,  registered:0 },
  // ── November 2026 ──
  { _id:'26nov1', title:'Research Poster Exhibition 2026',    eventDate:'2026-11-05', startTime:'10:00 AM', endTime:'4:00 PM',  venue:'Library Atrium',               theme:'blue',   audience:'Open to all',                    capacity:400,  registered:0 },
  { _id:'26nov2', title:'University Football Finals 2026',    eventDate:'2026-11-12', startTime:'3:00 PM',  endTime:'6:00 PM',  venue:'University Stadium',           theme:'green',  audience:'All students & families',        capacity:2500, registered:0 },
  { _id:'26nov3', title:'Science & Society Public Lecture',   eventDate:'2026-11-19', startTime:'6:00 PM',  endTime:'8:00 PM',  venue:'Main Auditorium, Block A',     theme:'navy',   audience:'Open to all',                    capacity:500,  registered:0 },
  { _id:'26nov4', title:'End-of-Year Talent Show 2026',       eventDate:'2026-11-27', startTime:'6:00 PM',  endTime:'10:00 PM', venue:'Open Air Theatre',             theme:'orange', audience:'All students & families',        capacity:1000, registered:0 },
  // ── December 2026 ──
  { _id:'26dec1', title:'Final Exams Prep Masterclass',       eventDate:'2026-12-02', startTime:'9:00 AM',  endTime:'1:00 PM',  venue:'Central Library, Floor 2',     theme:'blue',   audience:'All students',                   capacity:300,  registered:0 },
  { _id:'26dec2', title:'Graduation Gala Dinner 2026',        eventDate:'2026-12-09', startTime:'6:00 PM',  endTime:'11:00 PM', venue:'University Grand Hall',        theme:'navy',   audience:'Graduating students & guests',   capacity:700,  registered:0 },
  { _id:'26dec3', title:'Year-End Staff & Student Awards',    eventDate:'2026-12-16', startTime:'4:00 PM',  endTime:'7:00 PM',  venue:'Main Auditorium, Block A',     theme:'orange', audience:'All students & staff',           capacity:600,  registered:0 },
]

const themeGrad = {
  navy:   'from-primary to-primary-light',
  green:  'from-green-900 to-unigreen',
  blue:   'from-sky-900 to-sky-500',
  orange: 'from-orange-900 to-accent',
}

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function CalendarModal({ events, onClose, onSelectEvent }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const eventMap = {}
  events.forEach(e => {
    const key = e.eventDate.slice(0,10)
    if (!eventMap[key]) eventMap[key] = []
    eventMap[key].push(e)
  })

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const monthEvents = events
    .filter(e => { const d = new Date(e.eventDate); return d.getFullYear() === year && d.getMonth() === month })
    .sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate))

  const themeColor = { navy:'bg-primary', green:'bg-unigreen', blue:'bg-sky-500', orange:'bg-orange-500' }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box p-0 w-full max-w-lg overflow-hidden" style={{ maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light px-5 py-4 flex items-center justify-between">
          <div className="text-white font-display font-bold text-base">Event Calendar</div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs hover:bg-white/30">✕</button>
        </div>

        <div className="p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold transition-colors">‹</button>
            <div className="font-display font-bold text-slate-900 text-base">{MONTHS[month]} {year}</div>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold transition-colors">›</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />
              const dateStr  = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const isToday  = dateStr === todayStr
              const dayEvts  = eventMap[dateStr] || []
              const hasEvent = dayEvts.length > 0

              return (
                <div
                  key={dateStr}
                  onClick={() => hasEvent && onSelectEvent(dayEvts[0])}
                  className={`
                    relative rounded-lg p-1.5 min-h-[44px] flex flex-col items-center
                    ${hasEvent ? 'cursor-pointer hover:bg-primary-pale' : ''}
                    ${isToday  ? 'bg-primary-pale ring-1 ring-primary/40' : ''}
                  `}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold leading-none ${isToday ? 'bg-primary text-white' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  {dayEvts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayEvts.slice(0,3).map((ev,idx) => (
                        <span key={idx} className={`w-1.5 h-1.5 rounded-full ${themeColor[ev.theme] || 'bg-primary'}`} />
                      ))}
                      {dayEvts.length > 3 && <span className="text-[8px] text-primary font-bold">+{dayEvts.length-3}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 px-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Today
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-unigreen inline-block" /> Event
            </div>
            <div className="text-[10px] text-slate-300 ml-auto">Click a dot to see details</div>
          </div>

          {/* Events this month */}
          {monthEvents.length > 0 ? (
            <div className="mt-5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{MONTHS[month]} Events</div>
              <div className="space-y-2">
                {monthEvents.map(ev => {
                  const d = new Date(ev.eventDate)
                  return (
                    <div
                      key={ev._id}
                      onClick={() => onSelectEvent(ev)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-primary/25 hover:bg-primary-pale cursor-pointer transition-all"
                    >
                      <div className={`bg-gradient-to-br ${themeGrad[ev.theme]||themeGrad.navy} w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0`}>
                        <div className="text-white text-sm font-extrabold leading-none">{d.getDate()}</div>
                        <div className="text-white/80 text-[8px] font-bold">{d.toLocaleString('default',{month:'short'}).toUpperCase()}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{ev.title}</div>
                        <div className="text-[10px] text-slate-400">{ev.startTime}{ev.endTime ? ' – '+ev.endTime : ''} · {ev.venue}</div>
                      </div>
                      <span className="text-primary text-xs">›</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-5 text-center py-6 text-sm text-slate-400">
              No events scheduled for {MONTHS[month]} {year}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  const [events,       setEvents]       = useState(FALLBACK)
  const [selected,     setSelected]     = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => { dataApi.getEvents(6).then(d => d.length && setEvents(d)) }, [])

  const sorted = [...events].sort((a,b) => new Date(a.eventDate) - new Date(b.eventDate))

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-unigreen block"/>
          Upcoming Events
        </h2>
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-pale px-3 py-1.5 rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          <span>📅</span> Full calendar
        </button>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-6 flex items-center gap-3">
        <span className="text-xl">🎓</span>
        <div className="text-xs text-amber-800">
          <span className="font-bold">All events are open to every university student</span> — just show up! No prior registration needed.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(e => {
          const dt    = new Date(e.eventDate)
          const day   = dt.getDate()
          const mon   = dt.toLocaleString('default', { month:'short' }).toUpperCase()
          const seats = e.capacity - e.registered

          return (
            <div key={e._id} className="card p-0 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
              onClick={() => setSelected(e)}>
              <div className={`bg-gradient-to-br ${themeGrad[e.theme]||themeGrad.navy} p-4 flex items-start gap-3 relative overflow-hidden`}>
                <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-white/7" />
                <div className="bg-white/20 backdrop-blur-sm border border-white/22 rounded-xl w-12 text-center py-1.5 flex-shrink-0 text-white">
                  <div className="text-xl font-extrabold leading-none">{day}</div>
                  <div className="text-[8.5px] font-bold uppercase tracking-wider opacity-85">{mon}</div>
                </div>
                <div className="text-white font-bold text-sm leading-snug relative z-10">{e.title}</div>
              </div>
              <div className="p-4 space-y-1.5">
                {[['🕘', `${e.startTime}${e.endTime ? ' – '+e.endTime : ''}`], ['📍', e.venue], ['👥', e.audience]].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[9px]">{icon}</span>
                    {text}
                  </div>
                ))}
                {seats > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[9px]">💺</span>
                    <span className="badge badge-green text-[9px] px-2">{seats} seats left</span>
                  </div>
                )}
                <button
                  onClick={ev => { ev.stopPropagation(); setSelected(e) }}
                  className="w-full mt-2 py-2 text-xs font-bold bg-primary-pale text-primary border border-primary/18 rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  View Details →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Event detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-display text-lg font-bold">Event Details</div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs hover:bg-slate-200">✕</button>
            </div>
            <div className="bg-primary-pale border-l-4 border-primary rounded-xl p-4 mb-4">
              <div className="font-bold text-primary text-sm mb-1">{selected.title}</div>
              <div className="text-xs text-slate-500">
                {new Date(selected.eventDate).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · {selected.startTime}{selected.endTime ? ' – '+selected.endTime : ''}
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-1.5">
              <div><strong>Venue:</strong> {selected.venue}</div>
              <div><strong>Audience:</strong> {selected.audience}</div>
              <div><strong>Capacity:</strong> {selected.capacity} seats</div>
              <div><strong>Registered:</strong> {selected.registered} ({selected.capacity - selected.registered} remaining)</div>
              <div className="mt-3 rounded-xl bg-green-50 border border-green-100 px-3 py-2 text-xs text-green-700 font-medium">
                🎓 Open to all university students — no registration required
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setSelected(null)} className="btn-primary flex-1 py-2.5 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar modal */}
      {showCalendar && (
        <CalendarModal
          events={ALL_CALENDAR_EVENTS}
          onClose={() => setShowCalendar(false)}
          onSelectEvent={ev => { setShowCalendar(false); setSelected(ev) }}
        />
      )}
    </Layout>
  )
}