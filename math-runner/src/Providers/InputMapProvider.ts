import { inject, provide, reactive } from 'vue';

const InputMapContext = Symbol();

export enum GameControls {
    up,
    right,
    left, 
    down, 
    speedUp
}

export class InputMapProvider {
    public inputMap: Map<GameControls, boolean>

    constructor() {
      this.inputMap = reactive<Map<GameControls, boolean>>(new Map());
    }

    setInput(key: GameControls) {
        this.inputMap.set(key, true);
    }

    resetControls() {
        this.inputMap.clear();
    }
}

export function useInputMapProvider() {
    const provider = new InputMapProvider();
    provide(InputMapContext, provider);
    return provider;
  }
  
  export function useInputMapContext(): any {
    const context = inject<InputMapProvider>(InputMapContext);
    if (!context) {
      throw new Error('Provider need context');
    }
    return context;
  }