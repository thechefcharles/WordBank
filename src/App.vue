<script setup>
import { useStore } from './store';
import Keyboard from './components/Keyboard.vue';
import PhraseDisplay from './components/PhraseDisplay.vue';

// Access the Pinia store
const store = useStore();

// Destructure necessary state from the store for simplicity
const { bankroll, guesses, winState, lossState, resetGame } = store;
</script>

<template>
  <div id="app">
    <!-- Header Section -->
    <header>
      <h1>WordBank</h1>
      <div class="game-info">
        <p>Bankroll: <strong>${{ bankroll }}</strong></p>
        <p>Guesses Remaining: <strong>{{ guesses }}</strong></p>
      </div>
    </header>

    <!-- Phrase Display Component -->
    <PhraseDisplay />

    <!-- Keyboard Component -->
    <Keyboard />

    <!-- Win Modal -->
    <div v-if="winState" class="modal">
      <div class="modal-content">
        <h2>Congratulations!</h2>
        <p>You’ve successfully completed the phrase!</p>
        <p><strong>Remaining Bankroll:</strong> ${{ bankroll }}</p>
        <button @click="resetGame">Play Again</button>
      </div>
    </div>

    <!-- Loss Modal -->
    <div v-if="lossState" class="modal">
      <div class="modal-content">
        <h2>Game Over</h2>
        <p>You’ve run out of guesses and funds.</p>
        <button @click="resetGame">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* General Layout */
#app {
  text-align: center;
  margin: 0 auto;
  padding: 20px;
  max-width: 600px;
}

header {
  margin-bottom: 20px;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.game-info {
  display: flex;
  justify-content: space-around;
  font-size: 1.2rem;
}

body {
  font-size: 16px;
  line-height: 1.5;
}

/* Adjust font sizes for mobile */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }

  header h1 {
    font-size: 1.8rem;
  }
}

/* Responsive Keyboard Layout */
.keyboard {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.key-row {
  display: flex;
  overflow-x: auto; /* Allow scrolling if the keyboard is too wide */
  gap: 5px;
}

button {
  min-width: 48px; /* Ensure buttons are touch-friendly */
  min-height: 48px;
  font-size: 1rem;
  padding: 10px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:active {
  background-color: #0056b3;
  transform: scale(0.95); /* Touch feedback */
}

/* Adjust button styles for mobile */
@media (max-width: 768px) {
  .keyboard {
    flex-direction: column;
  }

  .key-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
  }

  button {
    font-size: 14px;
  }

  .controls button {
    font-size: 16px;
    margin: 5px;
  }
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
  width: 80%;
  max-width: 400px;
  border-radius: 10px;
  padding: 20px;
}

.modal-content {
  text-align: center;
}

.modal-content h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.modal-content button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 15px;
}

.modal-content button:hover {
  background-color: #0056b3;
}

/* Modal Scrollable Adjustments */
.modal {
  max-height: 90vh;
  overflow-y: auto;
}
</style>

