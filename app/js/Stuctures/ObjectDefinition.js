import {triangleAngles} from "@js/Helpers/Angle";

export default class ObjectDefinition {
    constructor(id) {
        this.id = id;
        this.segments = [];
        this.angles = [];
    }

    calculateAngles() {
        this.angles = triangleAngles(this.segments[0][0], this.segments[1][0], this.segments[2][0]);
    }

    addSegment(actualVal, minVal, maxVal) {
        this.segments.push([actualVal, minVal, maxVal]);
    }

    matchSegmentLength(segmentIndex, length) {
        return length > this.segments[segmentIndex][1] && length < this.segments[segmentIndex][2];
    }

    calculateWeight(segmentIndex, actualDist) {

        const error = this.segments[segmentIndex][2] - this.segments[segmentIndex][1];
        const mid = this.segments[segmentIndex][1] + error * 0.5;

        return (error - Math.abs(actualDist - mid)) / error;
    }
}