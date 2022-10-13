import {triangleAngles} from "@js/Helpers/Angle";
import TouchPoint from "@js/Stuctures/TouchPoint";

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

    calculatePoints()
    {
        const dist = this.segments[0][0];
        const r1 = this.segments[1][0];
        const r2 = this.segments[2][0];

        const p1 = new TouchPoint(0, 0, 0);
        const p2 = new TouchPoint(1, dist, 0);

        // Centroid is the pt where two lines cross. A line between the circle centers
        // and a line between the intersection points.
        const centroid = (r1 * r1 - r2 * r2 + dist * dist) / (2.0 * dist);

        // Get the coordinates of centroid.
        const x2 = p1.x + (dist * centroid) / dist;

        // Get the distance from centroid to the intersection points.
        const h = Math.sqrt(r1 * r1 - centroid * centroid);

        const y2 = dist * (h / dist);

        return [
            p1,
            p2,
            new TouchPoint(2, x2, y2)
        ];
    }
}