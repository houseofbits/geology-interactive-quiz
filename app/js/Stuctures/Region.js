export default class Region {
    /**
     * @param {Number} minx
     * @param {Number} miny
     * @param {Number} maxx
     * @param {Number} maxy
     */
    constructor(minx, miny, maxx, maxy) {
        this.set(minx, miny, maxx, maxy)
    }

    /**
     * @param {Number} minx
     * @param {Number} miny
     * @param {Number} maxx
     * @param {Number} maxy
     */
    set(minx, miny, maxx, maxy) {
        this.minx = minx;
        this.miny = miny;
        this.maxx = maxx;
        this.maxy = maxy;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    isPointIntersecting(x, y) {
        if (x < this.minx) {
            return false;
        }
        if (y < this.miny) {
            return false;
        }
        if (x > this.maxx) {
            return false;
        }
        return y <= this.maxy;
    }
}

