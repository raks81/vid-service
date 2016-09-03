var app = require('express');
var http = require('http');
var qs = require('querystring');

var API_KEY = 'AIzaSyDRl2Rc2rGksr8xHuKm3VbuXJIqrs6djtI';

app.get('/playlist/:pid', function (req, res) {
    var pid = req.query['pid'];
    console.log('getting playlist items of %s', pid);
    var query = {};
    query.key = API_KEY;
    query.part = 'snippet';
    query.playlistId = pid;
    var options = {
        host: 'www.googleapis.com',
        port: 443,
        path: '/youtube/v3/playlistItems?' + qs.stringify(query),
        method: 'GET'
    };
    console.log(JSON.stringify(options));
    http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    }).end();
});