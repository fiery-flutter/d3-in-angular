export function getChallenge1BinaryGap(input: number) {
  //? Convert to binary first?
  if (input < 1) {
    return 0;
  }
  // We should check that input is a positive integer before proceeding
  // Do some operation to resolve the largest number of consecutive binary zeroes (get binary representation of the positive integer number)
  // ? Do we need to lok at intricacies unsigned vs signed integer dependent on the language.
  var maxGap = 0;
  var curMaxGap = 0;
  var binStr = input.toString(2);
  var startIndexFromEnd = binStr.length - 1;

  // ! Unnecessary for loop can be refactored away.
  // See which way to iterate from whether reverse is required
  // Array.from(binStr);
  for (startIndexFromEnd; startIndexFromEnd >= 0; startIndexFromEnd--) {
    if (binStr.charAt(startIndexFromEnd) != "0") {
      break;
    }
  }
  for (var i = startIndexFromEnd - 1; i >= 0; i--) {
    if (binStr.charAt(i) == "0") {
      curMaxGap = curMaxGap + 1;
    } else {
      if (curMaxGap > maxGap) {
        maxGap = curMaxGap;
      }
      curMaxGap = 0;
    }
  }
  return maxGap;
}

/**
 * Check not NaN
 *
 */
function isNumber() {
  return false;
}
/**
 * Inclusive range >= greater than or equal to 1.
 *
 * An integer
 * Not zero
 * Not negative
 *
 */
function isPositiveInteger() {
  return false;
}

/**
 * Assuming the input they give can fit outside the range and does not wrap around overflow...
 */
function isSizeWithinRange() {
  return false;
}

function getBinaryRepresentation() {
  // Unless there is a faster native shift operator in js ?
  // Maybe bit xor or hamming code like operation can solve quickly.
}
