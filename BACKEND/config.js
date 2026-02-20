module.exports = {
  // Use MONGO_URI env variable, or connect to local MongoDB (Compass / local server)
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaintcare',
  sessionSecret: process.env.SESSION_SECRET || 'complaintcare-secret-key',
  port: process.env.PORT || 8000
};
