const convertToBase10 = require("./convertToBase10");
/**
 * 
 * @param {ArrayBuffer} value
 * @returns {number}
 */
const extractNumberFromBuffer = value => {
  try {
    const hexString = JSON.parse(value).value;
    return convertToBase10(hexString);
  } catch (err) {
    throw new Error('Encoding');
  }
};

module.exports = extractNumberFromBuffer;