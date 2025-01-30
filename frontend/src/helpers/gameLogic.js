// src/helpers/gameLogic.js
import { letterCosts } from '../constants/letterCosts'

// Get the cost of a specific letter
export function getLetterCost(letter) {
  return letterCosts[letter.toLowerCase()] || 0
}

// Calculate the cheapest letter cost
export function calculateCheapestLetterCost() {
  return Math.min(...Object.values(letterCosts))
}

// Check if the player has lost based on bankroll AND guesses
export function checkLossCondition(bankroll, guesses) {
  const cheapestLetterCost = calculateCheapestLetterCost();

  console.log("CHECK LOSS CONDITION:");
  console.log("Guesses Left:", guesses);
  console.log("Bankroll:", bankroll);
  console.log("Cheapest Letter Cost:", cheapestLetterCost);

  return guesses === 0 && bankroll < cheapestLetterCost; // ✅ Now correctly checks both conditions
}
