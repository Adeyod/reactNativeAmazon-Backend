import express from 'express';
import dbConfig from './dbConfig/dbConfig.js';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import orderRoute from './routes/orderRoute.js';

const forbiddenCharsRegex = /[|!{}()&=[\]===><>]/;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', userRoute);
app.use('/api/order', orderRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
