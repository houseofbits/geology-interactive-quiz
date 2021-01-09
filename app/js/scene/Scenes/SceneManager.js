import * as BABYLON from 'babylonjs';
import FirstQuizScene from "./FirstQuizScene.js";

export default class SceneManager {
    constructor(canvas) {
        this.engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: false, stencil: false});
        this.canvas = canvas;
        this.deltaTime = 0;
        this.scenes = [];
        this.activeScene = null;

        this.addScene(new FirstQuizScene(this, 'FirstQuizScene'));
        this.onThemeSelected('FirstQuizScene');

        this.engine.runRenderLoop(() => this.render());
    }

    render() {
        this.deltaTime = this.engine.getDeltaTime() / 1000.0;
        if (this.activeScene) {
            this.activeScene.update(this.deltaTime);
            this.activeScene.render();
        }
    }

    onThemeSelected(themeName) {
        const result = this.scenes.find((e) => e.name === themeName);
        if (result) {
            this.setSceneActive(result);
        }
    }

    setSceneActive(s) {
        if(this.activeScene && this.activeScene !== s) {
            this.activeScene.onSceneDeactivated();
        }
        this.activeScene = s;
        this.activeScene.onSceneActivated();
    }

    addScene(scene) {
        this.scenes.push(scene);
    }
}

