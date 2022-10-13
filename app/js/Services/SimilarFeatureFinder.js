import RegionDetectionService from "@js/Services/RegionDetectionService";

export default class SimilarFeatureFinder {

    constructor() {
        this.detector = new RegionDetectionService();
        this.detector.touch.region.set(0, 0, 1024, 768);
    }

    setFeatures(featureDefinitions) {
        this.detector.featureDefinitions = featureDefinitions;
    }

    findSimilar(featureId) {

        const points = this.detector.featureDefinitions[featureId].calculatePoints();
        // const pointDistances = this.detector.calculatePointDistances(pt);
        // console.log(pt);
        // console.log(pointDistances);

        // const points = [
        //     new TouchPoint(0,0,0),
        //     new TouchPoint(1,0,0),
        //     new TouchPoint(2,0,0),
        // ];

        const detectedObjects = this.detector.detectObjectFromPoints(points);
        if (detectedObjects.length > 0) {
            let detectedObjectIds = this.detector.getDetectedIds(detectedObjects);
            const totalCount = detectedObjects.length;

            console.log('Feature: ' + this.detector.featureDefinitions[featureId].id);
            console.log(detectedObjectIds);

            let weighted = [];
            for (const detectedObjectId of detectedObjectIds) {
                const objects = detectedObjects.filter((object) => object.defId === detectedObjectId);
                if (objects.length) {
                    const obj = this.detector.createObject(totalCount, detectedObjectId, objects);
                    weighted.push(obj);
                }
            }

            weighted = weighted.sort((a, b) => {
                if (a.totalWeight > b.totalWeight) return -1;
                if (a.totalWeight < b.totalWeight) return 1;
                return 0;
            });

            //console.log(weighted.map((item) => item.id));

            return weighted;
        }

        return [];
    }
}