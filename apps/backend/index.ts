//express server
import express from 'express';
import { signin, signup } from './auth';

const app = express();

app.use(express.json());


app.post('/signup', signup);
app.post('/signin', signin);
app.listen(2000, () => {
  console.log('Server is running on port 2000');
});
