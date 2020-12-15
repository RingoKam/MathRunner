import { GamePlayProvider } from '@/Providers/GamePlayProvider';
import * as BABYLON from "babylonjs"
import { TransformNode, Vector3 } from 'babylonjs';

export class Unbreakable {

    private scene: BABYLON.Scene;
    private mesh: BABYLON.Mesh;
    private gamePlayProvider: GamePlayProvider
    private index = 0;
    private wave : BABYLON.TransformNode ;

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
        const location = [-1, 0, 1];
       
        location.map(x => {
            const enemy = this.createInstance();
            enemy.position = new BABYLON.Vector3(x, 0, 0);
            enemy.setParent(this.wave);
        })

        const to = new BABYLON.Vector3(0, 0, 0);
        const from = new BABYLON.Vector3(0, 0, 100);
        //animate the wave
        this.animation = BABYLON.Animation.CreateAndStartAnimation("move", this.wave, "position", 30, 100, from, to);
        this.animation.onAnimationLoop = () => {
            //check win condition
            
        }
    }

    createInstance() {
        const instanceMesh = this.mesh.createInstance(`${this.meshName}`);
        return instanceMesh;
    }
}