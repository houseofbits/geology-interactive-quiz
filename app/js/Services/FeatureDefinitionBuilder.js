import ObjectDefinition from "@js/Stuctures/ObjectDefinition";

export default class FeatureDefinitionBuilder {
    /**
     * @param objectDefinitionsConfiguration
     * @param error
     * @returns {ObjectDefinition[]}
     */
    static buildDefinitionsFromConfiguration(objectDefinitionsConfiguration, error) {
        if (!objectDefinitionsConfiguration) {
            return [];
        }
        return objectDefinitionsConfiguration.map(param => this.createFeatureDefinition(param.id, param.a, param.b, param.c, error));
    }

    /**
     *
     * @param id
     * @param {Number} dstA
     * @param {Number} dstB
     * @param {Number} dstC
     * @param {Number} error
     * @returns {ObjectDefinition}
     */
    static createFeatureDefinition(id, dstA, dstB, dstC, error) {
        const objDef = new ObjectDefinition(id);
        objDef.addSegment(dstA, dstA - error, dstA + error);
        objDef.addSegment(dstB, dstB - error, dstB + error);
        objDef.addSegment(dstC, dstC - error, dstC + error);
        return objDef;
    }
}