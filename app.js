const express = require('express');
const mongoose = require('mongoose');
const config = require('./config.json')
const bodyParser = require('body-parser');
const routes = require('./users/controllers/routes');


const app = express();

// Using  body-parser middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connecting the database
mongoose.connect(config.mongoString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error);
  });



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Use routes defined in routes.js
app.use('/', routes);
