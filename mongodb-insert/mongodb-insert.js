var MongoClient = require('mongodb').MongoClient;
var waterfall   = require('async').waterfall;

module.exports = function(ctx, cb) {

    var MONGO_URL = ctx.data.MONGO_URL;
    if (!MONGO_URL) return cb(new Error('MONGO_URL secret is missing'))

    waterfall([
        function connect_to_db(done) {
            MongoClient.connect(MONGO_URL, function(err, db) {
                if(err) return done(err);

                done(null, db);
            });
        },
        function insert(db, done) {
            db
                .collection('webtask')
                .insertOne({ msg: 'Hey Mongo! on ' + (new Date()).toISOString() }, function (err, result) {
                    if(err) return done(err);

                    done(null, result);
                });
        }
    ], cb);
};
