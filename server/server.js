const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const chalk = require('chalk');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const server = express();

server.use(bodyParser.json());
server.use(helmet());
server.use(cors());
/**
 * 
 * @param {ArrayBuffer} value
 * @returns {number}
 */
const extractNumberFromBuffer = value => {
  const bufferedValue = Buffer.from(value).toString();
  const hexString = JSON.parse(bufferedValue).value;
  return parseInt(hexString, 16);
};

server.get("/", (req, res) => {
  const numbers = { sum: 0, count: 0 };
  req
    .on('data', chunk => {
      numbers.sum += extractNumberFromBuffer(chunk);
      numbers.count++;
    })
    .on('end', () => {
      console.log(chalk.bold.yellow(`That's the state at the end of the stream ${JSON.stringify(numbers)} 📋`));
      res
        .writeHead(200, { 'Content-Type': 'text/plain' })
        .end((numbers.sum / numbers.count).toFixed(2));
    });
});

server.listen(PORT, () => {
  console.log(chalk.bold.cyan(`Server started on port ${PORT} 🐊`));
});