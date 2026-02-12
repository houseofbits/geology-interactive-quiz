class InactivityWatcher {
    constructor() {
        this.timeout = 120000;
        this.callback = null;
        this.timeoutTimer = null;
    }

    setTimeoutTime(t) {
        this.timeout = t * 1000;
        this.trigger();
    }

    setCallback(callback) {
        this.callback = callback;
        this.trigger();
    }

    registerInputHandlers() {
        document.addEventListener('touchstart', this.trigger.bind(this), false);
        document.addEventListener('touchend', this.trigger.bind(this), false);
        document.addEventListener('touchmove', this.trigger.bind(this), false);
    }

    unregisterInputHandlers() {
        document.removeEventListener('touchstart click', this.trigger);
        document.removeEventListener('touchend', this.trigger);
        document.removeEventListener('touchmove', this.trigger);
    }

    trigger() {
        clearTimeout(this.timeoutTimer);
        if (this.callback) {
            this.timeoutTimer = setTimeout(this.callback, this.timeout);
        }
    }
}

export default new InactivityWatcher();