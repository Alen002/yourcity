var path = require('path');
const PORT = 5000;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(morgan('short')); 

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cors());

app.listen(PORT);
