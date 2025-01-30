<template>
  <div class="phrase-display-wrapper">
    <!-- Category Display -->
    <div class="category">
      <p>Category: <strong>{{ category }}</strong></p>
    </div>

    <!-- Phrase Display -->
    <div class="phrase-display">
      <template v-for="(char, index) in displayPhrase" :key="index">
        <!-- Letter Box -->
        <div
          v-if="char !== ' '"
          :class="[
            'phrase-box',
            { active: store.isGuessMode && index === store.activeBoxIndex },
          ]"
        >
          <span v-if="char !== '_'">{{ char }}</span>
        </div>
        <!-- Space Between Words -->
        <div v-else class="phrase-space"></div>
      </template>
    </div>
  </div>
</template>

<script>
import { useStore } from '../store';
import { computed, watch } from 'vue';

export default {
  name: 'PhraseDisplay',
  setup() {
    const store = useStore();

    // Computed properties for reactivity
    const category = computed(() => store.category);
    const displayPhrase = computed(() => {
      if (!store.currentPhrase) return [];
      const phraseArray = store.currentPhrase.split('');

      return phraseArray.map((char, index) => {
        if (char === ' ') return ' ';
        return store.correctPositions[index] || (store.isGuessMode ? store.currentInput[index] || '_' : '_');
      });
    });

    // Watch for phrase updates and reset correct positions
    watch(() => store.currentPhrase, () => {
      store.correctPositions = Array(store.currentPhrase.length).fill(null);
    });

    return { store, category, displayPhrase };
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
  box-shadow: 0 0 10px orange;
}

/* Space Styling */
.phrase-space {
  width: 20px;
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
