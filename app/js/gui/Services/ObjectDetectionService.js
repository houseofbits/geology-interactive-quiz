import PointDistance from "../Stuctures/PointDistance";
import ObjectDetectionResult from "../Stuctures/ObjectDetectionResult";
import DetectedObjectPosition from "../Stuctures/DetectedObjectPosition";
import ObjectDefinition from "../Stuctures/ObjectDefinition";

export default class ObjectDetectionService {
    constructor() {
    }

    calculatePointDistances(touchPoints, tresholdMin, tresholdMax) {
        const pointDist = [];
        for (let i = 0; i < touchPoints.length; i++) {
            for (let j = i; j < touchPoints.length; j++) {
                if (i !== j) {
                    const _x = touchPoints[j].x - touchPoints[i].x;
                    const _y = touchPoints[j].y - touchPoints[i].y;
                    const _lsq = _x * _x + _y * _y;
                    pointDist.push(new PointDistance(i, j, Math.sqrt(_lsq)));
                }
            }
        }
        return pointDist;
    }

    detectObject(objectDef, pointDist) {
        for (let i = 0; i < pointDist.length; i++) {
            //Candidate A
            if (objectDef.matchSegmentLength(0, pointDist[i].distance)) {
                for (let j = 0; j < pointDist.length; j++) {
                    //Candidate B
                    if (i !== j && objectDef.matchSegmentLength(1, pointDist[j].distance)) {
                        for (let k = 0; k < pointDist.length; k++) {
                            if (i !== j && i !== k && j !== k && objectDef.matchSegmentLength(2, pointDist[k].distance)) {
                                if (this.validateIndices(i, j, k, pointDist)) {
                                    return new ObjectDetectionResult(i, j, k, this.calculateWeight(pointDist, i, j, k, objectDef));
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    validateIndices(i, j, k, pointDist) {
        let pointIndexes = new Set();
        pointIndexes.add(pointDist[i].indexA);
        pointIndexes.add(pointDist[i].indexB);
        pointIndexes.add(pointDist[j].indexA);
        pointIndexes.add(pointDist[j].indexB);
        pointIndexes.add(pointDist[k].indexA);
        pointIndexes.add(pointDist[k].indexB);
        return pointIndexes.size === 3;
    }

    calculateWeight(pointDist, i, j, k, objectDef) {

        let weight = 0.0;

        weight += objectDef.calculateWeight(0, pointDist[i].distance);
        weight += objectDef.calculateWeight(1, pointDist[j].distance);
        weight += objectDef.calculateWeight(2, pointDist[k].distance);

        return weight / 3.0;
    }

    getDetectedPosition(detectionResult, touchPoints) {

        let x = touchPoints[detectionResult.i].x + touchPoints[detectionResult.j].x + touchPoints[detectionResult.k].x;
        let y = touchPoints[detectionResult.i].y + touchPoints[detectionResult.j].y + touchPoints[detectionResult.k].y;

        return new DetectedObjectPosition(x / 3, y / 3);
    }

    calculateObjectDefinition(touchPoints, error) {
        const distances = this.calculatePointDistances(touchPoints, 0, 10000);
        if(distances.length === 3) {
            const objDef = new ObjectDefinition();
            for (const dist of distances) {
                objDef.addSegment(dist.distance - error, dist.distance + error)
            }
            return objDef;
        }
        return null;
    }
}