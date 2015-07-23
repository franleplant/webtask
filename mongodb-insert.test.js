// Run this file with `babel-node mongodb-insert.test.js`

import webtask from './index.js';


webtask('wt-franleplant-gmail_com-0')('mongodb-insert')
    .then((res) => {
        console.log('SUCCESS!!!', res);
    })
