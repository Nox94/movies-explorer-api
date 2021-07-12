require('dotenv')
  .config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const routes = require('./routes');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const {
  PORT = 3002,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;
const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://192.168.1.178:3001',
  'https://nox-movies-explorer.nomoredomains.icu',
  'http://nox-movies-explorer.nomoredomains.icu',
];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(
  cors({
    origin: corsOptionsDelegate,
    exposedHeaders: '*',
    credentials: true,
  }),
);

app.use(helmet());

if (process.env.NODE_ENV !== 'production') {
  console.log('Код запущен в режиме разработки.');
}

app.use(express.json());
app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Приложение слушает ${PORT} порт.`);
});
