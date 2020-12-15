import { GamePlayProvider } from '../Providers/GamePlayProvider';
import { GameStateProvider } from '../Providers/GameStateProvider';
import { InputMapProvider } from '../Providers/InputMapProvider';
import * as BABYLON from "babylonjs"
import { Color4 } from 'babylonjs';

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

        //turn on debugger
        // this.scene.debugLayer.show();

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
        //setup game state
        this.setInitialGameState();

        let { animation, answers } = this.unbreakable.createWave();

        const solutions = this.gameContext.gamePlay.problem.value.solutions;
        answers.forEach((answer, i) => {
            answer.setText(solutions[i]);
        })

        animation.onAnimationLoop = () => {
            //check if player get the right answer
            const { playerChoiceindex, problem, health, rightAnswer } = this.gameContext.gamePlay
            console.log(playerChoiceindex.value);
            console.log(problem.value.solutionIndex);
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
    }

    setInitialGameState() {
        this.scene.clearColor = new Color4(1, 0.667, 0.369);

    }

    createCamera() {
        const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.position = new BABYLON.Vector3(0, 9, -10);
        camera.rotation = new BABYLON.Vector3(0.4653956558758062, 0, 0);
        return camera;
    }
}