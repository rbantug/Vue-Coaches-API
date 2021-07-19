const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('Unhandled Exception. Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env'
});
const app = require('./app');

const DB = process.env.DATABASE_URL.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB is working');
  });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(
    `App is listening at port ${port}. Currently running in ${process.env.NODE_ENV} environment.`
  );
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('💥 Unhandled Rejection. Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});
