import webtask from './index.js';

const runner = webtask('wt-franleplant-gmail_com-0');
const sendEmail = runner('send-email');

let params = {
    to: 'franleplant@gmail.com',
    subject: 'webtask exercise',
    message: 'hi!!!',
    callback: 'franleplant@gmail.com'
}

sendEmail(params)
    .then((res) => {
        console.log('SUCCESS!!!', res);
    });
