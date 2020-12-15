<template>
    <div class="game-hud">
        <div class="header">
            <div class="health">
                HP: {{ health }}
            </div>
            <div class="setting">
                <button>Pause</button>
            </div>
        </div>
        <div>
            {{ gameProblem }}
        </div>
        <div class="footer">
            <div class="height">
                Height:
            </div>  
        </div>
    </div>
</template>

<script>
import { useGamePlayContext } from '@/Providers/GamePlayProvider'
import { computed, watch } from "vue"
import { useInputMapContext } from '@/Providers/InputMapProvider';
export default {
    setup() {
        const gamePlay = useGamePlayContext();
        const inputState = useInputMapContext();

        const gameProblem = computed(() => {
            if(!gamePlay.problem.value) {
                return "";
            }
            const { var1, var2, operator } = gamePlay.problem.value;
            return `${var1} ${operator} ${var2} = ?`
        })

        const health = gamePlay.health;

        const captureKeyUp = inputState.captureKeyUp

        return {
            health,
            gameProblem,
            captureKeyUp
        }
    }
}
</script>

<style scoped>
    .game-hud {
        display: none;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        height: 100%;
        width: 100%;
    }

    .header {
        display:flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
