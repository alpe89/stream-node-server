const convertToBase10 = require("./convertToBase10");
/**
 * 
 * @param {ArrayBuffer} value
 * @returns {number}
 */
const extractNumberFromBuffer = value => {
  const hexString = JSON.parse(value).value;
  return convertToBase10(hexString);
};

module.exports = extractNumberFromBuffer;