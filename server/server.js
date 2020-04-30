const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const chalk = require('chalk');
const cors = require('cors');

const extractNumberFromBuffer = require("./utils/extractNumberFromBuffer");

const PORT = process.env.PORT || 3000;
const server = express();

server.use(bodyParser.json());
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
  const numbers = { sum: 0, count: 0 };

  req
    .setEncoding('utf8')
    .on('data', chunk => {
      try {
        console.log(chalk.gray(`▶ ${extractNumberFromBuffer(chunk)}`));
        numbers.sum += extractNumberFromBuffer(chunk);
        numbers.count++;
      } catch (err) {
        req.emit('error');
      }
    })
    .on('error', () => {
      console.log(chalk.bold.red('Encoding Error, retry! ⛔'));
      res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Encoding Error, retry! ⛔');
      req.destroy();
    })
    .on('end', () => {
      console.log(chalk.bold.yellow(`This is the state at the end of the stream ${JSON.stringify(numbers)} 📋`));
      res
        .writeHead(200, { 'Content-Type': 'text/plain' })
        .end(numbers.count > 0 ? (numbers.sum / numbers.count).toFixed(2) : 0);
    });

});

server.listen(PORT, () => {
  console.log(chalk.bold.cyan(`Server started on port ${PORT} 🐊`));
});