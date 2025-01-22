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

// Check if the player has lost based on bankroll
export function checkLossCondition(bankroll) {
  return bankroll < calculateCheapestLetterCost()
}
