const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB)
  .then((con) => {
    console.log(con.connections);
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log(err);
  });

const app = require('./app');

const port = process.env.PORT;

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}...`);
});
