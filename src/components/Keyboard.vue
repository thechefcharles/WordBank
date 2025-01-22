<template>
  <div class="keyboard">
    <!-- Category Display -->
    <div class="category">
      <p>Category: <strong>{{ store.category }}</strong></p>
    </div>

    <!-- Guess and Hint Counters -->
    <div class="top-controls">
      <p>Guesses Remaining: {{ store.guesses }}</p>
      <button
        @click="initiatePurchase('guess', $event)"
        :disabled="store.bankroll < 150"
        :class="{ selected: store.pendingPurchase === 'guess' }"
      >
        Buy Guess ($150)
      </button>
      <button
        @click="initiatePurchase('hint', $event)"
        :disabled="store.bankroll < 150"
        :class="{ selected: store.pendingPurchase === 'hint' }"
      >
        Hint ($150)
      </button>
    </div>

    <!-- Rows of Keys -->
    <div class="key-row" v-for="(row, rowIndex) in [row1, row2, row3]" :key="rowIndex">
      <button
        v-for="key in row"
        :key="key"
        @click="() => selectLetter(key)"
        :class="getKeyClass(key)"
        :disabled="store.guessedLetters.includes(key)"
      >
        <span>{{ key }}</span>
        <small class="letter-cost">(${{ getLetterCost(key) }})</small>
      </button>
    </div>

    <!-- Control Buttons -->
    <div class="controls">
      <!-- Guess Mode Toggle -->
      <button
        :class="{ active: store.isGuessMode }"
        @click="toggleGuessMode"
      >
        {{ store.isGuessMode ? 'Exit Guess Mode' : 'Guess' }}
      </button>

      <!-- Enter and Delete Buttons -->
      <button
        @click="confirmAction"
        :disabled="!store.currentTypedLetter && !store.isGuessMode && !store.pendingPurchase"
        :class="{ ready: store.currentTypedLetter || store.isGuessMode || store.pendingPurchase }"
      >
        Enter
      </button>
      <button
        @click="deleteLetter"
        :disabled="!store.isGuessMode || store.activeBoxIndex === null"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from '../store';

export default {
  name: 'Keyboard',
  data() {
    return {
      store: useStore(),
      row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    };
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    // Handle physical keyboard input
    handleKeyDown(event) {
      const key = event.key.toLowerCase();
      if (key === 'enter') {
        this.confirmAction(event);
      } else if (key === 'backspace' || key === 'delete') {
        this.deleteLetter();
      } else if (key === ' ') {
        event.preventDefault(); // Prevent default spacebar scrolling
        this.handleSpacebar();
      } else if (/^[a-z]$/.test(key)) {
        this.selectLetter(key);
      }
    },

    // Ensure spacebar only toggles Guess Mode
    handleSpacebar() {
      if (!this.store.isGuessMode && this.store.guesses === 0) {
        alert('You need at least one guess remaining to enter Guess Mode!');
        return;
      }
      this.toggleGuessMode();
    },

    getKeyClass(key) {
      return {
        correct: this.store.guessedLetters.includes(key) && this.store.currentPhrase.includes(key),
        incorrect: this.store.guessedLetters.includes(key) && !this.store.currentPhrase.includes(key),
        selected: this.store.currentTypedLetter === key,
      };
    },

    getLetterCost(letter) {
      return this.store.letterCost(letter);
    },

    selectLetter(key) {
      if (this.store.guessedLetters.includes(key)) return; // Ignore if already guessed
      if (this.store.currentTypedLetter === key) {
        this.store.currentTypedLetter = ''; // Deselect letter
        return;
      }
      if (this.store.isGuessMode) {
        this.store.fillActiveBox(key); // Fill active box in Guess Mode
      } else {
        this.store.currentTypedLetter = key; // Select letter
      }
    },

    confirmAction(event) {
      if (this.store.pendingPurchase) {
        this.handlePurchase(event); // Handle the purchase logic
      } else if (this.store.isGuessMode) {
        if (this.store.currentInput.includes('_')) {
          alert('Please fill all spaces before submitting your guess!');
          return;
        }
        this.store.submitGuess(); // Submit Guess Mode input
      } else if (this.store.currentTypedLetter) {
        this.store.guessLetter(this.store.currentTypedLetter); // Confirm normal letter
        this.store.currentTypedLetter = ''; // Clear selected letter
      }
    },

    handlePurchase(event) {
      if (this.store.pendingPurchase === 'guess') {
        this.store.confirmPendingPurchase(); // Confirm guess purchase
      } else if (this.store.pendingPurchase === 'hint') {
        this.store.confirmPendingPurchase(); // Confirm hint purchase
      }
      this.store.pendingPurchase = null; // Reset the pending purchase

      if (event) {
        event.target.blur(); // Remove focus from button
      }
    },

    deleteLetter() {
      if (this.store.isGuessMode) {
        this.store.deleteActiveBox();
      }
    },

    toggleGuessMode() {
      this.store.toggleGuessMode();
    },

    initiatePurchase(type, event) {
      if (this.store.pendingPurchase === type) {
        this.store.pendingPurchase = null; // Deselect if already selected
      } else {
        this.store.pendingPurchase = type; // Set pending purchase
      }

      if (event) {
        event.target.blur(); // Remove focus from button
      }
    },
  },
};
</script>

<style scoped>
/* Category Styling */
.category {
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

/* General Keyboard Layout */
.keyboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* Key Rows Layout */
.key-row {
  display: flex;
  justify-content: center;
}

/* Button Styling */
button {
  position: relative;
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

button span {
  font-size: 16px;
  font-weight: bold;
}

button .letter-cost {
  font-size: 12px;
  color: #555;
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
}

/* Button States */
button.correct {
  background-color: #28a745;
  color: white;
}

button.incorrect {
  background-color: #dc3545;
  color: white;
}

button.selected {
  background-color: #007bff;
  color: white;
}

button.active {
  background-color: orange;
}

button.ready {
  background-color: #28a745;
}

/* Controls Section */
.controls {
  margin-top: 15px;
}

.controls button {
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.controls button:hover {
  background-color: #0056b3;
}

.controls button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Top Controls Layout */
.top-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

/* Highlight selected buttons */
button.selected {
  background-color: #007bff;
  color: #fff;
}
</style>
