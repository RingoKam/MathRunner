import { inject, provide, ref, Ref } from 'vue';
import { Problem } from '../helpers/ProblemGenerator';

export class GamePlayProvider {

    public problemQueue: Problem[];
    public timer: Ref<number>;  
        
    constructor() {
        this.timer = ref(0);
    }

    updateTimer(delta) {
        this.timer.value += delta;
    }
}

const GamePlay_Context = Symbol("gameplay");

export function useGamePlayProvider() {
    const provider = new GamePlayProvider();
    provide(GamePlay_Context, provider);
    return provider;
}

export function useGamePlayContext(): any {
    const context = inject<GamePlayProvider>(GamePlay_Context);
    if (!context) {
        throw new Error('Provider need context');
    }
    return context;
}