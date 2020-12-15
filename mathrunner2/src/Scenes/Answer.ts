import * as BABYLON from "babylonjs"
import { Vector3 } from 'babylonjs';

export class Answer {

    public transform: BABYLON.TransformNode
    private scene: BABYLON.Scene
    private textTexture: BABYLON.DynamicTexture;
    private textMaterial: BABYLON.StandardMaterial;
    private txtPlane: BABYLON.Mesh;
    private boxMesh: BABYLON.Mesh;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        //create the mesh 
        this.txtPlane = BABYLON.MeshBuilder.CreatePlane("plane", {width:1, height:1}, scene);
        this.txtPlane.position = new Vector3(0, 1.1, 0);
        this.textMaterial = new BABYLON.StandardMaterial("mat", this.scene);
        this.txtPlane.material = this.textMaterial;

        this.boxMesh = BABYLON.Mesh.CreateBox("answerbox", 1, this.scene);
        this.boxMesh.material = scene.getMaterialByName("unbreakable");
        this.boxMesh.position = new Vector3(0, 0, 0);

        //assign it to parent
        this.transform = new BABYLON.TransformNode("answer node", scene);
        this.txtPlane.setParent(this.transform);
        this.boxMesh.setParent(this.transform);
    }

    setText(text: string) {
        var font_size = 25;
        var font = "bold " + font_size + "px Arial";
        //Set height for plane
        var planeHeight = 2;
        //Set height for dynamic texture
        var DTHeight = 1.5 * font_size; //or set as wished
        //Calcultae ratio
        var ratio = planeHeight / DTHeight;
        //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
        var temp = new BABYLON.DynamicTexture("temp-texture", 64, this.scene, false);
        var tmpctx = temp.getContext();
        tmpctx.font = font;
        var DTWidth = tmpctx.measureText(text).width + 8;
        //Calculate width the plane has to be 
        var planeWidth = DTWidth * ratio;
        var texture = new BABYLON.DynamicTexture("text-texture", { width: DTWidth, height: DTHeight }, this.scene, false);
        texture.drawText(text, null, null, font, "#000000", "#ffffff", true);
        this.textMaterial.emissiveTexture = texture;        
        if(this.textTexture) {
            this.textTexture.dispose();
        }
         
        this.txtPlane.scaling.x = planeWidth;
        this.txtPlane.scaling.y = planeHeight;  
        this.textTexture = texture;
    }
}