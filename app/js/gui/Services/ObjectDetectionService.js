import PointDistance from "../Stuctures/PointDistance";
import ObjectDetectionResult from "../Stuctures/ObjectDetectionResult";
import DetectedObject from "../Stuctures/DetectedObject";
import ObjectDefinition from "../Stuctures/ObjectDefinition";
import ObjectDetectionResult2 from "../Stuctures/ObjectDetectionResult2";

export const NEGATIVE_OVERLAP_THRESHOLD = 80.0;    //Threshold value to consider two different objects as conflicting
export const POSITIVE_OVERLAP_THRESHOLD = 160.0;   //Threshold value to consider two objects of same type as equal
export const COLLISION_OVERLAP_THRESHOLD = 160.0;
export const FITTEST_OVERLAPPING_WEIGHT_FACTOR = 1.0;   //Factors to define fittest overlapping object
export const FITTEST_OVERLAPPING_DISTANCE_FACTOR = 1.0; //totalWeight = weightFactor * weight + distanceFactor * distanceWeight
export const OBJECT_TIME_TO_LIVE = 2000;    //Maximum age of object, without any touches
export const REDUCE_DANGLING_TTL = 0.5;

export default class ObjectDetectionService {
    /**
     * @param {Number} time
     * @param {TouchPoint[]} points
     * @param {ObjectDefinition[]} objectDefinitionsArray
     * @param {DetectedObject[]} previousObjectsArray
     * @returns {DetectedObject[]}
     */
    detectObjects(time, points, objectDefinitionsArray, previousObjectsArray) {
        if (!objectDefinitionsArray) {
            return [];
        }

        //1) Calculate point distances
        const pointDistances = this.calculatePointDistances(points);

        //2) Kill timed out objects
        previousObjectsArray = previousObjectsArray.filter(item => {
            return item.lastSeen + item.timeToLive > time;
        });

        //3) For each object definition try to find list of candidates
        let newObjects = [];
        for (const def of objectDefinitionsArray) {
            //Find the existing object
            const existingObject = previousObjectsArray.find(elem => elem.id === def.id);
            //Detect candidates
            let result = this.detectObject2(def, pointDistances, points);
            //Filter out objects that collide with previous objects.
            result = this.filterDetectionResultByObjectOverlaps(result, previousObjectsArray);
            if (result.length > 0) {
                if (existingObject) {
                    //If we have existing object, try to find fittest candidate with least distance from existing object
                    result = this.reduceDetectionResultToFittestOverlappingObject(result, existingObject);
                    if (result) {
                        //Update existing object and save
                        existingObject.x = result.x;
                        existingObject.y = result.y;
                        existingObject.lastSeen = time;
                    } else {
                        //Reduce existing object ttl if we have new object, not overlapping with the existing one
                        existingObject.timeToLive = existingObject.timeToLive * REDUCE_DANGLING_TTL;
                    }
                    newObjects.push(existingObject);
                } else {
                    //New object, get the fittest and we are done
                    result = this.reduceDetectionResultToFittestObject(result);
                    if (result) {
                        //Create new object and save
                        const detectedObject = new DetectedObject();
                        detectedObject.id = def.id;
                        detectedObject.x = result.x;
                        detectedObject.y = result.y;
                        detectedObject.firstSeen = time;
                        detectedObject.lastSeen = time;
                        detectedObject.timeToLive = OBJECT_TIME_TO_LIVE;
                        newObjects.push(detectedObject);
                    }
                }
            } else if (existingObject) {
                //If no new objects found keep the existing objects
                newObjects.push(existingObject);
            }
        }

        //4) Process colliding objects, if there are left some
        newObjects = this.processCollisions(newObjects);

        return newObjects;
    }

    /**
     * @param {TouchPoint[]} points
     * @param {ObjectDefinition[]} objectDefinitionsArray
     * @returns {DetectedObject[]}
     */
    detectObjectsRaw(points, objectDefinitionsArray) {
        if (!objectDefinitionsArray) {
            return;
        }
        const pointDistances = this.calculatePointDistances(points);

        const objects = [];
        for (const def of objectDefinitionsArray) {
            const result = this.detectObject(def, pointDistances);
            if (result.length > 0) {
                for (const resultElement of result) {
                    objects.push(this.getDetectedPosition(resultElement, points));
                }
            }
        }
        return objects;
    }

    /**
     * @param {TouchPoint[]} touchPoints
     * @returns {PointDistance[]}
     */
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

    /**
     * @param {ObjectDefinition} objectDef
     * @param {PointDistance[]} pointDist
     * @returns {ObjectDetectionResult[]}
     */
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

    /**
     * @param {ObjectDefinition} objectDef
     * @param {PointDistance[]} pointDist
     * @param {TouchPoint[]} points
     * @returns {ObjectDetectionResult2[]}
     */
    detectObject2(objectDef, pointDist, points) {
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
                                    const x = (points[indices[0]].x + points[indices[1]].x + points[indices[2]].x) / 3;
                                    const y = (points[indices[0]].y + points[indices[1]].y + points[indices[2]].y) / 3;
                                    detectedResults.push(
                                        new ObjectDetectionResult2(objectDef.id, x, y, this.calculateWeight(pointDist, i, j, k, objectDef))
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

    /**
     * @param {ObjectDetectionResult2} detectionResult
     * @param {DetectedObject[]} previousObjectsArray
     * @returns {ObjectDetectionResult2[]}
     */
    filterDetectionResultByObjectOverlaps(detectionResult, previousObjectsArray) {
        const result = [];
        for (const detectionResultElement of detectionResult) {
            const overlap = previousObjectsArray.find(item => {
                if (item.id === detectionResultElement.defId) {
                    return false;
                }
                return this.calculateDistance(item.x, item.y, detectionResultElement.x, detectionResultElement.y) <= NEGATIVE_OVERLAP_THRESHOLD;
            });
            if (!overlap) {
                result.push(detectionResultElement);
            }
        }
        return result;
    }

    /**
     * @param {ObjectDetectionResult2[]} detectionResultsArray
     * @param {DetectedObject} existingObject
     * @returns {?ObjectDetectionResult2}
     */
    reduceDetectionResultToFittestOverlappingObject(detectionResultsArray, existingObject) {
        const fittestObject =  detectionResultsArray.reduce((p, v) => {
            const distance = this.calculateDistance(v.x, v.y, existingObject.x, existingObject.y);
            const dstWeight = (POSITIVE_OVERLAP_THRESHOLD - Math.min(distance, POSITIVE_OVERLAP_THRESHOLD)) / POSITIVE_OVERLAP_THRESHOLD;
            const weight = (FITTEST_OVERLAPPING_WEIGHT_FACTOR * v.weight)
                + (FITTEST_OVERLAPPING_DISTANCE_FACTOR * dstWeight);
            return (p > weight ? p : v);
        }, 0);
        if (this.calculateDistance(fittestObject.x, fittestObject.y, existingObject.x, existingObject.y) < POSITIVE_OVERLAP_THRESHOLD) {
            return fittestObject;
        }
        return null;
    }

    /**
     * @param {ObjectDetectionResult2[]} detectionResultsArray
     * @returns {?ObjectDetectionResult2}
     */
    reduceDetectionResultToFittestObject(detectionResultsArray) {
        return detectionResultsArray.reduce((p, v) => {
            return (p > v.weight ? p : v);
        }, 0);
    }

    /**
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @returns {Number}
     */
    calculateDistance(x1, y1, x2, y2,) {
        const _x = x2 - x1;
        const _y = y2 - y1;
        const _lsq = _x * _x + _y * _y;
        return Math.sqrt(_lsq);
    }

    /**
     *
     * @param {Number} i
     * @param {Number} j
     * @param {Number} k
     * @param {PointDistance[]} pointDist
     * @returns {?Number[]}
     */
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

    /**
     *
     * @param {PointDistance[]} pointDist
     * @param {Number} i
     * @param {Number} j
     * @param {Number} k
     * @param {ObjectDefinition} objectDef
     * @returns {Number}
     */
    calculateWeight(pointDist, i, j, k, objectDef) {
        let weight = 0.0;

        weight += objectDef.calculateWeight(0, pointDist[i].distance);
        weight += objectDef.calculateWeight(1, pointDist[j].distance);
        weight += objectDef.calculateWeight(2, pointDist[k].distance);

        return weight / 3.0;
    }

    /**
     * @param {ObjectDetectionResult} detectionResult
     * @param {TouchPoint[]} touchPoints
     * @returns {DetectedObject}
     */
    getDetectedPosition(detectionResult, touchPoints) {

        let x = touchPoints[detectionResult.i].x + touchPoints[detectionResult.j].x + touchPoints[detectionResult.k].x;
        let y = touchPoints[detectionResult.i].y + touchPoints[detectionResult.j].y + touchPoints[detectionResult.k].y;

        return new DetectedObject(detectionResult, x / 3, y / 3);
    }

    /**
     * @param id
     * @param {TouchPoint[]} touchPoints
     * @param {Number} error
     * @returns {?ObjectDefinition}
     */
    calculateObjectDefinition(id, touchPoints, error) {
        const distances = this.calculatePointDistances(touchPoints);
        if (distances.length === 3) {
            return this.createObjectDefinition(id, distances[0].distance, distances[1].distance, distances[2].distance, error);
        }
        return null;
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
    createObjectDefinition(id, dstA, dstB, dstC, error) {
        const objDef = new ObjectDefinition(id);
        objDef.addSegment(dstA, dstA - error, dstA + error);
        objDef.addSegment(dstB, dstB - error, dstB + error);
        objDef.addSegment(dstC, dstC - error, dstC + error);
        return objDef;
    }

    /**
     * @param {DetectedObject[]} detectedObjects
     * @returns {DetectedObject[]}
     */
    processCollisions(detectedObjects) {
        if (detectedObjects.length > 1) {
            const objects = [];
            for (let i = 0; i < detectedObjects.length; i++) {
                let isValid = true;
                for (let j = 0; j < detectedObjects.length; j++) {
                    if (i !== j) {
                        if (this.calculateDistance(detectedObjects[i].x, detectedObjects[i].y, detectedObjects[j].x, detectedObjects[j].y) < COLLISION_OVERLAP_THRESHOLD) {
                            if (detectedObjects[i].lastSeen < detectedObjects[j].lastSeen) {
                                isValid = false;
                            }
                        }
                    }
                }
                if (isValid) {
                    objects.push(detectedObjects[i]);
                }
            }
            return objects;
        }
        return detectedObjects;
    }

}