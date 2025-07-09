
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api', require('./search'));
app.use('/api', require('./stream'));
app.use('/api', require('./save'));

module.exports = app;
