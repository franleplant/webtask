"use latest";

const request = require('request');
const async = require('async');

const required_params = [
    'message', 'subject', 'to', 'SENDGRID_USER', 'SENDGRID_KEY'
];

let response = (code, message) => ({code, message});

module.exports = function sendEmailWebtask(context, webtaskReturn) {

    let {SENDGRID_KEY, SENDGRID_USER, to, subject, message} = context.data;

    async.series([
        function validateInputParameters(done) {
            for (var p in required_params) {
                if (!context.data[required_params[p]]) {
                    return done(response(400, `The ${required_params[p]} parameter must be provided.`));
                }
            }
            done();
        },
        function sendEmail(done) {
            // Send e-mail through Sendgrid
            request.post({
                url: 'https://api.sendgrid.com/api/mail.send.json',
                form: {
                  'api_user': SENDGRID_USER,
                  'api_key': SENDGRID_KEY,
                  'to': to,
                  'subject': '[Auth0 Webtask Sample] ' + subject,
                  'from': 'samples@webtask.io',
                  'text': `${message}
                            \n\n-------------\n
                            '[Legal disclaimer added to every message]`
                }
            }, function (error, sres, body) {
                if (error) return done(JSON.stringify(error));
                if (sres.statusCode === 200) {
                    return done(null, response(200, 'Email delivered successfully'));
                }
            });
        }
    ], function (error, [_, result]) {
        if (error) {
            webtaskReturn(error);
            return;
        }

        webtaskReturn(null,  result);
    });
}
