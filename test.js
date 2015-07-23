import webtask from './index.js';
import chalk from 'chalk';


let runner = webtask('wt-franleplant-gmail_com-0');

runner('hello')
    .then((res) => {
        console.log(chalk.green('Success!!!'));
        console.log(chalk.blue('response: '), res)
    })
    .catch(console.log.bind(console))
