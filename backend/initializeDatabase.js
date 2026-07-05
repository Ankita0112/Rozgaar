const Job = require("./models/job");
const User = require("./models/user");

const categories = [
  "ELECTRICIAN",
  "PLUMBER",
  "MECHANIC",
  "COOK",
  "PEON",
  "DRIVER",
  "MAID",
  "LABOUR",
  "SECURITY GUARD",
];

const locations = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

const jobTitles = {
  ELECTRICIAN: [
    "Bharat Heavy Electricals",
    "Harman Electronics",
    "Siemens India",
    "ABB India",
    "Schneider Electric",
    "Philips India",
    "Havells India",
    "Crompton Greaves",
    "Eaton Industries",
    "Bajaj Electricals",
  ],
  PLUMBER: [
    "Jaquar Group",
    "Hindware Homes",
    "Kohler India",
    "American Standard",
    "Grohe India",
    "Cera Sanitaryware",
    "Ashirvad Pipes",
    "Finolex Industries",
    "Supreme Pipes",
    "Ambi Plumbing",
  ],
  MECHANIC: [
    "Raj Sports Academy",
    "Shiva Automobiles",
    "Siraj Garages",
    "ABC Mechanics",
    "XYZ Auto Repair",
    "Premier Auto Works",
    "Elite Service Center",
    "Quick Fix Garage",
    "Pro Mechanics",
    "Expert Auto Care",
  ],
  COOK: [
    "Ryan Public School",
    "Taj Hotel Group",
    "ITC Hotels",
    "Oberoi Hotels",
    "Marriott International",
    "Hilton Hotels",
    "Radisson Blu",
    "Le Meridien",
    "Hyatt Hotels",
    "Novotel India",
  ],
  PEON: [
    "Government Office",
    "Municipal Corporation",
    "District Administration",
    "State Government",
    "Federal Bank",
    "ICICI Bank",
    "HDFC Bank",
    "Axis Bank",
    "SBI Bank",
    "PNB Bank",
  ],
  DRIVER: [
    "Uber India",
    "Ola Cabs",
    "Meru Cabs",
    "ATS Logistics",
    "TCI Express",
    "Allcargo Logistics",
    "Blue Dart Express",
    "DHL India",
    "FedEx India",
    "Professional Transport",
  ],
  MAID: [
    "Residential Complex A",
    "Residential Complex B",
    "Apartment Society C",
    "Housing Colony D",
    "Gated Community E",
    "Smart City F",
    "Urban Community G",
    "Premium Residency H",
    "Luxury Apartments I",
    "Modern Housing J",
  ],
  LABOUR: [
    "Construction Company A",
    "Building Contractors B",
    "Civil Works C",
    "Infrastructure D",
    "Development Project E",
    "Construction Firm F",
    "Civil Engineering G",
    "Building Services H",
    "Project Works I",
    "Construction Solutions J",
  ],
  "SECURITY GUARD": [
    "Allsec Technologies",
    "Allied Security",
    "Guardwell Security",
    "SecurePoint Services",
    "Elite Security",
    "Guardian Services",
    "Safe Zone Security",
    "Professional Guards",
    "Security Solutions",
    "Vigilant Services",
  ],
};

const candidateNames = {
  ELECTRICIAN: [
    "Rajesh Kumar",
    "Amit Patel",
    "Vikram Singh",
    "Arjun Sharma",
    "Karan Malik",
    "Suresh Kumar",
    "Ravi Tiwari",
    "Deepak Gupta",
    "Nitin Mishra",
    "Ajay Verma",
  ],
  PLUMBER: [
    "Pradeep Kumar",
    "Sandeep Rao",
    "Anand Reddy",
    "Vikas Nair",
    "Mahesh Desai",
    "Sanjay Joshi",
    "Harish Kumar",
    "Ramesh Iyer",
    "Mohan Rao",
    "Venkat Kumar",
  ],
  MECHANIC: [
    "Varun Singh",
    "Ashok Kumar",
    "Rohit Sharma",
    "Mukesh Patel",
    "Sunil Verma",
    "Anil Kumar",
    "Rajesh Sinha",
    "Anuj Yadav",
    "Gaurav Pandey",
    "Vinod Kumar",
  ],
  COOK: [
    "Ramesh Kumar",
    "Mahendra Singh",
    "Yogesh Rao",
    "Saurabh Patel",
    "Rishabh Gupta",
    "Aryan Nair",
    "Vikram Joshi",
    "Sameer Khan",
    "Imran Ahmed",
    "Fahad Hussein",
  ],
  PEON: [
    "Manish Kumar",
    "Shankar Rao",
    "Tulsi Das",
    "Govind Singh",
    "Mohan Lal",
    "Ram Bahadur",
    "Bishnu Prasad",
    "Niranjan Kumar",
    "Sushil Kumar",
    "Ashish Singh",
  ],
  DRIVER: [
    "Ravi Kumar",
    "Prakash Singh",
    "Jagjit Yadav",
    "Saurav Mishra",
    "Anand Kumar",
    "Arun Patel",
    "Vineet Sharma",
    "Ajit Kumar",
    "Sudhir Singh",
    "Jitendra Verma",
  ],
  MAID: [
    "Sunita Devi",
    "Savitri Singh",
    "Padma Kumari",
    "Geeta Das",
    "Rupa Nair",
    "Meera Patel",
    "Lakshmi Rao",
    "Priya Sharma",
    "Divya Kumar",
    "Anjali Singh",
  ],
  LABOUR: [
    "Suresh Yadav",
    "Ramesh Prasad",
    "Durga Prasad",
    "Mohan Das",
    "Shashi Kumar",
    "Balaji Rao",
    "Hari Singh",
    "Vijay Kumar",
    "Rajesh Patel",
    "Nitish Yadav",
  ],
  "SECURITY GUARD": [
    "Harpal Singh",
    "Simran Kaur",
    "Gurvinder Sharma",
    "Jatinder Patel",
    "Paramjit Singh",
    "Kuldeep Rao",
    "Baljeet Kumar",
    "Raman Singh",
    "Preet Kaur",
    "Bikram Sharma",
  ],
};

const generatePhoneNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const generateAadhar = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const initializeDatabase = async () => {
  try {
    // Check if database is already seeded
    const jobCount = await Job.countDocuments();
    const userCount = await User.countDocuments();

    if (jobCount > 0 && userCount > 0) {
      console.log("✓ Database already seeded. Skipping initialization.");
      return;
    }

    console.log("Initializing database with dummy data...");

    // Seed jobs
    let addedJobs = 0;
    for (const category of categories) {
      for (let i = 0; i < 10; i++) {
        const job = new Job({
          title: jobTitles[category][i],
          category,
          location: locations[Math.floor(Math.random() * locations.length)],
          description: `Looking for experienced ${category} professional. Must have relevant skills and experience.`,
          offeredSalary: Math.floor(15000 + Math.random() * 60000),
          numberOfPositions: Math.floor(1 + Math.random() * 5),
          recruiterEmailId: `recruiter${addedJobs}@company.com`,
          recruiterPhoneNumber: generatePhoneNumber(),
          jobDescription: `Job description for ${jobTitles[category][i]} position in ${category}`,
        });
        await job.save();
        addedJobs++;
      }
    }
    console.log(`✓ Added ${addedJobs} dummy jobs`);

    // Seed candidates
    let addedUsers = 0;
    for (const category of categories) {
      for (let i = 0; i < 10; i++) {
        const user = new User({
          username: candidateNames[category][i],
          phoneNumber: generatePhoneNumber(),
          aadharNumber: generateAadhar(),
          category,
          YOE: Math.floor(1 + Math.random() * 15),
          otherSkills: `Skilled in ${category}, reliable, hardworking`,
          currentLocation: locations[Math.floor(Math.random() * locations.length)],
          availability: new Date(
            2026,
            Math.floor(Math.random() * 12),
            Math.floor(1 + Math.random() * 28)
          ),
          messageForRecruiter: `I am an experienced ${category} professional with strong work ethic and dedication.`,
        });
        await user.save();
        addedUsers++;
      }
    }
    console.log(`✓ Added ${addedUsers} dummy candidates`);
    console.log("✓ Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
};

module.exports = initializeDatabase;
