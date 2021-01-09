import * as BABYLON from 'babylonjs';
import CustomMaterial from './CustomMaterial.js';
import BasicVertexShader from '@shaders/basic.vert';
import BasicFragmentShader from '@shaders/basic.frag';

export default
class BasicAlphaMaterial extends CustomMaterial {
    constructor(scene, name) {
        super(scene, name);

        this.loadShaderData(name, BasicVertexShader, BasicFragmentShader);

        this.createDefaultShader(true);

        this.setCameraPosition(this.scene.activeCamera.position);
    }
}