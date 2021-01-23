import PointDistance from "../Stuctures/PointDistance";
import ObjectDetectionResult from "../Stuctures/ObjectDetectionResult";
import DetectedObject from "../Stuctures/DetectedObject";
import ObjectDefinition from "../Stuctures/ObjectDefinition";

export default class ObjectDetectionService {
    constructor() {
    }

    /**
     *
     *      DetectedObject{
     *          id,             //Definition id
     *          position,       //Object position
     *          age             //Time of existance. The older this is, the more weight it has
     *          timeToLive      //Time value, after which object is considered not detected. This might depend on age
     *          lastSeen        //When object was last time detected. If lastSeen + timeToLive < now -> remove object
     *      }
     *
     *      Object detection algorithm:
     *          1) Calculate point distances
     *          2) for each objectDefinition
     *              2.1) detect object
     *              2.2) for each detected object, intersect it with the existing objects
     *                  if object intersects, increase its weight
     *              2.3) filter objects by weight so the fittest is left
     *              2.4) intersect existing objects with the fittest,
     *                  if intersection exists, update existing object
     *              2.5) if intersection does not exist add fittest object to newObjects array
     *          3) delete died objects form list
     *
     */
    detectObjects(points, objectDefinitionsArray, previousObjectsArray) {

        if (!objectDefinitionsArray) {
            return;
        }

        //1) Calculate point distances
        const pointDistances = this.calculatePointDistances(points);

        //2) For each object definition
        const newObjects = [];
        for (const def of objectDefinitionsArray) {
            let result = this.detectObject(def, pointDistances);

            //1) Check that object does not intersect with other objects
            result = this.filterDetectionResultByObjectOverlaps(result, previousObjectsArray);

            if (result.length > 0) {

                const existingObject = previousObjectsArray.find(elem => elem.id === def.id);
                if (existingObject) {



                } else {
                    //New object, get the fittest and we are done
                    const result = this.reduceDetectionResultByFittest(result);
                    if (result) {
                        const detectedObject = new DetectedObject();
                        detectedObject.id = def.id;
                        detectedObject.calculatePosition(result, points);
                        newObjects.push(detectedObject);
                    }
                }
            }
        }
        return newObjects;
    }

    calculatePointDistances(touchPoints) {
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
        const detectedResults = [];
        for (let i = 0; i < pointDist.length; i++) {
            //Candidate A
            if (objectDef.matchSegmentLength(0, pointDist[i].distance)) {
                for (let j = 0; j < pointDist.length; j++) {
                    //Candidate B
                    if (i !== j && objectDef.matchSegmentLength(1, pointDist[j].distance)) {
                        for (let k = 0; k < pointDist.length; k++) {
                            if (i !== j && i !== k && j !== k && objectDef.matchSegmentLength(2, pointDist[k].distance)) {
                                const indices = this.getIndices(i, j, k, pointDist);
                                if (indices) {
                                    detectedResults.push(
                                        new ObjectDetectionResult(objectDef, indices[0], indices[1], indices[2], this.calculateWeight(pointDist, i, j, k, objectDef))
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        return detectedResults;
    }

    filterDetectionResultByObjectOverlaps(detectionResult, previousObjectsArray, points) {

    }

    reduceDetectionResultByFittest(detectionResult) {
        return detectionResult.reduce((p, v) => {
            return (p > v.weight ? p : v);
        }, 0);
    }

    getIndices(i, j, k, pointDist) {
        let pointIndexes = new Set();
        pointIndexes.add(pointDist[i].indexA);
        pointIndexes.add(pointDist[i].indexB);
        pointIndexes.add(pointDist[j].indexA);
        pointIndexes.add(pointDist[j].indexB);
        pointIndexes.add(pointDist[k].indexA);
        pointIndexes.add(pointDist[k].indexB);
        return pointIndexes.size === 3 ? Array.from(pointIndexes) : null;
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

        return new DetectedObject(detectionResult, x / 3, y / 3);
    }

    calculateObjectDefinition(id, touchPoints, error) {
        const distances = this.calculatePointDistances(touchPoints);
        if(distances.length === 3) {
            return this.createObjectDefinition(id, distances[0].distance, distances[1].distance, distances[2].distance, error);
        }
        return null;
    }

    createObjectDefinition(id, dstA, dstB, dstC, error) {
        const objDef = new ObjectDefinition(id);
        objDef.addSegment(dstA, dstA - error, dstA + error);
        objDef.addSegment(dstB, dstB - error, dstB + error);
        objDef.addSegment(dstC, dstC - error, dstC + error);
        return objDef;
    }
}