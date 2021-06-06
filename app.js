const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');

const app = express();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV !== 'production') {
  console.log('Код запущен в режиме разработки');
}
// собирает все входящие данные в json формат
app.use(express.json());
app.use(routes);
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
