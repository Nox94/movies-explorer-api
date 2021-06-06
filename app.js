const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const NotFound = require('./errors/NotFound');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');

const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

if (process.env.NODE_ENV !== 'production') {
  console.log('Код запущен в режиме разработки');
}

// собирает все входящие данные в json формат
app.use(express.json());

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  login,
);

app.use('/users', auth, users);
app.use('/movies', auth, movies);

app.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена.'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err);
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера.' : message,
  });
  next();
});

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
