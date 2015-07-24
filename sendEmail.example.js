import webtask from './index.js';

const runner = webtask('wt-franleplant-gmail_com-0');
const sendEmail = runner('send-email');

let params = {
    from: 'bat@man.com',
    to: 'franleplant@gmail.com',
    subject: 'Webtask exercise',
    message: 'Hi!!!'
}

sendEmail(params)
    .then((res) => {
        console.log('SUCCESS!!!', res);
    });
