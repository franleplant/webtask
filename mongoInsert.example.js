// Run this file with `babel-node mongodb-insert.test.js`

import webtask from './index.js';

const runner = webtask('wt-franleplant-gmail_com-0');
const mongoInsert = runner('mongodb-insert');

let params = {
    webtask_no_cache: 1,
    collection: 'users',
    dataToInsert: {
        userEmail: 'a@b.com',
        userName: (new Date()).toISOString(),
        attr: {
            comesFrom: 'google'
        }
    }
}

mongoInsert(params)
    .then((res) => {
        console.log('SUCCESS!!!', res);
    })
