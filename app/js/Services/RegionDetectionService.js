import DetectedObject from "@js/Stuctures/DetectedObject";
import PointDistance from "@js/Stuctures/PointDistance";
import TouchRegister from "@js/Services/TouchRegister";
import BasicDetectionResult from "@js/Stuctures/BasicDetectionResult";
import {radiansToDegrees, triangleAngles} from "@js/Helpers/Angle";

const DETECTION_TIME = 2000;
const MIN_WEIGHT_THRESHOLD = 0.75;
const TOTAL_WEIGHT_THRESHOLD = 0.75;
const MEAN_THRESHOLD = 0.25;
const COUNT_FACTOR = 0.0;
const WEIGHT_FACTOR = 1.0;

export default class RegionDetectionService {

    constructor() {
        this.touch = new TouchRegister();
        this.regionElement = null;

        /** @type {ObjectDefinition[]} */
        this.featureDefinitions = [];

        /** @type {BasicDetectionResult[]} */
        this.detectedObjects = [];

        this.detectorLoopIntervalId = null;
        this.detectionTimer = null;
        this.detectStartHandler = null;
        this.detectedObjectHandler = null;
        this.detectEndHandler = null;
        this.rawResultHandler = null;
        this.isDisabled = false;
    }

    setElement(element) {
        this.regionElement = element;
    }

    setDisabled(disabled) {
        this.isDisabled = disabled;
        this.finishDetection();
        this.touch.unregisterInputHandlers(this.regionElement);

        if (!this.isDisabled) {
            this.touch.registerInputHandlers(this.regionElement);
        }
        this.runDetectionLoop();

//        console.log('is disabled '+this.isDisabled);
    }

    beginDetection() {
        this.detectedObjects = [];
        clearTimeout(this.detectionTimer);
        this.detectionTimer = setTimeout(this.processDetectedObjects.bind(this), DETECTION_TIME);
        if (this.detectStartHandler) {
            this.detectStartHandler();
        }
        //console.log('Begin');
    }

    finishDetection() {
        this.detectedObjects = [];
        clearTimeout(this.detectionTimer);
        this.detectionTimer = null;
    }

    failedDetection() {
        this.finishDetection();

        if (this.detectEndHandler) {
            this.detectEndHandler();
        }
        //console.log('Failed');
    }

    runDetectionLoop() {
        clearTimeout(this.detectorLoopIntervalId);
        if (!this.isDisabled) {
            this.detectorLoopIntervalId = setTimeout(() => {
                const detectedObjects = this.detectObjects();
                if (detectedObjects.length > 0) {
                    this.persistObjects(detectedObjects);
                }
                this.runDetectionLoop();
            }, 16);
        }
    }

    /**
     * @param {BasicDetectionResult[]} detectedObjects
     */
    persistObjects(detectedObjects) {

        if (!this.detectionTimer && detectedObjects.length > 0) {
            this.beginDetection();
        }

        if (this.detectionTimer) {
            this.detectedObjects = this.detectedObjects.concat(detectedObjects);
        }
    }

    processDetectedObjects() {

        if (this.isDisabled) {
            this.detectedObjects = [];
            return;
        }

        let isMeanValueThresholdFail = false;

        if (this.detectedObjects.length > 0) {
            let detectedObjectIds = this.getDetectedIds(this.detectedObjects);
            const totalCount = this.detectedObjects.length;
            let weighted = [];
            for (const detectedObjectId of detectedObjectIds) {
                const objects = this.detectedObjects.filter((object) => object.defId === detectedObjectId);
                if (objects.length) {
                    const obj = this.createObject(totalCount, detectedObjectId, objects);
                    //if (this.doThresholdPass(obj)) {
                    weighted.push(obj);
                   // }
                    //console.log(obj);
                }
            }

            weighted = weighted.sort((a, b) => {
                if (a.totalWeight > b.totalWeight) return -1;
                if (a.totalWeight < b.totalWeight) return 1;
                return 0;
            });

            this.detectedObjects = [];

            //console.log(weighted);

            if (typeof weighted[0] !== "undefined") {

                if(this.rawResultHandler) {
                    this.rawResultHandler(weighted);
                }

                const matchingWeight = weighted[0];
                // const secondMatchingWeight = weighted[1] ?? null;
                //
                // if (secondMatchingWeight) {
                //     const diffTotalWeight = Math.abs(secondMatchingWeight.totalWeight - matchingWeight.totalWeight);
                //     //console.log(diffTotalWeight);
                //
                //     if (diffTotalWeight < 0.07 && matchingWeight.matchingWeight < 0.9) {
                //         this.failedDetection();
                //         return;
                //     }
                // }

                if (this.detectedObjectHandler) {
                    this.detectedObjectHandler(matchingWeight.id);
                }

                //console.log('Detected ' + matchingWeight.id);

                this.finishDetection();
                return;
            }
        }

        //Handler when no objects are found
        this.failedDetection();
    }

    createObject(totalCount, detectedObjectId, objects) {
        let weight = this.getTotalWeight(objects);
        let minWeight = this.getMinWeight(objects);
        let maxWeight = this.getMaxWeight(objects);
        let angles = this.getAverageAngles(objects);

        let angleSum = Math.abs(angles[0]) + Math.abs(angles[1]) + Math.abs(angles[2]);

        let meanWeight = maxWeight - minWeight;
        let count = objects.length;

        const matchingWeight = weight / count;
        const countWeight = count / totalCount;
        // COUNT_FACTOR * countWeight
        // + WEIGHT_FACTOR * matchingWeight;

        return {
            id: detectedObjectId,
            matchingWeight: matchingWeight.toFixed(3),
            countWeight: countWeight.toFixed(3),
            totalWeight: maxWeight.toFixed(3),
            minWeight: minWeight.toFixed(3),
            maxWeight: maxWeight.toFixed(3),
            meanWeight: meanWeight.toFixed(3),
            count: totalCount,
            angles,
            angleSum
        };
    }

    doThresholdPass(matchingWeight) {
        if (matchingWeight.totalWeight < TOTAL_WEIGHT_THRESHOLD) {
            return false;
        }
        if (matchingWeight.angleSum > 15) {
            return false;
        }
        // if (matchingWeight.minWeight < MIN_WEIGHT_THRESHOLD) {
        //     return false;
        // }
        // if (matchingWeight.meanWeight > MEAN_THRESHOLD) {
        //     return false;
        // }

        return true;
    }

    getAverageAngles(objects) {
        let angles = [0, 0, 0];
        for (const object of objects) {
            angles[0] += object.angles[0];
            angles[1] += object.angles[1];
            angles[2] += object.angles[2];
        }

        angles[0] = angles[0] / objects.length;
        angles[1] = angles[1] / objects.length;
        angles[2] = angles[2] / objects.length;

        return angles;
    }

    /**
     * @param {BasicDetectionResult[]} objects
     * @returns {number[]}
     */
    getDetectedIds(objects) {
        let detectedObjectIds = objects.map((item) => item.defId);
        detectedObjectIds = [...new Set(detectedObjectIds)];

        return detectedObjectIds;
    }

    /**
     * @param {BasicDetectionResult[]} objects
     * @returns {number}
     */
    getTotalWeight(objects) {
        let weight = 0;
        for (const object of objects) {
            weight += object.weight;
        }

        return weight;
    }

    /**
     * @param {BasicDetectionResult[]} objects
     * @returns {number}
     */
    getMinWeight(objects) {
        let weight = 1.0;
        for (const object of objects) {
            if (object.weight < weight) {
                weight = object.weight;
            }
        }

        return weight;
    }

    /**
     * @param {BasicDetectionResult[]} objects
     * @returns {number}
     */
    getMaxWeight(objects) {
        let weight = 0.0;
        for (const object of objects) {
            if (object.weight > weight) {
                weight = object.weight;
            }
        }

        return weight;
    }

    /**
     * @returns {BasicDetectionResult[]}
     */
    detectObjects() {
        if (this.touch.touches.length > 2) {
            let objects = this.detectObjectFromPoints(this.touch.touches);
            if (objects.length > 0) {
                return objects;
            }
        }
        if (this.detectedObjects.length === 0 && this.touch.touches.length > 0) {
            const obj = new BasicDetectionResult();
            obj.weight = 0.1;
            obj.defId = this.featureDefinitions[0].id;
            obj.angles = [0,0,0];

            return [obj];
        }
        return [];
    }

    /**
     * @param {TouchPoint[]} touchPoints
     * @returns {BasicDetectionResult[]}
     */
    detectObjectFromPoints(touchPoints) {
        const pointDistances = this.calculatePointDistances(touchPoints);
        let objects = [];
        for (const def of this.featureDefinitions) {
            const result = this.findFeatureInDistanceList(def, pointDistances);
            if (result.length > 0) {
                objects = objects.concat(result);
            }
        }
        return objects;
    }

    /**
     * @param {ObjectDefinition} feature
     * @param {PointDistance[]} pointDist
     * @returns {BasicDetectionResult[]}
     */
    findFeatureInDistanceList(feature, pointDist) {
        const detectedResults = [];
        for (let i = 0; i < pointDist.length; i++) {
            //Candidate A
            if (feature.matchSegmentLength(0, pointDist[i].distance)) {
                for (let j = 0; j < pointDist.length; j++) {
                    //Candidate B
                    if (i !== j && feature.matchSegmentLength(1, pointDist[j].distance)) {
                        for (let k = 0; k < pointDist.length; k++) {
                            if (i !== j && i !== k && j !== k && feature.matchSegmentLength(2, pointDist[k].distance)) {
                                const indices = this.getIndices(i, j, k, pointDist);
                                if (indices) {
                                    const res = new BasicDetectionResult();
                                    res.defId = feature.id;
                                    res.weight = this.calculateWeight(pointDist, i, j, k, feature);
                                    res.angles = this.getAngleDiff(
                                        pointDist[i].distance,
                                        pointDist[j].distance,
                                        pointDist[k].distance,
                                        feature
                                    );

                                    detectedResults.push(res);
                                }
                            }
                        }
                    }
                }
            }
        }
        return detectedResults;
    }

    getAngleDiff(l1, l2, l3, feature) {
        const angles = triangleAngles(l1, l2, l3);
        return [
            feature.angles[0] - angles[0],
            feature.angles[1] - angles[1],
            feature.angles[2] - angles[2]
        ];
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
                    const _a = radiansToDegrees(Math.atan2(_x, _y));

                    const pdst = new PointDistance();
                    pdst.distance = Math.sqrt(_lsq);
                    pdst.indexA = i;
                    pdst.indexB = j;
                    pdst.angle = _a;

                    pointDist.push(pdst);
                }
            }
        }
        return pointDist;
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
}