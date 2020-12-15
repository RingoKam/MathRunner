import { inject, provide, ref, Ref } from 'vue';
import { Problem } from '../helpers/ProblemGenerator';

export class GamePlayProvider {

    // public problemQueue: Problem[];
    public timer: Ref<number>; 
    public animationTimeFrame: Ref<number>; 
        
    constructor() {
        this.timer = ref(0);
        this.animationTimeFrame = ref(1);
    }

    updateTimer(delta: number) {
        this.timer.value += delta;
    }

    setAnimationTimeFrame(timeFrame: number) {
        this.animationTimeFrame.value = timeFrame;
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