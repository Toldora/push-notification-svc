const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const subscriptionsRoutes = require('./routes/subscriptions');
require('dotenv').config();

const PORT = process.env.PORT || 3030;

const app = express();

app.use(
  cors({
    origin: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/subscriptions', subscriptionsRoutes);

async function init() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_USER_PASSWORD}@cluster0.f7lmvz0.mongodb.net/push-svc`,
      {
        useNewUrlParser: true,
      },
    );
    app.listen(PORT, () => {
      console.log('Server has been started...');
    });
  } catch (e) {
    console.log(e);
  }
}

init();

module.exports = app;
