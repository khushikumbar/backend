const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const database = require('./config/database');
const  authRouter  = require('./routes/authRouter');
const errorController = require('./middleware/errorController');
const cookieParser = require('cookie-parser');
const taskrouter = require('./routes/taskRoute');

dotenv.config();
database();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: "http://localhost:5173", // React frontend
    credentials: true,
  }
))

app.use('/user', authRouter);
app.use("/task",taskrouter)

app.use(errorController);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});