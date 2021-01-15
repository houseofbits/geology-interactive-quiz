<template>
    <div class="main-view">
        <div class="m-1 debug p-2">
            <button class="btn btn-primary" type="button" @click="detect">Detect</button>
            <button class="btn btn-primary" type="button" @click="calibrate">Calibrate</button>
        </div>
        <ul class="list-group w-50 pt-1" v-if="objectDefinition">
            <li class="list-group-item">{{ objectDefinition.segments[0] }}</li>
            <li class="list-group-item">{{ objectDefinition.segments[1] }}</li>
            <li class="list-group-item">{{ objectDefinition.segments[2] }}</li>
        </ul>
        <div v-for="touch in touches">
            <div :style="touchPointTransform(touch)" class="touch-element"></div>
        </div>
        <div v-for="object in objects">
            <div :style="objectPointTransform(object)" class="object-element"></div>
        </div>
    </div>
</template>

<script>

/*
* Google Chrome/Chromium/Canary version above 50:
    chrome://flags/#touch-events
Google Chrome/Chromium/Canary version less then 50 or old versions:
    chrome://flags/#enable-pinch.

* https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
html {
  touch-action:none;
}
*
* chrome.exe --kiosk --incognito --disable-pinch --overscroll-history-navigation=0
*
* */

import TouchPoint from "./Stuctures/TouchPoint";
import ObjectDetectionService from './Services/ObjectDetectionService.js';
import ObjectDefinition from "./Stuctures/ObjectDefinition";

export default {
    name: 'MainView',
    data() {
        return {
            touches: [
                new TouchPoint(100, 100),
                new TouchPoint(200, 200),
                new TouchPoint(300, 100),
            ],
            objects: [],
            objectDefinition: null
        };
    },
    methods: {
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
        },
        objectPointTransform(detectedPosition) {
            return 'transform:translate(' + detectedPosition.x + 'px,' + detectedPosition.y + 'px)';
        },
        detect() {
            if (!this.objectDefinition) {
                return;
            }
            const service = new ObjectDetectionService();
            const pointDst = service.calculatePointDistances(this.touches);

            const result = service.detectObject(this.objectDefinition, pointDst);
            if (result) {
                this.objects = [
                    service.getDetectedPosition(result, this.touches)
                ];
            }
        },
        calibrate() {
            this.objects = [];
            this.objectDefinition = null;
            const service = new ObjectDetectionService();
            const result = service.calculateObjectDefinition(this.touches, 5);
            if (result) {
                this.objectDefinition = result;
            }
        }
    },
    mounted() {
        document.addEventListener('touchstart', function (event) {
            //console.log(event);
        }, false);
        document.addEventListener('touchend', function (event) {
        }, false);
        document.addEventListener('touchmove', function (event) {
            this.touches = [];
            for (const touch of event.touches) {
                this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            }
            this.detect();
        }.bind(this), false);
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
    }

    .object-element {
        position: absolute;
        width: 160px;
        height: 160px;
        background-color: rgba(0, 255, 0, 0.4);
        border: solid 1px white;
        left: 0;
        top: 0;
        margin-left: -80px;
        margin-top: -80px;
        border-radius: 50%;
    }


}
</style>

<style lang="scss">

@import "~/bootstrap/bootstrap.scss";

html {
    touch-action: none;
}

@font-face {
    font-family: "customFont";
    src: url("../../fonts/font.ttf");
}

body {
    font-family: "customFont", serif;
    user-select: none;
    background-color: darkgray;
    overflow: hidden;
}
</style>