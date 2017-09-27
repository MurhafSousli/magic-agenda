import { Injectable } from '@angular/core';

@Injectable()
export class AlgorithmService {

  threshold = 0.4;
  thresholdAbsolute = 20;
  caseSensitive = false;
  nullResultValue = null;
  returnWinningObject = null;
  returnFirstMatch = false;

  MAX_INT = Math.pow(2, 32) - 1; // We could probably go higher than this, but for practical reasons let's not.

  didYouMean(str, list, key) {
    if (!str) return null;

    // If we're running a case-insensitive search, smallify str.
    if (!this.caseSensitive) {
      str = str.toLowerCase();
    }

    // Calculate the initial value (the threshold) if present.
    let thresholdRelative = this.threshold === null ? null : this.threshold * str.length,
      thresholdAbsolute = this.thresholdAbsolute,
      winningVal;
    if (thresholdRelative !== null && thresholdAbsolute !== null) winningVal = Math.min(thresholdRelative, thresholdAbsolute);
    else if (thresholdRelative !== null) winningVal = thresholdRelative;
    else if (thresholdAbsolute !== null) winningVal = thresholdAbsolute;
    else winningVal = null;

    // Get the edit distance to each option. If the closest one is less than 40% (by default) of str's length,
    // then return it.
    let winner, candidate, testCandidate, val,
      i, len = list.length;
    for (i = 0; i < len; i++) {
      // Get item.
      candidate = list[i];
      // If there's a key, get the candidate value out of the object.
      if (key) {
        candidate = candidate[key];
      }
      // Gatekeep.
      if (!candidate) {
        continue;
      }
      // If we're running a case-insensitive search, smallify the candidate.
      if (!this.caseSensitive) {
        testCandidate = candidate.toLowerCase();
      }
      else {
        testCandidate = candidate;
      }
      // Get and compare edit distance.
      val = this.getEditDistance(str, testCandidate, winningVal);
      // If this value is smaller than our current winning value, OR if we have no winning val yet (i.e. the
      // threshold option is set to null, meaning the caller wants a match back no matter how bad it is), then
      // this is our new winner.
      if (winningVal === null || val < winningVal) {
        winningVal = val;
        // Set the winner to either the value or its object, depending on the returnWinningObject option.
        if (key && this.returnWinningObject) winner = list[i];
        else winner = candidate;
        // If we're returning the first match, return it now.
        if (this.returnFirstMatch) return winner;
      }
    }

    // If we have a winner, return it.
    return winner || this.nullResultValue;
  }


  getEditDistance(a, b, max) {
    // Handle null or undefined max.
    max = max || max === 0 ? max : this.MAX_INT;

    let lena = a.length;
    let lenb = b.length;

    // Fast path - no A or B.
    if (lena === 0) return Math.min(max + 1, lenb);
    if (lenb === 0) return Math.min(max + 1, lena);

    // Fast path - length diff larger than max.
    if (Math.abs(lena - lenb) > max) return max + 1;

    // Slow path.
    let matrix = [],
      i, j, colMin, minJ, maxJ;

    // Set up the first row ([0, 1, 2, 3, etc]).
    for (i = 0; i <= lenb; i++) {
      matrix[i] = [i];
    }

    // Set up the first column (same).
    for (j = 0; j <= lena; j++) {
      matrix[0][j] = j;
    }

    // Loop over the rest of the columns.
    for (i = 1; i <= lenb; i++) {
      colMin = this.MAX_INT;
      minJ = 1;
      if (i > max) minJ = i - max;
      maxJ = lenb + 1;
      if (maxJ > max + i) maxJ = max + i;
      // Loop over the rest of the rows.
      for (j = 1; j <= lena; j++) {
        // If j is out of bounds, just put a large value in the slot.
        if (j < minJ || j > maxJ) {
          matrix[i][j] = max + 1;
        }

        // Otherwise do the normal Levenshtein thing.
        else {
          // If the characters are the same, there's no change in edit distance.
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          }
          // Otherwise, see if we're substituting, inserting or deleting.
          else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // Substitute
              Math.min(matrix[i][j - 1] + 1, // Insert
                matrix[i - 1][j] + 1)); // Delete
          }
        }

        // Either way, update colMin.
        if (matrix[i][j] < colMin) colMin = matrix[i][j];
      }

      // If this column's minimum is greater than the allowed maximum, there's no point
      // in going on with life.
      if (colMin > max) return max + 1;
    }
    // If we made it this far without running into the max, then return the final matrix value.
    return matrix[lenb][lena];
  }
}

/**

// private static getMatchingValue = (a, b) => {
//   if (a.length == 0) return b.length;
//   if (b.length == 0) return a.length;
//
//   const matrix = [];
//
//   // increment along the first column of each row
//   let i;
//   for (i = 0; i <= b.length; i++) {
//     matrix[i] = [i];
//   }
//
//   // increment each column in the first row
//   let j;
//   for (j = 0; j <= a.length; j++) {
//     matrix[0][j] = j;
//   }
//
//   // Fill in the rest of the matrix
//   for (i = 1; i <= b.length; i++) {
//     for (j = 1; j <= a.length; j++) {
//       if (b.charAt(i - 1) == a.charAt(j - 1)) {
//         matrix[i][j] = matrix[i - 1][j - 1];
//       } else {
//         matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
//           Math.min(matrix[i][j - 1] + 1, // insertion
//             matrix[i - 1][j] + 1)); // deletion
//       }
//     }
//   }
//
//   return matrix[b.length][a.length];
// };

private static LevenshteinAlgorithm = function (s, t) {
  let d = []; //2d matrix

  // Step 1
  let n = s.length;
  let m = t.length;

  if (n == 0) return m;
  if (m == 0) return n;

  //Create an array of arrays in javascript (a descending loop is quicker)
  for (let i = n; i >= 0; i--) d[i] = [];

  // Step 2
  for (let i = n; i >= 0; i--) d[i][0] = i;
  for (let j = m; j >= 0; j--) d[0][j] = j;

  // Step 3
  for (let i = 1; i <= n; i++) {
    let s_i = s.charAt(i - 1);

    // Step 4
    for (let j = 1; j <= m; j++) {

      //Check the jagged ld total so far
      if (i == j && d[i][j] > 4) return n;

      let t_j = t.charAt(j - 1);
      let cost = (s_i == t_j) ? 0 : 1; // Step 5

      //Calculate the minimum
      let mi = d[i - 1][j] + 1;
      let b = d[i][j - 1] + 1;
      let c = d[i - 1][j - 1] + cost;

      if (b < mi) mi = b;
      if (c < mi) mi = c;

      d[i][j] = mi; // Step 6

      //Damerau transposition
      if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  // Step 7
  return d[n][m];
};
 */
