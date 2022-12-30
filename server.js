const express = require('express');
const path = require('path');
const fs = require ('fs');
const util = require('util');


// server
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./Develop/public'));


