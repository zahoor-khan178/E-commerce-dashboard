const mongoose = require('mongoose');
require('dotenv').config(); // load .env variables

const dbconnection = () => {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/E-dashboard", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(' Database connected successfully.');
    })
    .catch((err) => {
      console.error(' Error while connecting to DB:', err.message);
    });
};

dbconnection();
