import { GameStateProvider, PossibleGameState } from '@/Providers/GameStateProvider';
import { AbstractMesh, FadeInOutBehavior, Scene, SceneLoader, TimerState, Vector3, Animation, Mesh, Animatable } from 'babylonjs';

const scenaryXLocations = [16, 13, 11, -9, -8, -7, -6, 6, 7, 8, 9, 11, 13, 16];

export default class Scenary {

    scene: Scene;
    meshes: Mesh[] = []
    gameState: GameStateProvider;
    animations: Animatable[] = [];
    lastFrames: number[] = [];

    constructor(scene: Scene, gameState: GameStateProvider) {
        this.scene = scene;
        this.gameState = gameState;
    }

    async loadScenary() {
        const promises = ["DeadTree_1", "DeadTree_2", "DeadTree_3"].map(fileName => {
            return SceneLoader.ImportMeshAsync(fileName, `/model/`, `${fileName}.babylon`, this.scene).then(obj => {
                const mesh = obj.meshes[0] as Mesh
                mesh.isVisible = false
                mesh.position = new Vector3(0, -100, 0);
                this.meshes.push(mesh)
            })
        })
        return Promise.all(promises)
    }

    GenerateScenary() {
        //every 1 second randomly select a locations that will spawn tree
        window.setInterval(() => {
            if (this.gameState.GameState.value !== PossibleGameState.ongoing) return;
            scenaryXLocations
                .filter(_ => Math.random() > 0.75)
                .forEach(loc => {
                    //create a new instance of
                    const mesh = this.meshes[0].createInstance("instance");
                    mesh.position = new Vector3(loc, 0, 0);
                    //randomly assign a material

                    //start the animation
                    const animation = Animation.CreateAndStartAnimation("scenary", mesh, "position.z", 30, 100, 100, 0, Animation.ANIMATIONLOOPMODE_CONSTANT);
                    animation.onAnimationEnd = () => mesh.dispose();
                    this.animations.push(animation);
                })
        }, 1000)
    }

    Pause() {
        this.animations.forEach((a, i) => {
            this.lastFrames[i] = a.masterFrame
            a.pause()
        })
    }

    resume() {
        this.animations.forEach((a, i) => {
            a.restart();
            a.goToFrame(this.lastFrames[i]);
        })
    }
} 