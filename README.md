# Webtasks runner

A simple [Webtask](https://webtask.io/) runner, it enables code communication between webtasks and Javascript code.

## How to run you webtask

```sh
# Create your webtask
# Additonally you can create it from url
# and you can pass in `--secret` s, check `wt create --help`
# for more info
wt create  my-webtask.js

#//=> https://webtask.it.auth0.com/api/run/my-container/my-webtask
```

Then you can invoke `my-webtask` from Javascript like this

```javascript
import webtaskRunner from 'webtaskRunner';

const runner = webtaskRunner('my-container');
const myWebtask = runner('my-webtask');

// You can pass in parameters at run time
let params = {
    webtask_no_cache: 1,
    random_param1: "hi",
    random_param2: "super hi",
    ..
    random_paramn: "super hi"
}

// Invoke you webtask
myWebtask(params)
    .then((res) => {
        console.log('SUCCESS!!!', res);
    })
    .catch((err) => {
        console.log('Somethin went wront', err);
    })
```

## Examples

You can check two examples:

- Send Email: [webtask](webtask/send-email.js), [invocation](./sendEmail.example.js). Send a email; from, to, subject and message are parameterized.
- Mongo Insert: [webtask](webtask/mongodb-insert.js), [invocation](./mongoInsert.example.js). Insert arbitrary data on a parameterized collection.


## Internals

This package is very simple, it uses ES6, Promises and Superagent to abstract from an HTTP POST.
POST and JSON payload have been used to you can send arbitrary amount of data to your webtask.

## Development

```sh
# test it
npm test
# Run the examples
babel-node sendEmail.example.js
babel-node mongoInsert.example.js
```



