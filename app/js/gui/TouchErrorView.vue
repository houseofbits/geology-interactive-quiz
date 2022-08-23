<template>
    <div class="main-view">
        <div v-for="region in regions" :style="regionTransform(region)" class="region">
            <div>{{ region.average.toFixed(2) }}</div>
        </div>

        <div v-for="touch in service.touch.touches">
            <div :style="touchPointTransform(touch)" class="touch-element">
                <div class="aura"></div>
            </div>
        </div>
    </div>
</template>

<script>

import RegionDetectionService from "@js/Services/RegionDetectionService";
import Region from "@js/Stuctures/Region";

export default {
    name: 'TouchErrorView',
    data() {
        return {
            service: new RegionDetectionService(),
            detectionTimer: null,
            regions: []
        };
    },
    methods: {
        generateRegions(divisions) {
            const divX = 1024 / divisions;
            const divY = 768 / divisions;

            for (let x = 0; x < divisions; x++) {
                for (let y = 0; y < divisions; y++) {
                    const region = new Region(
                        x * divX,
                        y * divY,
                        (x * divX) + divX,
                        (y * divY) + divY,
                    );

                    this.regions.push({
                        region,
                        average:0
                    });
                }
            }
        },
        regionTransform(region) {
            return {
                top: region.region.miny + 'px',
                left: region.region.minx + 'px',
                width: (region.region.maxx - region.region.minx) + 'px',
                height: (region.region.maxy - region.region.miny) + 'px',
                background: 'hsl(0, 50%, ' + region.average +'%)',
            };
        },
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
        },
        findRegion(x, y) {
            for (const region of this.regions) {
                if (region.region.isPointIntersecting(x,y)) {
                    return region;
                }
            }
            return null;
        },
        updateRegion(distances, region) {
            let l = 0;
            for (const distance of distances) {
                l += distance.distance;
            }
            if (l > 0) {
                region.average = (region.average + l) * 0.5;
            }
        },
        runDetectionLoop() {
            clearTimeout(this.detectorLoopIntervalId);
            this.detectorLoopIntervalId = setTimeout(() => {
                const pointDistances = this.service.calculatePointDistances(this.service.touch.touches);
                const center = this.service.touch.getCenter();
                if (center) {
                    const region = this.findRegion(center.x, center.y);
                    if (region) {
                        this.updateRegion(pointDistances, region);
                    }
                }
                this.runDetectionLoop();
            }, 16);
        }
    },
    mounted() {
        this.service.touch.region.maxx = 1024;
        this.service.touch.region.maxy = 768;
        this.service.touch.registerInputHandlers();
        this.runDetectionLoop();
        this.generateRegions(10);
    }
};
</script>

<style lang="scss" scoped>
.main-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 1024px;
    height: 768px;
    background-color: rgba(0, 0, 0, 0.4);


    .touch-element {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: rgba(255, 0, 0, 0.5);
        border: solid 1px white;
        left: 0;
        top: 0;
        margin-left: -10px;
        margin-top: -10px;
        border-radius: 50%;

        & .aura {
            position: absolute;
            background-color: rgba(255, 255, 0, 0.2);
            left: -30px;
            right: -30px;
            top: -30px;
            bottom: -30px;
            border-radius: 50%;
        }
    }

    .region {
        position: absolute;
        color: red;
        border: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }
}
</style>
