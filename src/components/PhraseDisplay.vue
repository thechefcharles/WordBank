<template>
  <div class="phrase-display-wrapper">
    <!-- Category Display -->
    <div class="category">
      <p>Category: <strong>{{ store.category }}</strong></p>
    </div>

    <!-- Phrase Display -->
    <div class="phrase-display">
      <template v-for="(char, index) in displayPhrase" :key="index">
        <div
          v-if="char !== ' '"
          :class="[
            'phrase-box',
            { active: store.isGuessMode && index === store.activeBoxIndex },
          ]"
        >
          <span v-if="char !== '_'">{{ char }}</span>
        </div>
        <div v-else class="phrase-space"></div>
      </template>
    </div>
  </div>
</template>

<script>
import { useStore } from '../store';

export default {
  name: 'PhraseDisplay',
  computed: {
    store() {
      return useStore();
    },
    displayPhrase() {
      const phraseArray = this.store.currentPhrase.split('');
      return phraseArray.map((char, index) => {
        if (char === ' ') {
          return ' ';
        }
        return (
          this.store.correctPositions[index] ||
          (this.store.isGuessMode ? this.store.currentInput[index] || '_' : '_')
        );
      });
    },
  },
};
</script>

<style scoped>
/* Wrapper for category and phrase */
.phrase-display-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

/* Category Styling */
.category {
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

/* Phrase Display Layout */
.phrase-display {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Box Styling */
.phrase-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.phrase-box.active {
  border-color: orange;
  box-shadow: 0 0 10px orange; /* Highlight active box */
}

/* Space Styling */
.phrase-space {
  width: 20px; /* Space between words */
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .phrase-box {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }

  .phrase-space {
    width: 15px;
  }

  .category {
    font-size: 16px;
  }
}
</style>
