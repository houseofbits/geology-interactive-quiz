export default class DetectedObject {
    constructor(result, x, y) {

        this.id = 0;

        this.result = result;       //remove

        this.x = x;
        this.y = y;

        this.firstSeen = 0;
        this.lastSeen = 0;
        this.timeToLive = 0;
    }
}