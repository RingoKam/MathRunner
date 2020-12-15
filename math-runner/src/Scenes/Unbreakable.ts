import * as BABYLON from "babylonjs"
import { Vector3 } from 'babylonjs';

export class Unbreakable {

    private scene : BABYLON.Scene;
    private mesh : BABYLON.Mesh
    private index = 0;

    private meshName = "unbreakable";

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.mesh = BABYLON.Mesh.CreateBox("unbreakable", 0.5, this.scene);
        this.mesh.position = new Vector3(0, -100, 0);
        this.mesh.material = this.scene.getMaterialByName("unbreakable");
    }

    createInstance() {
        const instanceMesh = this.mesh.createInstance(`${this.meshName}`);
        this.index++;
        return instanceMesh;
    }
}