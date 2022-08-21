export default class TouchPoint {
    /**
     * @param {number} identifier
     * @param {number} x
     * @param {number} y
     */
    constructor(identifier, x, y) {
        /** @type {number} */
        this.identifier = identifier;
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
    }
}