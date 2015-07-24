"use latest";

const request = require('request');

const required_params = [
    'from', 'message', 'subject', 'to', 'SENDGRID_USER', 'SENDGRID_KEY'
];

let response = (code, message) => ({code, message});


/**
 * @param {String} context.data.SENDGRID_KEY
 * @param {String} context.data.SENDGRID_USER
 * @param {String} context.data.from
 * @param {String} context.data.to
 * @param {String} context.data.subject
 * @param {String} context.data.message
 */
module.exports = function sendEmailWebtask(context, webtaskReturn) {

    // Validate params
    for (let p in required_params) {
        if (!context.data[required_params[p]]) {
            return webtaskReturn(null, response(400, `"${required_params[p]}" parameter is required.`));
        }
    }

    let {SENDGRID_KEY, SENDGRID_USER, from, to, subject, message} = context.data;

    // Send e-mail through Sendgrid
    request.post({
        url: 'https://api.sendgrid.com/api/mail.send.json',
        form: {
            'api_user': SENDGRID_USER,
            'api_key': SENDGRID_KEY,
            'to': to,
            'subject': subject,
            'from': from,
            'text': message
        }
    }, function (error, sres, body) {
        if (error) return webtaskReturn(JSON.stringify(error));

        if (sres.statusCode === 200) {
            return webtaskReturn(null, response(200, 'Email delivered successfully'));
        }

        // To catch HTTP errors
        // Note that the webtask completes successfully in order to
        // return a json informing about the problem
        return webtaskReturn(null, response(sres.statusCode, body));
    });
}
