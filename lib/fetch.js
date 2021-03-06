var rest = require('restler');
var qs = require('querystring');
var _ = require('lodash');
var moment = require("moment");
require("moment-duration-format");

var API_KEY = 'AIzaSyDRl2Rc2rGksr8xHuKm3VbuXJIqrs6djtI';

module.exports.playlistItems = function (pid) {
    console.log('getting playlist items of %s', pid);
    var list = {};
    list.items = [];

    return new Promise(function (resolve, reject) {
        fetchPlaylistPage(null, function (result, err) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    function fetchPlaylistPage(nextPageToken, cb) {
        var query = {};
        query.key = API_KEY;
        query.part = 'snippet';
        query.playlistId = pid;
        query.maxResults = 50;
        query.pageToken = nextPageToken;
        rest.get('https://www.googleapis.com/youtube/v3/playlistItems?' + qs.stringify(query)).on('complete', function (result) {
            if (result.error) {
                console.log('Error:', result.error.message);
                cb(null, result.error);
            }
            else {
                list.items = list.items.concat(result.items);
                console.log('fetched a page. Next page: %s', result.nextPageToken);
                if (result.nextPageToken) {
                    fetchPlaylistPage(result.nextPageToken, cb);
                } else {
                    cb(list);
                }
            }
        });
    }
};

module.exports.related = function (vid, max) {
    return new Promise(function (resolve, reject) {
        var query = {};
        query.key = API_KEY;
        query.part = 'snippet';
        query.relatedToVideoId = vid;
        query.maxResults = max || 10;
        query.order = 'relevance';
        query.type = 'video';
        rest.get('https://www.googleapis.com/youtube/v3/search?' + qs.stringify(query)).on('complete', function (result) {
            if (result.error) {
                console.log('Error:', result.error.message);
                reject(result.error);
            } else {
                //console.log(JSON.stringify(result));
                var vids = [];
                _.forEach(result.items, function (item) {
                    vids.push(item.id.videoId);
                });
                video(vids).then(function (result) {
                    resolve(result);
                });
            }
        });
    });
};

module.exports.popular = function (pageToken) {
    return new Promise(function (resolve, reject) {
        var query = {};
        query.key = API_KEY;
        query.part = 'snippet,statistics,contentDetails';
        query.maxResults = 50;
        query.pageToken = pageToken;
        query.chart = 'mostPopular';
        query.regionCode = 'IN';

        rest.get('https://www.googleapis.com/youtube/v3/videos?' + qs.stringify(query)).on('complete', function (result) {
            if (result.error) {
                console.log('Error:', result.error.message);
                reject(result.error);
            } else {
                result.items = sanitizeVideos(result.items);
                resolve(result);
            }
        });
    });
};

function video(vids) {
    return new Promise(function (resolve, reject) {
        var query = {};
        query.key = API_KEY;
        query.part = 'snippet,statistics,contentDetails';
        query.maxResults = 50;
        query.id = _.join(vids, ',');

        rest.get('https://www.googleapis.com/youtube/v3/videos?' + qs.stringify(query)).on('complete', function (result) {
            if (result.error) {
                console.log('Error:', result.error.message);
                reject(result.error);
            } else {
                result.items = sanitizeVideos(result.items);
                resolve(result);
            }
        });
    });
};
module.exports.video = video;

function formatDuration(durationISO) {
    // Regex is to add 0: to seconds less than one 1 minute
    return moment.duration(durationISO).format("h:mm:ss", {forceLength: true, trim: 'left'})
        .replace(/^[0-9][0-9]$/g, '0:$&');
}

function sanitizeVideos(items) {
    var sanitizedVideos = [];
    _.forEach(items, function (item) {
        if (item.snippet.thumbnails && _.has(item, 'contentDetails.duration')) {
            item.contentDetails.duration = formatDuration(item.contentDetails.duration);
            sanitizedVideos.push(item);
        }
    });
    return sanitizedVideos;
}

module.exports.formatDuration = formatDuration;