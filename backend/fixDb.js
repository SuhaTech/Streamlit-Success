const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Projects-DB:xJRDsvBu1lGbk2zG@cluster0.ercxozr.mongodb.net/test?appName=Cluster0').then(async () => {
  const User = require('./models/User');
  const Form = require('./models/InternshipForm');
  await User.updateMany({ department: 'SOSCET' }, { $set: { department: 'SOCSET' } });
  await Form.updateMany({ department: 'SOSCET' }, { $set: { department: 'SOCSET' } });
  console.log('Fixed DB Typos');
  process.exit(0);
});
