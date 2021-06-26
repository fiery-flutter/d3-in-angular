import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { getChallenge1BinaryGap } from "./code-challenges";

export interface MockExpectation<I, O = I> {
  input: I;
  output: O;
}
const expectChallenge1Data: Array<MockExpectation<number, any>> = [
  {
    input: 1,
    output: 0,
  },
  {
    input: 0b1,
    output: 0,
  },
  // The zeroes must be fenced by a one on either side

  {
    input: 0b0111,
    output: 0,
  },
  {
    input: 0b0111,
    output: 1,
  },
  {
    input: 0b10,
    output: 0,
  },
  {
    input: 0b100,
    output: 0,
  },
  {
    input: 2147483647,
    output: -1,
  },
  // Does a single zero count as a "consecutive sequence of zeroes"
  {
    input: 0b101,
    output: 1,
  },
  {
    input: 0b1001,
    output: 2,
  },
  {
    input: 0b1011,
    output: 1,
  },
  {
    input: 0b10001,
    output: 3,
  },
  {
    input: 0b10111,
    output: 1,
  },
  {
    input: 0b11101,
    output: 1,
  },
  {
    input: 0b10101,
    output: 1,
  },
  {
    input: 0b100101,
    output: 2,
  },
  {
    input: 0b101001,
    output: 2,
  },
  {
    input: 0b101001,
    output: 2,
  },
  {
    input: 2147483,
    output: -1,
  },
  {
    input: 21474836,
    output: -1,
  },
  {
    input: 214748364,
    output: -1,
  },
  {
    input: 2147483647,
    output: -1,
  },
];

const expectChallenge2Data: Array<MockExpectation<number, any>> = [];

fdescribe("Challenge accepted", () => {
  beforeEach(async(() => {}));

  it("should challenge 1", () => {
    /**
     * A binary gap within a positive integer N is any maximal
     * sequence of consecutive zeros that is surrounded by ones
     * at both ends in the binary representation of N.
     * Args:
     *   - N: integer within the range [1..2,147,483,647]
     *
     * inclusive?
     *
     *
     * Assuming the challenge is to return the size of the gap...
     *
     *
     * Whether to return zero or undefined
     *
     * To catch what is an error case vs what is a number outside our assumed range.
     *
     * ? coerced string? nulls
     *
     * * Needs to find max sequence which means traversing most-if not all-of the digits.
     *
     * Does a single zero count as a "consecutive sequence of zeroes"
     */

    expectChallenge1Data.forEach((element) => {
      const result = getChallenge1BinaryGap(element.input);

      expect(result).toEqual(element.output);
    });
  });

  it("should challenge 2", () => {
    /**
     * Returns the number of integers within the range [A..B] that are divisible by K.
     * Used generators to save memory on large amounts of data.
     * Args:
     *   - A: is an integer within the range [0..2,000,000,000]
     *   - B: is an integer within the range [0..2,000,000,000] and A <= B
     *   - K: is an integer within the range [1..2,000,000,000]
     *
     */
  });

  it("should challenge 3", () => {
    /**
     * Calculate triangle of integers, where sentense (?) of numbers P, Q, R
     * correspond to next rules:
     *   - P + Q > R
     *   - Q + R > P
     *   - R + P > Q
     * Args:
     *   - A: list of integers, where we will search triangle
     * Return: 1 - if triangle exists, and 0 - otherwise
     */
  });

  it("should challenge 4", () => {
    /**
     *
     */
  });
  it("should challenge 5", () => {
    /**
     *
     */
  });
  it("should challenge 6", () => {
    /**
     *
     */
  });
  it("should challenge A", () => {
    /**
     * Acyclic primes
     * are primes that have every one of their digit combinations permutation acyclically all as primes
     *
     * lol
     * i.e. 1193 1931 3911 9113
     *
     */
  });
});
