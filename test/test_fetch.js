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

    it('should return related items from a video', function (done) {
        fetch.related('ymveLawN-RM', 5).then(function (response) {
            assert.ok(response);
            assert.ok(response.items);
            assert.ok(response.items.length === 5);
            done();
        });
    });

    it('should throw an error when video id is invalid', function (done) {
        fetch.related('-U').then(function (response) {
            assert.ok(false);
            done();
        }, function (err) {
            assert.ok(err);
            assert.ok(err.code === 400);
            assert.ok(err.errors[0].reason == 'invalidVideoId');
            done();
        });
    });

    it('should return 50 popular videos', function (done) {
        fetch.popular().then(function (response) {
            assert.ok(response);
            assert.ok(response.items);
            assert.ok(response.items.length === 50);
            assert.ok(response.items[0].statistics);
            assert.ok(response.items[0].statistics.viewCount);
            done();
        });
    });

    it('should return information about the passed videos', function (done) {
        fetch.video(['ymveLawN-RM']).then(function (response) {
            assert.ok(response);
            assert.ok(response.items);
            assert.ok(response.items.length === 1);
            assert.ok(response.items[0].id === 'ymveLawN-RM');
            assert.ok(response.items[0].statistics);
            assert.ok(response.items[0].statistics.viewCount);
            done();
        });
    });

    it('should return empty result when video id is invalid', function (done) {
        fetch.video('-U').then(function (response) {
            assert.ok(response);
            assert.ok(response.items);
            assert.ok(response.items.length === 0);
            done();
        });
    });
});