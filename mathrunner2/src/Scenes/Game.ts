import { GamePlayProvider } from '../Providers/GamePlayProvider';
import { GameStateProvider } from '../Providers/GameStateProvider';
import { InputMapProvider } from '../Providers/InputMapProvider';
import * as BABYLON from "babylonjs"
import { Color4, Vector3, Vector4 } from 'babylonjs';

import { PlayerController } from './PlayerController';
import { Wave } from './Wave';
import { generateProblem } from '@/helpers/ProblemGenerator';

export class Game {

    engine: BABYLON.Engine
    scene: BABYLON.Scene
    player: PlayerController;
    camera: BABYLON.FreeCamera;
    unbreakable: Wave;
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
        
        this.predefinedMaterial();
        this.setGameScene();

        //turn on debugger
        this.scene.debugLayer.show();

        this.unbreakable = new Wave(this.scene, gameContext.gamePlay);
        this.player = new PlayerController(this.scene, gameContext.inputMap, gameContext.gamePlay);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        })

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    async GameLoop(): Promise<void> {
        let { animation, answers } = this.unbreakable.createWave();

        const solutions = this.gameContext.gamePlay.problem.value.solutions;
        answers.forEach((answer, i) => {
            answer.setText(solutions[i]);
        })
 
        animation.onAnimationLoop = () => {
            //check if player get the right answer
            const { playerChoiceindex, problem, health, rightAnswer } = this.gameContext.gamePlay
            if (playerChoiceindex.value == problem.value.solutionIndex) {
                rightAnswer.value += 1;
            } else {
                health.value -= 1;
            }

            //check win condition
            if (health.value <= 0) {
                animation.stop();
                this.gameContext.gameState.gameComplete();
            }

            //else game goes on
            this.gameContext.gamePlay.problem.value = generateProblem();
            const solutions = this.gameContext.gamePlay.problem.value.solutions;
            answers.forEach((answer, i) => {
                answer.setText(solutions[i]);
            })
        }
    }

    predefinedMaterial() {
        var mat = new BABYLON.StandardMaterial("player-material", this.scene);
        mat.emissiveColor = BABYLON.Color3.FromHexString("#ffecd6");

        var enemymat = new BABYLON.StandardMaterial("unbreakable", this.scene);
        enemymat.emissiveColor = new BABYLON.Color3(0.051, 0.169, 0.271);

        var mat2 = new BABYLON.StandardMaterial("breakable", this.scene);
        mat2.emissiveColor = new BABYLON.Color3(1, 0.169, 0.271);
        mat2.alpha = 0.5;

        var mat3 = new BABYLON.StandardMaterial("ground", this.scene);
        mat3.emissiveColor = BABYLON.Color3.FromHexString("#203c56");
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

    createCamera() {
        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.position = new BABYLON.Vector3(0, 9, -10);
        camera.rotation = new BABYLON.Vector3(0.4653956558758062, 0, 0);
        return camera;
    }
}