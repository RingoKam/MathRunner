import { GamePlayProvider } from '../Providers/GamePlayProvider';
import { GameStateProvider } from '../Providers/GameStateProvider';
import { InputMapProvider } from '../Providers/InputMapProvider';
import * as BABYLON from "babylonjs"
import { Color4, SceneLoader, Vector3, Vector4, AssetsManager } from 'babylonjs';
import "@babylonjs/loaders/glTF";


import { PlayerController } from './PlayerController';
import { Wave } from './Wave';
import { generateProblem } from '@/helpers/ProblemGenerator';
import Scenary from './Scenary';

export class Game {

    engine: BABYLON.Engine
    scene: BABYLON.Scene
    scenary: Scenary
    player: PlayerController;
    camera: BABYLON.FreeCamera;
    wave: Wave;
    gameContext: {
        gameState: GameStateProvider,
        inputMap: InputMapProvider,
        gamePlay: GamePlayProvider
    }

    constructor(canvasDom: HTMLCanvasElement, gameContext: {
        gameState: GameStateProvider,
        inputMap: InputMapProvider,
        gamePlay: GamePlayProvider
    }) {
        this.gameContext = gameContext;
        this.engine = new BABYLON.Engine(canvasDom, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = this.createCamera();
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.specular = new BABYLON.Color3(1,1,1)

        this.predefinedMaterial();
        this.setGameScene();

        this.wave = new Wave(this.scene, gameContext.gamePlay);
        this.player = new PlayerController(this.scene, gameContext.inputMap, gameContext.gamePlay);
        this.scenary = new Scenary(this.scene, gameContext.gameState);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        })

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    public startGame() {
        this.wave.createWave(); 
        this.scenary.GenerateScenary();     
        this.wave.onWaveEnd.add(() => {
            //check if player get the right answer
            const { playerChoiceindex, problem, health, rightAnswer } = this.gameContext.gamePlay
            if (playerChoiceindex.value == problem.value.solutionIndex) {
                rightAnswer.value += 1;
            } else {
                this.player.crash()
                health.value -= 1;
            }
            //check lose condition
            if (health.value <= 0) {
                this.gameContext.gameState.gameComplete();
                this.wave.reset();
            } else {
                this.wave.setAnswer();
            }
        })
    }

    public pauseGame() {
        this.wave.pauseWave();
        this.scenary.Pause();
    }

    public resumeGame() {
        this.wave.resumeWave();
        this.scenary.resume();
    }

    public toggleDebugger() {
        if(this.scene.debugLayer.isVisible()) {
            this.scene.debugLayer.hide();
        } else {
            this.scene.debugLayer.show();
        }
    }

    predefinedMaterial() {
        var mat = new BABYLON.StandardMaterial("player-material", this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString("#ffecd6");

        var enemymat = new BABYLON.StandardMaterial("sign", this.scene);
        enemymat.diffuseColor = BABYLON.Color3.FromHexString("#8d697a");

        var mat3 = new BABYLON.StandardMaterial("ground", this.scene);
        mat3.diffuseColor = BABYLON.Color3.FromHexString("#203c56");
    }

    setGameScene() {
        this.scene.clearColor = new Color4(1, 0.667, 0.369);
        const ground = BABYLON.MeshBuilder.CreatePlane("road", {
            width: 11,
            height: 1000,
        }, this.scene)
        ground.material = this.scene.getMaterialByName("ground")
        ground.position = new Vector3(0, -1, 0);
        ground.rotate(new BABYLON.Vector3(1, 0, 0), 1.5708);
    }

    async loadGameAsset() {
        const loadPlayer = this.player.loadPlayer()
        const loadScenary = this.scenary.loadScenary();
        Promise.all([loadPlayer, loadScenary])
    }

    createCamera() {
        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.position = new BABYLON.Vector3(0, 9, -10);
        camera.rotation = new BABYLON.Vector3(0.4653956558758062, 0, 0);
        return camera;
    }
}