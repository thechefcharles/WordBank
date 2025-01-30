// src/constants/letterCosts.js

export const letterCosts = {
    q: 30, w: 50, e: 140, r: 120, t: 120, y: 60, u: 80, i: 110, o: 90, p: 80,
    a: 130, s: 120, d: 80, f: 60, g: 70, h: 70, j: 30, k: 50, l: 80,
    z: 40, x: 40, c: 80, v: 50, b: 60, n: 100, m: 70,
  }
  
  export const cheapestLetterCost = Math.min(...Object.values(letterCosts))
  