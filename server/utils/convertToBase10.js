/**
 * The main idea is to divide every digit and find its base10 conversion, then sum up every digit to have the total conversion.
 * Example: 0x1F
 * From a string representation of an hexadecimal value, we need only the characters 
 * from the third position (cutting off the 0x prefix).
 * 0x1F --> [1, F]
 * From the array generated we traverse it from index 0 and dynamically generate the weight for the conversion,
 * with the formula weight = 16^(array length - currentIndex - 1).
 * weight for 1 is 16^(2 - 0 - 1) = 16^1 = 16
 * weight for F is 16^(2 - 1 - 1) = 16^0 = 1
 * Our array is now [1 * 16, 15 * 1] --> [16, 15]
 * The we just have to sum up every element of the array, in our example 16 + 15 = 31, 31 is the base10 value of 0x1F.
 * @param {string} hexString
 * @returns {number} 
 */
const convertToBase10 = hexString => {
  if (hexString == null || hexString === '') throw new Error('Encoding');
  const hexArr = hexString.slice(2).split("");

  return hexArr
    .map((value, current, array) => {
      // Handling of digits greater than 9
      if (value === 'A') value = 10;
      else if (value === 'B') value = 11;
      else if (value === 'C') value = 12;
      else if (value === 'D') value = 13;
      else if (value === 'E') value = 14;
      else if (value === 'F') value = 15;
      // shortcut to cast to a number
      else value = +value;

      let weight = 16 ** (array.length - current - 1);
      return value * weight;
    })
    .reduce((sum, value) => sum + value, 0);
}

module.exports = convertToBase10;