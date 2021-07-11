const mongoose = require('mongoose');

const connectDB = async () => {
 try {
  await mongoose.connect(process.env.DB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
  });
  console.log('DB connected...');
 } catch (err) {
  console.error('An error occured while connecting to the db.', err.message);
  process.exit(1);
 }
};

module.exports = connectDB;
