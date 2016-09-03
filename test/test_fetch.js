var assert = require('assert');
var fetch = require('../lib/fetch');

describe('Fetch items API', function () {
    this.timeout(25000);
    it('should return playlist items from a playlist id', function (done) {
        fetch.playlistItems('PLzufeTFnhupy7sSmQdH5s3nUH8rwsua-U').then(function (response) {
            assert.ok(response);
            assert.ok(response.items);
            assert.ok(response.items.length > 100);
            done();
        });
    });
    it('should throw an error when playlist id in invalid', function (done) {
        fetch.playlistItems('-U').then(function (response) {
            assert.ok(false);
            done();
        }, function (err) {
            assert.ok(err);
            assert.ok(err.errors[0].reason == 'playlistNotFound');
            done();
        });
    });
});