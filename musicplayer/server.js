var express = require("express");
var app = express();
const path = require('path');
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
var config = require("./config");
var cors = require("cors");
var users = require("./router/users");
var port = process.env.PORT || 3100;
var url = config.database;
const router = express.Router();
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(cors());
mongoose.connect(url, config.parser);

mongoose.connection.on('connected', () => { console.log("connected") });

app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/images', express.static('images'))

app.use(bodyParser.json());


router.get('/home', function (req, res) {
    res.send('root')
})
app.use('/', users);


app.listen(port, () => console.log("started"));
