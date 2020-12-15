<template>
    <div class="game-hud" @keydown="captureKeyUp">
        <div class="header">
            <div class="health">
                HP [] [] []
            </div>
            <div class="setting">
                <button>Pause</button>
            </div>
        </div>
        <div class="footer">
            <div class="height">
                Height:
            </div>  
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        const captureKeyUp = (e) => console.log(e) 
        return {
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
    }

    .header {
        display:flex;
        justify-content: space-between;
    }
</style>
