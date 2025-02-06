import { defineStore } from 'pinia';
import { getLetterCost, checkLossCondition } from '../helpers/gameLogic';

export const useStore = defineStore('main', {
  state: () => ({
    currentPhrase: '', // Now fetched from API
    category: '',
    guessedLetters: [],
    correctPositions: [],
    bankroll: 1000,
    guesses: 2,
    currentInput: '',
    currentTypedLetter: '',
    isGuessMode: false,
    activeBoxIndex: null,
    winState: false,
    lossState: false,
    currentCashStreak: 0,
    highestCashStreak: 0,
    pendingPurchase: null,
  }),

  getters: {
    letterCost: () => getLetterCost,
    formattedBankroll: (state) => `$${state.bankroll.toFixed(2)}`,
  },

  actions: {
    /** 
     * Fetch a random phrase from the backend and set it as the current phrase.
     */
    async fetchRandomPhrase() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/random-phrase`);
        const data = await response.json();
        // Use the fetched data...
      } catch (error) {
        console.error("Error fetching phrase:", error);
      }
    },
            
    toggleGuessMode() {
      if (this.guesses === 0) {
        alert('You need at least one guess remaining to enter Guess Mode!');
        return;
      }
      this.isGuessMode = !this.isGuessMode;

      if (this.isGuessMode) {
        this.currentTypedLetter = '';
        this.currentInput = this.currentPhrase
          .split('')
          .map((char, index) => (char === ' ' || this.correctPositions[index] ? char : '_'))
          .join('');
        this.activeBoxIndex = this.currentInput.indexOf('_');
      } else {
        this.activeBoxIndex = null;
      }
    },

    fillActiveBox(letter) {
      if (!this.isGuessMode || this.activeBoxIndex === null) return;

      const inputArray = this.currentInput.split('');
      if (!this.correctPositions[this.activeBoxIndex]) {
        inputArray[this.activeBoxIndex] = letter;
        this.currentInput = inputArray.join('');

        const nextIndex = this.currentPhrase
          .split('')
          .findIndex((char, idx) => idx > this.activeBoxIndex && char !== ' ' && inputArray[idx] === '_');

        this.activeBoxIndex = nextIndex !== -1 ? nextIndex : this.activeBoxIndex;
      }
    },

    deleteActiveBox() {
      if (!this.isGuessMode || this.activeBoxIndex === null) return;

      const inputArray = this.currentInput.split('');
      if (!this.correctPositions[this.activeBoxIndex]) {
        inputArray[this.activeBoxIndex] = '_';
        this.currentInput = inputArray.join('');
      }

      const prevIndex = this.currentPhrase
        .split('')
        .findLastIndex((char, idx) => idx < this.activeBoxIndex && char !== ' ' && !this.correctPositions[idx]);

      this.activeBoxIndex = prevIndex !== -1 ? prevIndex : this.activeBoxIndex;
    },

    submitGuess() {
      if (!this.isGuessMode) return;

      const phraseArray = this.currentPhrase.split('');
      const inputArray = this.currentInput.split('');

      this.correctPositions = phraseArray.map((char, index) =>
        char.toLowerCase() === inputArray[index]?.toLowerCase() ? char : this.correctPositions[index] || null
      );

      phraseArray.forEach((char, index) => {
        if (char.toLowerCase() === inputArray[index]?.toLowerCase()) {
          this.correctPositions[index] = char;
        }
      });

      this.currentInput = phraseArray
        .map((char, index) => (this.correctPositions[index] ? this.correctPositions[index] : '_'))
        .join('');

      if (this.currentInput.trim() === this.currentPhrase.trim()) {
        this.triggerWin();
      } else {
        if (this.guesses > 0) {
          this.guesses--;
        }
        this.checkLossCondition();
      }

      this.isGuessMode = false;
      this.activeBoxIndex = null;
    },

    guessLetter(letter) {
      if (this.guessedLetters.includes(letter)) return;

      const cost = getLetterCost(letter);
      if (this.bankroll >= cost) {
        this.processLetterPurchase(letter);
      } else {
        alert('Insufficient bankroll to guess this letter!');
      }
    },

    processLetterPurchase(letter) {
      const cost = getLetterCost(letter);
      this.guessedLetters.push(letter);
      this.bankroll -= cost;

      const phraseArray = this.currentPhrase.split('');
      let letterFound = false;

      phraseArray.forEach((char, index) => {
        if (char.toLowerCase() === letter.toLowerCase()) { // Case insensitive match
          this.correctPositions[index] = char;
          letterFound = true;
        }
      });

      if (!letterFound) {
        console.error(`Letter "${letter}" not found in phrase.`);
      }

      const allRevealed = phraseArray.every(
        (char, index) => char === ' ' || this.correctPositions[index] === char
      );

      if (allRevealed) {
        this.triggerWin();
      } else {
        this.checkLossCondition();
      }
    },

    confirmPendingPurchase() {
      if (this.pendingPurchase === 'guess') {
        if (this.bankroll >= 150) {
          this.bankroll -= 150;
          this.guesses++;
        } else {
          alert('Insufficient bankroll to purchase a guess!');
        }
      } else if (this.pendingPurchase === 'hint') {
        if (this.bankroll >= 150) {
          this.bankroll -= 150;

          const phraseArray = this.currentPhrase.split('');
          const unrevealedLetters = phraseArray
            .filter((char, index) => !this.correctPositions[index] && char !== ' ')
            .filter((char) => !this.guessedLetters.includes(char));

          if (unrevealedLetters.length > 0) {
            const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
            phraseArray.forEach((char, index) => {
              if (char === randomLetter) {
                this.correctPositions[index] = char;
              }
            });

            this.guessedLetters.push(randomLetter);
          }
        } else {
          alert('Insufficient bankroll to purchase a hint!');
        }
      }
      this.pendingPurchase = null;
    },

    checkLossCondition() {
      if (this.guesses === 0 && this.bankroll < 30) {
        this.triggerLoss();
      }
    },

    triggerWin() {
      this.winState = true;
      this.currentCashStreak++;
      this.highestCashStreak = Math.max(this.highestCashStreak, this.bankroll);
      alert('Congratulations! You’ve guessed the phrase!');
    },

    triggerLoss() {
      this.lossState = true;
      alert('Game Over. You’ve run out of resources to continue!');
    },

    resetGame() {
      this.guessedLetters = [];
      this.correctPositions = [];
      this.currentInput = '';
      this.currentTypedLetter = '';
      this.isGuessMode = false;
      this.activeBoxIndex = null;
      this.bankroll = 1000;
      this.guesses = 2;
      this.winState = false;
      this.lossState = false;
      this.pendingPurchase = null;
      this.fetchRandomPhrase(); // Fetch a new phrase when resetting the game
    },
  },
});
