<template>
  <div class="game">
    <canvas ref="gameCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { Game } from "../Scenes/Game";
import { useGameStateContext } from "../Providers/GameStateProvider";
import { useInputMapContext } from "../Providers/InputMapProvider";
import { useGamePlayContext } from "../Providers/GamePlayProvider";

export default {
  setup() {
    const gameState = useGameStateContext();
    const inputMap = useInputMapContext();
    const gamePlay = useGamePlayContext();
    const gameCanvas = ref();

    onMounted(() => {
      if (gameCanvas.value) {
        const game = new Game(gameCanvas.value, {
          gameState,
          inputMap,
          gamePlay,
        });
        game.GameLoop();
      }
    });

    return {
      gameCanvas,
    };
  },
};
</script>

<style>
.game {
  height: 100vh;
  width: 100vw;
}

canvas {
  height: 100%;
  width: 100%;
}
</style>