import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    console.log(
      `MongoDB connected successfully on ${mongoose.connection.host}`
    );
  })
  .catch((err) => {
    console.log(`MongoDb failed to connect to host`);
    process.exit(1);
  });

export default dbConfig;
