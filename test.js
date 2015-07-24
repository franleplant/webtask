import request from 'superagent';
import sinon from 'sinon';
import {expect} from 'chai';
import webtask from './index.js';


const HOST_MOCK = 'rules.auth0.com';
const CONTAINER_MOCK = 'fake-container';
const WEBTASK_MOCK = 'hello';
const RESPONSE_MOCK = {ok: true, body: 'hello'};

describe('Webtask Runner', function() {
    before(function(done){
        sinon
            .stub(request, 'get', function getStub(url) {
                return {
                    end: cb => cb(null, RESPONSE_MOCK)
                }
            })
        done();
    });

    after(function(done){
        request.get.restore();
        done();
    });

    it('makes the request to the correct url and return the right value', function(done){
        let runner = webtask(CONTAINER_MOCK, HOST_MOCK);
        let helloWt = runner(WEBTASK_MOCK);

        helloWt()
            .catch((err) => {
                console.log(`the mocked https request failed with err: ${err}`);
                done();
            })
            .then((res) => {
                expect(request.get.getCall(0).args[0]).to.equal(`https://${HOST_MOCK}/api/run/${CONTAINER_MOCK}/${WEBTASK_MOCK}`);
                expect(res).to.equal(RESPONSE_MOCK.body);
                done();
            })
            .catch((err) => {
                console.log('Something went wrong', err);
            });
    });
});


