import url from 'url';
import request from 'superagent';


const PROTO = 'https';
const DEFAULT_HOST = 'webtask.it.auth0.com';
const PATHNAME = '/api/run/';



/**
 * Create a webtask runner for a given container and optional host.
 *
 * @param {String} container i.e. 'wt-youremail-gmail_com-0', checkout the url
 *      that `wt create webtask` returns.
 * @param {String} [host] Specify the host where the webtask is located, it defaults
 *      to 'webtask.it.auth0.com'
 * @return {Function} Webtasks Runner for the specified container and host
 */
export default function webtask(container, host = DEFAULT_HOST) {
    let base = url.format({
        protocol: PROTO,
        host: host,
        pathname: PATHNAME + container + '/'
    });

    /**
     * Run a webtask in the contextual container and domain.
     * @param {String} wt The name of the webtask you want to run
     * @return {Promise}
     */
    return function run(wt) {
        return new Promise((resolve, reject) => {
            request
                .get(url.resolve(base, wt))
                .end((err, res) => {
                    if (!res.ok) {
                        reject(res.text);
                        return;
                    }

                    resolve(res.body);
                })
        });
    }
}
