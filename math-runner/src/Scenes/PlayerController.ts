import { GameControls, InputMapProvider } from '../Providers/InputMapProvider'
import * as BABYLON from "babylonjs"
import { ActionManager, ExecuteCodeAction, Mesh, Scene } from 'babylonjs'

export class PlayerController {

    private scene: BABYLON.Scene
    private playerMesh: Mesh
    private currentPosition: { x: number, z: number };
    private health = 1;
    private inputMap: InputMapProvider;

    constructor(scene: Scene, inputMap: InputMapProvider) {
        this.scene = scene;
        this.inputMap = inputMap;

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
        const { x, y, z } = this.playerMesh.position
        this.playerMesh.position.set(x, y, z + pos);
    }

    moveX(pos: number) {
        const { x, y, z } = this.playerMesh.position
        this.playerMesh.position.set(x + pos, y, z);
    }
}