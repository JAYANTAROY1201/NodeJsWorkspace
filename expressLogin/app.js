'use strict';
var express = require('express');
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');

AWS.config.update({endpoint: "https://dynamodb.us-west-2.amazonaws.com"});
var docClient = new AWS.DynamoDB.DocumentClient();

var bodyParser = require("body-parser");
var app = express();

var log = console.log.bind(console);

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
     res.sendFile(__dirname + '/index.html');
 });


app.post('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});


app.post('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/submit-employee-data', function (req, res) { 
    var table = "employee_data";
    var params = {
        TableName:table,
        Item:{
            "userName": req.body.userName,
            "firstName": req.body.firstName,
            "lastName":req.body.lastName,
            "password":req.body.password
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
    res.send('Signup  Successful!');
});


app.post('/login-to-profile', function (req, res) {
    var table = "employee_data";
    var params = {
        TableName: table,
        Key:{
            "userName": req.body.userName,
            "password": req.body.password }   
    };
    
    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            if(JSON.stringify(data, null, 2)!="{}")
            {
                res.send("Login successful");
            }
            else{
                res.send("user name or password is incorrect");
            }
            
        }
    });
});



var server = app.listen(5000, function () {
    console.log('Node server is running..');
});


