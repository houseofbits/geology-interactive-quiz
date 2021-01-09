import * as BABYLON from 'babylonjs';

export default class BaseScene {
    constructor(mainScene, name) {
        this.name = name;
        this.scene = new BABYLON.Scene(mainScene.engine);
        this.mainScene = mainScene;
        this.parentNode = new BABYLON.TransformNode(this.name + "Parent");
    }

    update(dt) {

    }

    render() {
        this.scene.render();
    }

    onSceneActivated() {

    }

    onSceneDeactivated() {

    }

    setAsChild(node) {
        node.parent = this.parentNode;
    }
}