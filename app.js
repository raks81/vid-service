var express = require('express');
var http = require('http');
var fetch = require('./lib/fetch');
var app = express();

app.get('/playlist/:pid', function (req, res) {
    fetch.playlistItems(req.params.pid).then(function (pl) {
        res.jsonp(pl);
    }, function (err) {
        if (err) {
            res.status(500).send({message: 'Could not fetch playlist: ' + req.params.pid})
        }
    });
});

app.get('/related/:vid', function (req, res) {
    fetch.related(req.params.vid).then(function (pl) {
        res.jsonp(pl);
    }, function (err) {
        if (err) {
            res.status(500).send({message: 'Could not fetch related videos: ' + req.params.vid})
        }
    });
});

var port = process.env.PORT || '8080';
http.createServer(app).listen(port,
    function () {
        console.log("Express server listening on port %s", port);
    }
);