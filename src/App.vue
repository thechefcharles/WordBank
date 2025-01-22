<script setup>
import Keyboard from './components/Keyboard.vue';
import PhraseDisplay from './components/PhraseDisplay.vue';
import { useStore } from './store';

const store = useStore(); // Access the store to dynamically display game state
</script>

<template>
  <div id="app">
    <header>
      <h1>Word Game</h1>
      <div class="game-info">
        <p>Bankroll: <strong>${{ bankroll }}</strong></p>
        <p>Guesses Remaining: <strong>{{ guesses }}</strong></p>
      </div>
    </header>

    <PhraseDisplay />
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

<script>
import { useStore } from './store';
import Keyboard from './components/Keyboard.vue';
import PhraseDisplay from './components/PhraseDisplay.vue';

export default {
  name: 'App',
  components: {
    Keyboard,
    PhraseDisplay,
  },
  data() {
    return {
      store: useStore(), // Access the store
    };
  },
  computed: {
    bankroll() {
      return this.store.bankroll;
    },
    guesses() {
      return this.store.guesses;
    },
    winState() {
      return this.store.winState;
    },
    lossState() {
      return this.store.lossState;
    },
  },
  methods: {
    resetGame() {
      this.store.resetGame();
    },
  },
};
</script>
