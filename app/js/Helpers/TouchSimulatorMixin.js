export default {
    data() {
        return {
            detectorSimulationOn: false
        };
    },
    methods: {
        dispatchFeatureEvents(id, offsetX, offsetY, objectDefinitions, end = false) {
            const feature = this.findObjectDefinitionById(id, objectDefinitions);
            if (feature) {
                const points = feature.calculatePoints(offsetX, offsetY);
                this.sendTouchEvent(points, end)
            }
        },
        toggleFeatureEvent(id, offsetX, offsetY, objectDefinitions) {
            if (this.detectorSimulationOn) {
                this.dispatchFeatureEvents(id, offsetX, offsetY, objectDefinitions, true);
                this.detectorSimulationOn = false;
                console.log(offsetX+','+offsetY+' OFF');
            } else {
                this.dispatchFeatureEvents(id, offsetX, offsetY, objectDefinitions);
                this.detectorSimulationOn = true;
                console.log(offsetX+', '+offsetY+' ON');
            }
        },
        sendTouchEvent(points, end) {
            const touches = [];

            for (const point of points) {
                touches.push(
                    new Touch({
                        identifier: Date.now(),
                        target: document,
                        clientX: point.x,
                        clientY: point.y,
                        radiusX: 2.5,
                        radiusY: 2.5,
                        rotationAngle: 10,
                        force: 0.5,
                    })
                );
            }

            const touchEvent = new TouchEvent(end ? 'touchend': 'touchstart', {
                cancelable: true,
                bubbles: true,
                touches: end ? [] : touches,
                targetTouches: [],
                changedTouches: touches,
                shiftKey: false,
            });

            document.dispatchEvent(touchEvent);
        },
        // sendTouchEndEvent(){
        //     const touchEvent = new TouchEvent('touchend', {
        //         cancelable: true,
        //         bubbles: true,
        //         touches: [],
        //         targetTouches: [],
        //         changedTouches: this.touchSimulatorLastTouches,
        //         shiftKey: false,
        //     });
        //
        //     document.dispatchEvent(touchEvent);
        // },
        findObjectDefinitionById(id, objectDefinitions) {
            return objectDefinitions.find(item => {
                    return item.id === id;
                }
            );
        }
    }
};