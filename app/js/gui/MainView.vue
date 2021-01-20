<template>
    <div class="main-view">
        <div class="container m-0 p-0">
            <div class="row debug m-0 p-0">
                <button class="btn btn-primary m-1" type="button" @click="detect">Detect</button>
                <button class="btn btn-primary m-1" type="button" @click="calibrate">Calibrate</button>
            </div>
            <div class="row m-0 mt-2">
                <div class="col-2 pl-1">
                    <table v-if="objectDefinition" class="table table-bordered table-sm table-dark table-striped">
                        <thead>
                        <tr>
                            <th>min</th>
                            <th>max</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(segment, index) in objectDefinition.segments" :key="index">
                            <td>{{ segment[0].toFixed(2) }}</td>
                            <td>{{ segment[1].toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-3 m-0 pl-1">
                    <table v-if="pointDistances.length > 0" class="table table-bordered table-sm table-dark table-striped">
                        <thead>
                        <tr>
                            <th>A</th>
                            <th>B</th>
                            <th>dst (px)</th>
                            <th>dst (mm)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(dst, index) in pointDistances" :key="index">
                            <td>{{ dst.indexA }}</td>
                            <td>{{ dst.indexB }}</td>
                            <td>{{ dst.distance.toFixed(2) }}</td>
                            <td>{{ (dst.distance / 3.36).toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-2 m-0 pl-1">
                    <table v-if="touches.length > 0" class="table table-bordered table-sm table-dark table-striped">
                        <thead>
                        <tr>
                            <th>x</th>
                            <th>y</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(touch, index) in touches" :key="index">
                            <td>{{ touch.x.toFixed(2) }}</td>
                            <td>{{ touch.y.toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
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
*   1) Install gnome extension: sudo apt-get install chrome-gnome-shell
*   2) Open in Chroms: https://extensions.gnome.org/extension/1140/disable-gestures/
*   3) Add extension
*   4) Done
*
*
* width = 303 mm
* height = 229 mm
*
* 3.36 px/mm
*
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
            objectDefinition: null,
            pointDistances: []
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
            this.pointDistances = service.calculatePointDistances(this.touches);

            const result = service.detectObject(this.objectDefinition, this.pointDistances);
            if (result) {
                this.objects = [
                    service.getDetectedPosition(result, this.touches)
                ];
            }
        },
        calibrate() {
            this.objects = [];
            const service = new ObjectDetectionService();
            this.objectDefinition = service.calculateObjectDefinition(this.touches, 5);
        }
    },
    mounted() {
        document.addEventListener('touchstart', function (event) {
            //console.log(event);
            //this.touches = [];
            for (const touch of event.touches) {
                this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            }
            this.detect();
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


        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });
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