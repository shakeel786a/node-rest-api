const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv/config');
app.use(bodyParser.json());

// Import routes
const userRoute = require('./routes/users');
const { isMangoDBConnect } = require('./config/mangoDB');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
  // Connect to DB
  isMangoDBConnect()
    .then(res => {
      app.use('/api/users', userRoute);
    })
    .catch(console.error)
});