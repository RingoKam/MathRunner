import { GamePlayProvider } from '../Providers/GamePlayProvider';
import { GameStateProvider } from '../Providers/GameStateProvider';
import { InputMapProvider } from '../Providers/InputMapProvider';
import * as BABYLON from "babylonjs"
import { Color4 } from 'babylonjs';

import { PlayerController } from './PlayerController';
import { Unbreakable } from './Unbreakable';

export class Game {

    engine: BABYLON.Engine
    scene: BABYLON.Scene
    player: PlayerController;
    camera: BABYLON.FreeCamera;
    unbreakable: Unbreakable;

    constructor(canvasDom: HTMLCanvasElement, gameContext: { 
        gameState: GameStateProvider,
        inputMap: InputMapProvider,
        gamePlay: GamePlayProvider 
    }) {
        this.engine = new BABYLON.Engine(canvasDom, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.createCamera();
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.predefinedMaterial();

        //turn on debugger
        // this.scene.debugLayer.show();

        this.unbreakable = new Unbreakable(this.scene);
        this.player = new PlayerController(this.scene, gameContext.inputMap);
    }

    async GameLoop(): Promise<void> {
        //setup game state
        this.setInitialGameState();
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }

    predefinedMaterial() {
        var mat = new BABYLON.StandardMaterial("player-material", this.scene);
        mat.emissiveColor = BABYLON.Color3.FromHexString("#ffecd6");
        
        var enemymat = new BABYLON.StandardMaterial("unbreakable", this.scene);
        enemymat.emissiveColor = new BABYLON.Color3(0.051, 0.169, 0.271);
        
        var mat2 = new BABYLON.StandardMaterial("breakable", this.scene);
        mat2.emissiveColor = new BABYLON.Color3(1, 0.169, 0.271);
        mat2.alpha = 0.5;
    }

    setInitialGameState() {
        this.scene.clearColor = new Color4(1, 0.667, 0.369);
        let enemy = this.unbreakable.createInstance();
        const to = new BABYLON.Vector3(0, 0 , 0);
        const from = new BABYLON.Vector3(0, 0 , 100);
        BABYLON.Animation.CreateAndStartAnimation("move", enemy, "position", 30, 100, from, to);
    }

    createCamera() {
        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
        camera.position = new BABYLON.Vector3(0.5, 9, -17.8);
        camera.rotation = new BABYLON.Vector3(0.4653956558758062, -0.07168276100777128, 0);
        this.camera = camera;
    }
}