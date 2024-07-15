const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const subscriptionsRoutes = require('./routes/subscriptions');
const notificationsRoutes = require('./routes/notifications');
const { initWebpush } = require('./controllers/webpush');

require('dotenv').config();

const PORT = process.env.PORT || 3030;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/subscriptions', subscriptionsRoutes);
app.use('/notifications', notificationsRoutes);

async function init() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_USER_PASSWORD}@cluster0.f7lmvz0.mongodb.net/push-svc`,
      {
        useNewUrlParser: true,
      },
    );

    initWebpush();

    app.listen(PORT, () => {
      console.log(`Server has been started on port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

init();

module.exports = app;
