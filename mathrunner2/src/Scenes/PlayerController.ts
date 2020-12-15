import { GameControls, InputMapProvider } from '../Providers/InputMapProvider'
import * as BABYLON from "babylonjs"
import { ActionManager, ExecuteCodeAction, Mesh, Scene } from 'babylonjs'
import { GamePlayProvider } from '@/Providers/GamePlayProvider'

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
        this.playerMesh.actionManager.registerAction(new ExecuteCodeAction(
            {
                trigger: ActionManager.OnIntersectionEnterTrigger,
                parameter: this.scene.getMeshByName("unbreakable")
            }, (event) => {
                console.log(event);
                this.health -= 1;
                //collide with unbreakable block, health -1
                if (this.health <= 0) {
                    //kill this mesh
                    //go to end game state
                    //animation    
                    
                }
            }))

        this.scene.onBeforeAnimationsObservable.add(this.detectMovement.bind(this))
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
        const { x, y, z } = this.playerMesh.position
        this.playerMesh.position.set(x + pos, y, z);
    }
}