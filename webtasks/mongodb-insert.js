"use latest";

var MongoClient = require('mongodb').MongoClient;
var waterfall   = require('async').waterfall;

/**
 * The most important parameters, expected in `context.data` are:
 *
 * @param {String} MONGO_URL It should be passed as a `--secret`, it correspond to the connection
 *          url for the db instance.
 * @param {String} context.data.collection The name of the db collection where you want to insert the data
 * @param {Object} context.data.dataToInser Arbirtrary mongodb valid data to insert in the collection
 */
module.exports = function(context, webtaskReturn) {

    let { MONGO_URL, collection, dataToInsert} = context.data;

    if (!MONGO_URL) return webtaskReturn(new Error('MONGO_URL secret is missing'))

    waterfall([
        function connect_to_db(done) {
            MongoClient.connect(MONGO_URL, function(err, db) {
                if(err) return done(err);

                done(null, db);
            });
        },
        function insert(db, done) {
            db
                .collection(collection)
                .insertOne(dataToInsert, function (err, result) {
                    if(err) return done(err);

                    done(null, result);
                });
        }
    ], webtaskReturn);
};
