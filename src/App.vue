<template>
  <div class="app">
    <GameHUD />
    <Game />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
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

    // const captureKeyUp = (e: any) => {
    //   inputMap.captureKeyUp(e.key);
    // }

    onMounted(() => {
      document.addEventListener("keyup", (event) => {
        inputMap.captureKeyUp(event.key);
      })
    }) 

    return {
      // captureKeyUp
    }
  },
});
</script>

<style>
</style>
