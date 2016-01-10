var express = require('express');
//import express from 'express';
var fortune = require('fortune');
//import fortune from 'fortune';
var nedbAdapter = require('fortune-nedb');
//import nedbAdapter from 'fortune-nedb';
var jsonApi = require('fortune-json-api');
//import jsonApi from 'fortune-json-api';


var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }
    },
    serializers: [{
        type: jsonApi
    }]
});

store.defineType('todo', {
    title: {type: String},
    description: {type: String},
    time: {type: String},
    assignedto: { 
        link: 'person',
        inverse: 'todos',
        isArray: false
    }
});

store.defineType('person', {
    name: {type: String},
    todos: { 
        link: 'todo',
        inverse: 'assignedto',
        isArray: true
    }
});

var app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use(fortune.net.http(store));

var port = process.env.PORT || 8080;

store.connect().then(function () {
    app.listen(port, function () {
        console.log('REST API started on port ' + port);
    });
});
// app.listen(port, () => {
//     console.log(`REST API started on port ${port}`);
// });