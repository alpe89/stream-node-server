const _url = require('url');
const http = require('http');

/*
* USAGE:
* node client.js <your-url>
*/

/**
 * Generates a random, positive integer represented in hex form
 * (base 16).
 *
 * @returns {string}
 */
const generateRandomHexValue = () => {
  return '0x' + Math.floor(Math.random() * 2048)
    .toString(16)
    .toUpperCase();
};

/**
 * Runs the `task` function for the provided `reps` number of repetitions,
 * delaying each repetition by a random amount of milliseconds.
 *
 * @param {function} task
 * @param {number} reps
 * @param {function} cb
 */
const randomDelayLoop = (task, reps, cb) => {
  if (reps === 0) {
    cb();
    return;
  }
  task(() => {
    setTimeout(() => {
      randomDelayLoop(task, reps - 1, cb);
    }, Math.floor(Math.random() * 50));
  });
};

/**
 * Makes a HTTP request to the provided `url` url with a streaming payload
 * consisting of a random amount of newline-delimited JSON objects, each
 * having its `value` property set to a random, positive integer represented
 * in hex form (base 16).
 *
 * ```
 * {"value": "0x000"}
 * {"value": "0xA54"}
 * ...
 * ```
 *
 * @param url
 * @param cb
 */
const makeRequest = (url, cb) => {

  const opts = {
    ..._url.parse(url),
    agent: false,
    method: 'GET',
    headers: {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'application/x+ndjson',
    },
  };

  const req = http.request(opts);

  req.on('error', (err) => {
    cb(err);
  });

  req.on('response', (res) => {
    res.on('data', data => console.log('average: ', data.toString()));
    res.on('end', () => {
      cb();
    });
  });

  req.on('socket', () => {
    const reps = Math.floor(Math.random() * 1e3);
    randomDelayLoop((done) => {
      req.write(JSON.stringify({ value: generateRandomHexValue() }) + '\n');
      done();
    }, reps, () => { req.end(); });
  });

};

makeRequest('http://localhost:3000', (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});