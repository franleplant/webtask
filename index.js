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
export default function getWebtaskRunner(container, host = DEFAULT_HOST) {

    /**
     * @param {String} wt The name of the webtask you want to run
     * @return {Function}
     */
    return function webtask(wt) {

        /**
         * @param {Object} params - a hash of all the parameters that you want to pass to the webtask
         * @return {Promise}
         */
        return function runWebtask(params) {
            let uri = url.format({
                protocol: PROTO,
                host: host,
                pathname: url.resolve(PATHNAME + container + '/', wt)
            });


            return new Promise((resolve, reject) => {
                request
                    .post(uri)
                    .send(params)
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
}
