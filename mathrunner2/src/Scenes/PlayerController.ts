import { GameControls, InputMapProvider } from '../Providers/InputMapProvider'
import * as BABYLON from "babylonjs"
import { ActionManager, ExecuteCodeAction, Mesh, Scene } from 'babylonjs'
import { GamePlayProvider } from '@/Providers/GamePlayProvider'
import { location } from "./Wave"

export class PlayerController {

    private scene: BABYLON.Scene
    private playerMesh: Mesh
    // private currentPosition: { x: number, z: number };
    private health = 1;
    private inputMap: InputMapProvider;
    private gamePlayProvider: GamePlayProvider; 

    constructor(scene: Scene, inputMap: InputMapProvider, gamePlayProvider: GamePlayProvider) {
        this.scene = scene;
        this.inputMap = inputMap;
        this.gamePlayProvider = gamePlayProvider;

        this.playerMesh = BABYLON.Mesh.CreateBox("player", 0.5, scene);
        this.playerMesh.material = this.scene.getMaterialByName("player-material");
        this.playerMesh.actionManager = new ActionManager(this.scene);
        this.scene.onBeforeRenderObservable.add(this.detectMovement.bind(this))
    }

    detectMovement() {
        if (this.inputMap.inputMap.has(GameControls.Down)) {
            this.moveZ(-1);
        }
        if (this.inputMap.inputMap.has(GameControls.Up)) {
            this.moveZ(1);
        }
        if (this.inputMap.inputMap.has(GameControls.Left)) {
            this.moveX(-1);
        }
        if (this.inputMap.inputMap.has(GameControls.Right)) {
            this.moveX(1);
        }
        this.inputMap.resetControls();
    }

    moveZ(pos: number) {
        console.log("moving z");
        if(this.gamePlayProvider.animationTimeFrame.value == 1) {
            if(pos > 0) {
                this.gamePlayProvider.setAnimationTimeFrame(1.5);
            } else {
                this.gamePlayProvider.setAnimationTimeFrame(0.75);
            }
        } 
        else if(this.gamePlayProvider.animationTimeFrame.value == 1.5) {
            if(pos < 0) {
                this.gamePlayProvider.setAnimationTimeFrame(1);
            }
        }
        else if(this.gamePlayProvider.animationTimeFrame.value == 0.75) {
            if(pos > 0) {
                this.gamePlayProvider.setAnimationTimeFrame(1);
            }
        }
    }

    moveX(pos: number) {
        console.log("moving x");
        const current = this.gamePlayProvider.playerChoiceindex.value;
        if(location[current] === undefined) {
            this.gamePlayProvider.playerChoiceindex.value = 1;
        }
        const nextIndex = current + pos;
        if(location[nextIndex] !== undefined) {
            this.gamePlayProvider.playerChoiceindex.value = nextIndex;
            this.playerMesh.position.set(location[nextIndex], 0, 0);
        } else {
            console.log(this.gamePlayProvider.playerChoiceindex.value);
            console.log("hit boundary")
        }
    }
}