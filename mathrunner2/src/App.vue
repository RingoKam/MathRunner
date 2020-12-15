<template>
  <div class="app" @keyup="captureKeyUp">
    <GameHUD />
    <Game />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useGamePlayProvider } from "./Providers/GamePlayProvider";
import { useGameStateProvider } from "./Providers/GameStateProvider";
import { useInputMapProvider } from "./Providers/InputMapProvider";
import Game from "./components/Game.vue";
import GameHUD from "./components/GameHUD.vue";

export default defineComponent({
  name: "App",
  components: {Game, GameHUD},
  setup() {
    const inputMap = useInputMapProvider();
    useGamePlayProvider();
    useGameStateProvider();

    const captureKeyUp = (e: any) => {
      inputMap.captureKeyUp(e.key);
    }
    return {
      captureKeyUp
    }
  },
});
</script>

<style>
</style>
