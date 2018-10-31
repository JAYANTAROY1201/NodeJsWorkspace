'use strict';
var express = require('express');
var elasticsearch = require('elasticsearch');
var bodyParser = require("body-parser");
var app = express();

var log = console.log.bind(console);

var client = new elasticsearch.Client({
  host: 'https://search-student-ist-2.es.amazonaws.com',
  log: 'trace'
});
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
//     client.indices.create({
//      index: 'employee_database',
//      mapping: {
//        house: {
//          name: {
//            type: 'string'
//          }
//        }
//      }
//     });
     res.sendFile(__dirname + '/index.html');
 });


app.post('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});


app.post('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/submit-employee-data', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;  
    client.index({
        index: 'employee_database',
        type: 'official',
        id: req.body.userName+''+req.body.password,
        body: {
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        }
    });
    res.send('Signup  Successful!');
});


app.post('/login-to-profile', function (req, res) {
    var name = req.body.firstName + ' ' + req.body.lastName;  

   client.get({
        id: req.body.userName+''+req.body.password,
        index: 'employee_database',
        type: 'official'
      }).then(log);
    res.json(log);
});



var server = app.listen(5000, function () {
    console.log('Node server is running..');
});


