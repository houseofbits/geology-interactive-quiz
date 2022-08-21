import TouchPoint from "@js/Stuctures/TouchPoint";
import Region from "@js/Stuctures/Region";

export default class TouchRegister {

    constructor() {
        /** @type {TouchPoint[]} */
        this.touches = [];
        /** @type {Region} */
        this.region = new Region(0, 0, 0, 0);
    }

    registerInputHandlers() {
        document.addEventListener('touchstart', this.onTouchStartEvent.bind(this), false);
        document.addEventListener('touchend', this.onTouchEndEvent.bind(this), false);
        document.addEventListener('touchmove', this.onTouchMoveEvent.bind(this), false);
    }

    unregisterInputHandlers() {
        document.removeEventListener('touchstart', this.onTouchStartEvent);
        document.removeEventListener('touchend', this.onTouchEndEvent);
        document.removeEventListener('touchmove', this.onTouchMoveEvent);
    }

    onTouchStartEvent(event) {
        this.addTouches(event.touches);
        this.removeByLimit(6);
    }

    onTouchEndEvent(event) {
        this.addTouches(event.touches);
    }

    onTouchMoveEvent(event) {
        this.addTouches(event.touches);
        this.removeByLimit(6);
    }

    addTouches(touches) {
        this.touches = [];
        for (const touch of touches) {
            if (this.region.isPointIntersecting(touch.clientX, touch.clientY)) {
                this.touches.push(new TouchPoint(touch.identifier, touch.clientX, touch.clientY));
            }
        }
    }

    removeByLimit(limit) {
        while (this.touches.length > limit) {
            this.touches.shift();
        }
    }
}