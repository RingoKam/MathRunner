import { GamePlayProvider } from '@/Providers/GamePlayProvider';
import * as BABYLON from "babylonjs"
import { Observable, TransformNode, Vector3 } from 'babylonjs';
import { Answer } from './Answer';
import { generateProblem } from '@/helpers/ProblemGenerator';

export const answerLocation = [-3, 0, 3];


export class Wave {

    public onWaveEnd: Observable<any>
    private scene: BABYLON.Scene;
    private mesh: BABYLON.Mesh;
    private gamePlayProvider: GamePlayProvider
    private wave: BABYLON.TransformNode;
    private answers: Answer[];
    private animation: BABYLON.Nullable<BABYLON.Animatable> = null;
    private meshName = "unbreakable";
    private lastFrame: number;

    constructor(scene: BABYLON.Scene, gamePlayProvider: GamePlayProvider) {
        this.scene = scene;
        this.gamePlayProvider = gamePlayProvider;
        // this.mesh = BABYLON.Mesh.CreateBox("unbreakable", 0.5, this.scene);
        // this.mesh.position = new Vector3(0, -100, 0);
        // this.mesh.material = this.scene.getMaterialByName("unbreakable");
        this.wave = new TransformNode("wave", this.scene);
        this.answers = answerLocation.map(loc => {
            const answer = new Answer(this.scene);
            answer.transform.position = new BABYLON.Vector3(loc, 0, 0);
            answer.transform.setParent(this.wave);
            return answer;
        })
        this.wave.position = new Vector3(0, -100, 0);
        this.scene.onBeforeAnimationsObservable.add(() => {
            if (this.animation != null) {
                this.animation.speedRatio = this.gamePlayProvider.animationTimeFrame.value;
            }
        })
    }

    createWave() {
        const to = new BABYLON.Vector3(0, 0, 0);
        const from = new BABYLON.Vector3(0, 0, 100);
        this.setAnswer();
        //animate the wave
        this.animation = BABYLON.Animation.CreateAndStartAnimation("move", this.wave, "position", 30, 100, from, to);
        this.onWaveEnd = this.animation.onAnimationLoopObservable;
    }

    pauseWave() {
        this.lastFrame = this.animation.masterFrame
        this.animation.pause();
    }

    resumeWave() {
        this.animation.restart()
        this.animation.goToFrame(this.lastFrame)
    }

    createInstance() {
        const instanceMesh = this.mesh.createInstance(`${this.meshName}`);
        return instanceMesh;
    }

    setAnswer() {
        const problem = generateProblem();
        this.gamePlayProvider.problem.value = problem;
        this.answers.forEach((answer, i) => {
            answer.setText(problem.solutions[i]);
        })
    }

    reset() {
        this.animation.stop();
        this.onWaveEnd.clear();
    }
}