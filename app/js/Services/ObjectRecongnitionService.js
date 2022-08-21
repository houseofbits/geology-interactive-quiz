import ObjectDetectionService, {DEFAULT_ERROR} from "@js/Services/ObjectDetectionService";
import TouchPoint from "@js/Stuctures/TouchPoint";

class ObjectRecognitionService {

    constructor() {
        this.objectDetectionService = new ObjectDetectionService();
        this.touches = [];
        this.detectedObjects = [];
        this.previousDetectedObjects = [];
        this.objectDefinitionsArray = this.objectDetectionService.getObjectDefinitions();
        this.detectorLoopIntervalId = null;
        this.time = 0;
        this.regions = [];

        this.registerTouchHandlers();

        this.detectedNewHandler = null;
        this.detectedHandler = null;
        this.detectedLostHandler = null;
        this.isDisabled = false;
    }

    setObjectDefinitions(objectDefinitionConfig) {
        this.objectDefinitionsArray = this.objectDetectionService.getObjectDefinitions(objectDefinitionConfig);
    }

    addRegion(region) {
        this.regions.push(region);
    }

    registerTouchHandlers() {
        document.addEventListener('touchstart', function (event) {
            for (const touch of event.touches) {
                if (this.objectDetectionService.isPointIntersectingWithFeatures(touch.clientX, touch.clientY, this.regions)) {
                    this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
                }
            }
            while (this.touches.length > 9) {
                this.touches.shift();
            }
        }.bind(this), false);

        document.addEventListener('touchend', function (event) {
            this.touches = [];
        }, false);

        document.addEventListener('touchmove', function (event) {
            this.touches = [];
            for (const touch of event.touches) {
                this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            }
        }.bind(this), false);
    }

    runDetectionLoop() {
        clearTimeout(this.detectorLoopIntervalId);
        this.detectorLoopIntervalId = setTimeout(() => {
            if (!this.isDisabled) {
                this.detect();
                this.time += 16;
            }
            this.runDetectionLoop();
        }, 16);
    }

    resetDetector() {
        this.touches = [];
        this.detectedObjects = [];
    }

    detect() {
        while (this.detectedObjects.length > 10) {
            this.detectedObjects.shift();
        }
        this.previousDetectedObjects = _.cloneDeep(this.detectedObjects);
        this.detectedObjects = this.objectDetectionService.detectObjects(this.time, this.touches, this.objectDefinitionsArray, this.detectedObjects);
        this.objectDetectionService.updateDetectedWithFeature(this.detectedObjects, this.regions);
        this.triggerEvents();
    }

    triggerEvents() {
        const existingObjects = this.filterIntersectingObjects();
        if (this.detectedHandler) {
            for (const existingObject of existingObjects) {
                this.detectedHandler(existingObject);
            }
        }
        const newObjects = this.filterNewObjects();
        if (this.detectedNewHandler) {
            for (const newObject of newObjects) {
                this.detectedNewHandler(newObject);
            }
        }
        const removedObjects = this.filterRemovedObjects();
        if (this.detectedLostHandler) {
            for (const removedObject of removedObjects) {
                this.detectedLostHandler(removedObject);
            }
        }
    }

    filterNewObjects() {
        return this.detectedObjects.filter(item => !this.previousDetectedObjects.some(item2 => {
            return item2.id === item.id && item2.regionId === item.regionId;
        }));
    }

    filterRemovedObjects() {
        return this.previousDetectedObjects.filter(item => !this.detectedObjects.some(item2 => {
            return item2.id === item.id && item2.regionId === item.regionId;
        }));
    }

    filterIntersectingObjects() {
        return this.previousDetectedObjects.filter(item => this.detectedObjects.some(item2 => {
            return item2.id === item.id && item2.regionId === item.regionId;
        }));
    }
}

const ObjectRecognitionServiceInstance = new ObjectRecognitionService();

export default ObjectRecognitionServiceInstance;