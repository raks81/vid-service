var rest = require('restler');
var qs = require('querystring');

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

