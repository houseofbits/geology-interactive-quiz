import TouchPoint from "@js/Stuctures/TouchPoint";
import Region from "@js/Stuctures/Region";

export default class TouchRegister {

    constructor() {
        /** @type {TouchPoint[]} */
        this.touches = [];
        /** @type {Region} */
        this.region = new Region(0, 0, 0, 0);
        this.touchHandler = null;
    }

    registerInputHandlers(element) {
        const target = element ? element : document;
        target.addEventListener('touchstart', this.onTouchStartEvent.bind(this), false);
        target.addEventListener('touchend', this.onTouchEndEvent.bind(this), false);
        target.addEventListener('touchmove', this.onTouchMoveEvent.bind(this), false);
    }

    unregisterInputHandlers(element) {
        const target = element ? element : document;
        target.removeEventListener('touchstart click', this.onTouchStartEvent);
        target.removeEventListener('touchend', this.onTouchEndEvent);
        target.removeEventListener('touchmove', this.onTouchMoveEvent);
    }

    onTouchStartEvent(event) {
        this.addTouches(event.touches);
        this.removeByLimit(6);
        if (this.touchHandler) {
            this.touchHandler();
        }
    }

    onTouchEndEvent(event) {
        this.addTouches(event.touches);
    }

    onTouchMoveEvent(event) {
        this.addTouches(event.touches);
        this.removeByLimit(6);
        if (this.touchHandler) {
            this.touchHandler();
        }
    }

    addTouches(touches) {
        this.touches = [];
        for (const touch of touches) {
            this.touches.push(new TouchPoint(touch.identifier, touch.clientX, touch.clientY));
            // if (this.region.isPointIntersecting(touch.clientX, touch.clientY)) {
            //     this.touches.push(new TouchPoint(touch.identifier, touch.clientX, touch.clientY));
            // }
        }
    }

    removeByLimit(limit) {
        while (this.touches.length > limit) {
            this.touches.shift();
        }
    }

    getCenter() {
        if (this.touches.length === 0) {
            return null;
        }

        let x = 0;
        let y = 0;

        for (const touch of this.touches) {
            x += touch.x;
            y += touch.y;
        }

        x = x / this.touches.length;
        y = y / this.touches.length;

        return {x, y};
    }
}