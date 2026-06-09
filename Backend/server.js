const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const bcrypt = require('bcryptjs');

connectDB().then(async () => {
  try {
    const demoExists = await User.findOne({ email: 'demo@matchmaker.in' });
    if (!demoExists) {
      await User.create({
        name: 'Demo Matchmaker',
        email: 'demo@matchmaker.in',
        password: 'password123'
      });
      console.log('Demo user seeded: demo@matchmaker.in');
    } else {
      console.log('Demo user already exists.');
    }
  } catch (err) {
    console.log('Demo seed skipped:', err.message);
  }
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api', limiter);

const routes = require('./routes');
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
