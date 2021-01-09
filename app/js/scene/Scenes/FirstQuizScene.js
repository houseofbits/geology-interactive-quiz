import BaseScene from "@js/scene/Scenes/BaseScene";
import * as BABYLON from 'babylonjs';

export default class FirstQuizScene extends BaseScene {
    constructor(mainScene, name) {
        super(mainScene, name);

        this.scene.clearColor = new BABYLON.Color3(0.3, 0.3, 0.4);

        let camera = new BABYLON.ArcRotateCamera("Camera", 0, BABYLON.Angle.FromDegrees(90).radians(), 2000, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.attachControl(mainScene.canvas, true);

        this.createScene();
    }

    update(dt) {
        super.update(dt);
    }

    createScene() {

    }
}