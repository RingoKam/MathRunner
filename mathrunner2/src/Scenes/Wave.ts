import { GamePlayProvider } from '@/Providers/GamePlayProvider';
import * as BABYLON from "babylonjs"
import { TransformNode, Vector3 } from 'babylonjs';
import { Answer } from './Answer';

export const location = [-3, 0, 3];


export class Wave {

    private scene: BABYLON.Scene;
    private mesh: BABYLON.Mesh;
    private gamePlayProvider: GamePlayProvider
    private wave : BABYLON.TransformNode;
    private animation: BABYLON.Nullable<BABYLON.Animatable> = null;
    private meshName = "unbreakable";

    constructor(scene: BABYLON.Scene, gamePlayProvider: GamePlayProvider) {
        this.scene = scene;
        this.gamePlayProvider = gamePlayProvider;
        this.mesh = BABYLON.Mesh.CreateBox("unbreakable", 0.5, this.scene);
        this.mesh.position = new Vector3(0, -100, 0);
        this.mesh.material = this.scene.getMaterialByName("unbreakable");
        this.wave = new TransformNode("wave", this.scene);
        this.scene.onBeforeAnimationsObservable.add(() => {
            if (this.animation != null) {
                this.animation.speedRatio = this.gamePlayProvider.animationTimeFrame.value;
            }
        })
    }

    createWave() {
       
        const answers = location.map(x => {
            const answer = new Answer(this.scene);
            answer.transform.position = new BABYLON.Vector3(x, 0, 0);
            answer.transform.setParent(this.wave);
            return answer;
        })

        const to = new BABYLON.Vector3(0, 0, 0);
        const from = new BABYLON.Vector3(0, 0, 100);
        //animate the wave
        this.animation = BABYLON.Animation.CreateAndStartAnimation("move", this.wave, "position", 30, 100, from, to);
        return {
            answers: answers,
            animation: this.animation
        };
    }

    createInstance() {
        const instanceMesh = this.mesh.createInstance(`${this.meshName}`);
        return instanceMesh;
    }
}