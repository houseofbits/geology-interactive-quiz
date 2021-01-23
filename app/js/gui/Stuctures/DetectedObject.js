export default class DetectedObject {
    constructor(result, x, y) {

        this.id = 0;

        this.result = result;

        this.x = x;
        this.y = y;
    }

    calculatePosition(detectionResult, touchPoints) {
        this.x = (touchPoints[detectionResult.i].x + touchPoints[detectionResult.j].x + touchPoints[detectionResult.k].x) / 3;
        this.y = (touchPoints[detectionResult.i].y + touchPoints[detectionResult.j].y + touchPoints[detectionResult.k].y) / 3;
    }
}