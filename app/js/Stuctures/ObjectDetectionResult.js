export default class ObjectDetectionResult {
    constructor(objectDef, i,j,k, weight) {
        /** @type {ObjectDefinition} */
        this.definition = objectDef;
        this.i = i;
        this.j = j;
        this.k = k;
        this.weight = weight;
    }
}