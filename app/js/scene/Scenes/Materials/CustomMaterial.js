import * as BABYLON from 'babylonjs';

export default
class CustomMaterial {
    constructor(scene, name) {
        this.scene = scene;
        this.name = name;
        this.shaderMaterial = null;
    }
    loadShaderData(shaderName, vertex, fragment){
        this.shaderName = shaderName;
        if(typeof BABYLON.Effect.ShadersStore[this.shaderName + "VertexShader"] == 'undefined')BABYLON.Effect.ShadersStore[this.shaderName + "VertexShader"] = vertex;
        if(typeof BABYLON.Effect.ShadersStore[this.shaderName + "FragmentShader"] == 'undefined')BABYLON.Effect.ShadersStore[this.shaderName + "FragmentShader"] = fragment;
    }

    createDefaultShader(isAlphaBlended){
        this.shaderMaterial = new BABYLON.ShaderMaterial(this.name + this.getShaderName(), this.scene,
            { vertex: this.getShaderName(),fragment: this.getShaderName() },
            {
                needAlphaBlending: isAlphaBlended || false,
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
            });
    }
    getShaderName(){
        return this.shaderName;
    }
    getMaterial(){
        return this.shaderMaterial;
    }
    setCameraPosition(pos){
        this.shaderMaterial.setVector3("cameraPosition", pos);
    }
    setDiffuseMap(map){
        this.shaderMaterial.setTexture("diffuseMap", new BABYLON.Texture(map, this.scene));
    }
}