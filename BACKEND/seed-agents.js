const mongoose = require('mongoose');
const config = require('./config');
const { User } = require('./Schema');

const AGENTS = [
  { name: 'Sarah Johnson', email: 'sarah@complaintcare.com', password: 'Agent@123', phone: '1111111111' },
  { name: 'Mike Chen', email: 'mike@complaintcare.com', password: 'Agent@123', phone: '2222222222' },
  { name: 'Emily Davis', email: 'emily@complaintcare.com', password: 'Agent@123', phone: '3333333333' }
];

mongoose.connect(config.mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('Creating agents...');
    let created = 0;
    let existing = 0;
    
    for (const agent of AGENTS) {
      const existingAgent = await User.findOne({ email: agent.email });
      if (existingAgent) {
        console.log(`  ✓ ${agent.name} already exists`);
        existing++;
      } else {
        await User.create({
          name: agent.name,
          email: agent.email,
          password: agent.password,
          phone: agent.phone,
          userType: 'agent'
        });
        console.log(`  ✓ Created ${agent.name}`);
        created++;
      }
    }
    
    console.log(`\nSummary: ${created} created, ${existing} already existed`);
    console.log('\nAgent login credentials:');
    AGENTS.forEach(a => {
      console.log(`  ${a.name}: ${a.email} / ${a.password}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
