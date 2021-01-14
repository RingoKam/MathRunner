import { GameControls, InputMapProvider } from '../Providers/InputMapProvider'
import * as BABYLON from "babylonjs"
import { ActionManager, ExecuteCodeAction, Mesh, Scene, SceneLoader, TransformNode, Animation } from 'babylonjs'
import { GamePlayProvider } from '@/Providers/GamePlayProvider'
import { answerLocation } from "./Wave"

export class PlayerController {

    private scene: BABYLON.Scene
    private player: TransformNode
    // private currentPosition: { x: number, z: number };
    private inputMap: InputMapProvider;
    private gamePlayProvider: GamePlayProvider;
    private crashAnimation: Animation;
    private speedUoAnimation: Animation;
    private moveLeftAnimation: Animation;
    private moveRightAnimation: Animation;


    constructor(scene: Scene, inputMap: InputMapProvider, gamePlayProvider: GamePlayProvider) {
        this.scene = scene;
        this.inputMap = inputMap;
        this.gamePlayProvider = gamePlayProvider;
        this.player = new TransformNode("player", this.scene)
        this.scene.onBeforeRenderObservable.add(this.detectMovement.bind(this))

        //create differant animation
        const framerate = 30
        //setup crash animations
        this.crashAnimation = new Animation("got hit", "rotation.y", framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const rotate_keys = [
            { frame: 0, value: 0 },
            { frame: 0.25 * framerate, value: 0.30 },
            { frame: 0.5 * framerate, value: 0 },
            { frame: 0.7 * framerate, value: -0.50 },
            { frame: 1 * framerate, value: 0 }
        ];
        this.crashAnimation.setKeys(rotate_keys);
        //setup speedup animation
        const speedup_Keys = [
            { frame: 0 * framerate, value: 0 },
            { frame: 0.25 * framerate, value: 0.25 },
            { frame: 0.75 * framerate, value: 0.50 },
            { frame: 1 * framerate, value: 0 },
        ]
        this.speedUoAnimation = new Animation("speedup", "position.z", framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        this.speedUoAnimation.setKeys(speedup_Keys);
        //setup move animation
        this.moveRightAnimation = new Animation("moveright", "rotation.y", framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const tilt_right_keys = [
            { frame: 0 * framerate, value: 0 },
            { frame: 0.01 * framerate, value: 0.10 },
            { frame: 0.1 * framerate, value: 0.20 },
            { frame: 0.2 * framerate, value: 0.10 },
            { frame: 1 * framerate, value: 0 }
        ]
        this.moveRightAnimation.setKeys(tilt_right_keys);
        const tilt_left_keys = tilt_right_keys.map(framekey => ({ frame: framekey.frame, value: -framekey.value}));
        this.moveLeftAnimation = new Animation("moveleft", "rotation.y", framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        this.moveLeftAnimation.setKeys(tilt_left_keys);
    }

    crash() {
        this.scene.beginDirectAnimation(this.player, [this.crashAnimation], 0, 30, false)
    }

    async loadPlayer() {
        return SceneLoader.ImportMeshAsync("sedan", `http://${window.location.host}/model/`, "car.babylon", this.scene).then((v) => {
            v.meshes[0].setParent(this.player);
        })
    }

    detectMovement() {
        if (this.inputMap.inputMap.has(GameControls.Down)) {
            this.moveZ(-1);
        }
        if (this.inputMap.inputMap.has(GameControls.Up)) {
            this.scene.beginDirectAnimation(this.player, [this.speedUoAnimation], 0, 30, false)
            this.moveZ(1);
        }
        if (this.inputMap.inputMap.has(GameControls.Left)) {
            this.scene.beginDirectAnimation(this.player, [this.moveLeftAnimation], 0, 30, false);    
            this.moveX(-1);
        }
        if (this.inputMap.inputMap.has(GameControls.Right)) {
            this.scene.beginDirectAnimation(this.player, [this.moveRightAnimation], 0, 30, false);    
            this.moveX(1);
        }
        this.inputMap.resetControls();
    }

    moveZ(pos: number) {
        if (this.gamePlayProvider.animationTimeFrame.value == 1) {
            if (pos > 0) {
                this.gamePlayProvider.setAnimationTimeFrame(1.5);
            } else {
                this.gamePlayProvider.setAnimationTimeFrame(0.75);
            }
        }
        else if (this.gamePlayProvider.animationTimeFrame.value == 1.5) {
            if (pos < 0) {
                this.gamePlayProvider.setAnimationTimeFrame(1);
            }
        }
        else if (this.gamePlayProvider.animationTimeFrame.value == 0.75) {
            if (pos > 0) {
                this.gamePlayProvider.setAnimationTimeFrame(1);
            }
        }
    }

    moveX(pos: number) {
        const current = this.gamePlayProvider.playerChoiceindex.value;
        if (answerLocation[current] === undefined) {
            this.gamePlayProvider.playerChoiceindex.value = 1;
        }
        const nextIndex = current + pos;
        if (answerLocation[nextIndex] !== undefined) {
            this.gamePlayProvider.playerChoiceindex.value = nextIndex;
            this.player.position.set(answerLocation[nextIndex], 0, 0);
        } else {
            console.log(this.gamePlayProvider.playerChoiceindex.value);
            console.log("hit boundary")
        }
    }
}