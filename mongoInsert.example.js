// Run this file with `babel-node mongodb-insert.test.js`

import webtask from './index.js';

const runner = webtask('wt-franleplant-gmail_com-0');
const mongoInsert = runner('mongodb-insert');

let params = {
    userEmail: 'a@b.com',
    userName: (new Date()).toISOString()
}

mongoInsert(params)
    .then((res) => {
        console.log('SUCCESS!!!', res);
    })
