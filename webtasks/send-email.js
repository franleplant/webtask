var request = require('request')
    , async = require('async')
    , querystring = require('querystring');

var required_params = [
    'callback', 'message', 'subject', 'to', 'SENDGRID_USER', 'SENDGRID_KEY'
];

module.exports = function (context, req, res) {
    async.series([
        function (callback) {
            // Validate input parameters
            if (!context.data.callback)
                context.data.callback = req.headers['referer'];
            for (var p in required_params)
                if (!context.data[required_params[p]])
                    return callback(
                        error(400, new Error('The `' + required_params[p]
                            + '` parameter must be provided.')));
            callback();
        },
        function (callback) {
            // Send e-mail through Sendgrid
            request.post({
                url: 'https://api.sendgrid.com/api/mail.send.json',
                form: {
                  'api_user': context.data.SENDGRID_USER,
                  'api_key': context.data.SENDGRID_KEY,
                  'to': context.data.to,
                  'subject': '[Auth0 Webtask Sample] ' + context.data.subject,
                  'from': 'samples@webtask.io',
                  'text': context.data.message
                    + '\n\n-------------\n'
                    + '[Legal disclaimer added to every message]'
                }
            }, function (error, sres, body) {
                if (error)
                    return callback(error);
                var redirect_hash;
                if (sres.statusCode === 200) {
                    redirect_hash = querystring.stringify({
                        status: 'success'
                    });
                }
                else {
                    redirect_hash = querystring.stringify({
                        status: 'error',
                        sendgrid_http_status: sres.statusCode,
                        error: body ? body.toString().substring(0, 200) : ''
                    });
                }
                var redirect_url = context.data.callback + '#' + redirect_hash;
                res.writeHead(302, { Location: redirect_url });
                res.end();
                return callback();
            });
        }
    ], function (error) {
        if (error) {
            try {
                console.log('ERROR', error);
                res.writeHead(error.code || 500);
                res.end(error.stack || error.message || error.toString());
            }
            catch (e) {
                // ignore
            }
        }
    });
}

function error(code, message) {
    var e = new Error(message);
    e.code = code;
    return e;
}
