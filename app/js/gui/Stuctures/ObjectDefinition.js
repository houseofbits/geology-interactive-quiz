export default class ObjectDefinition {
    constructor() {
        this.segments = [];
    }

    addSegment(minVal, maxVal) {
        this.segments.push([minVal, maxVal]);
    }

    matchSegmentLength(segmentIndex, length) {
        return length > this.segments[segmentIndex][0] && length < this.segments[segmentIndex][1];
    }

    calculateWeight(segmentIndex, actualDist) {

        const error = this.segments[segmentIndex][1] - this.segments[segmentIndex][0];
        const mid = this.segments[segmentIndex][0] + error * 0.5;

        return (error - Math.abs(actualDist - mid)) / error;
    }
}