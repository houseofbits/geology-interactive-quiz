export default class ObjectDefinition {
    constructor(id) {
        this.id = id;
        this.segments = [];
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