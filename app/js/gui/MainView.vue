<template>
    <div class="main-view">
        <div class="container m-0 p-0">
            <div class="row debug m-0 p-0 pt-2 pl-2">
                <button :class="{'btn-primary': !isSmartDetectOn, 'btn-success':isSmartDetectOn}" class="btn btn-lg m-1"
                        type="button" @click="isSmartDetectOn = !isSmartDetectOn">Smart detect
                    {{ (isSmartDetectOn ? 'ON' : 'OFF') }}
                </button>
                <button v-if="touches.length > 0" class="btn btn-lg btn-secondary m-1" type="button" @click="calibrate">Calibrate</button>
                <button v-if="objectDefinition" class="btn btn-lg btn-success m-1" type="button" @click="saveObjectDefinition">
                    Add
                </button>
                <button class="btn btn-lg btn-danger m-1" type="button" @click="clearBuffers">Clear buffers</button>
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
                            <td>{{ segment[1].toFixed(2) }}</td>
                            <td>{{ segment[2].toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table v-if="objects.length > 0" class="table table-bordered table-sm table-dark table-striped">
                        <thead>
                        <tr>
                            <th>id</th>
                            <th>weight</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(objPos, index) in objects" :key="index">
                            <td>{{ objPos.result.definition.id }}</td>
                            <td>{{ objPos.result.weight.toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="pointDistances.length > 0" class="col-3 m-0 pl-1">
                    <table class="table table-bordered table-sm table-dark table-striped">
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
                <div v-if="touches.length > 0" class="col-2 m-0 pl-1">
                    <table class="table table-bordered table-sm table-dark table-striped">
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
                <div v-if="objectDefinitionsArray.length > 0" class="col-5 pl-1">
                    <table class="table table-bordered table-sm table-dark table-striped">
                        <thead>
                        <tr>
                            <th colspan="4">Object definitions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(def, index) in objectDefinitionsArray" :key="index">
                            <td>{{ def.id }}</td>
                            <td v-for="(segment, index) in def.segments" :key="index">{{ segment[0].toFixed(2) }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-for="touch in touches">
            <div :style="touchPointTransform(touch)" class="touch-element"></div>
        </div>
        <div v-for="(object, index) in objects">
            <div :class="['color-'+object.result.definition.id]" :style="objectPointTransform(object)"
                 class="object-element">{{ object.result.definition.id }}
                {{ object.result.weight.toFixed(2) }}
            </div>
        </div>
        <div v-for="(object, index) in detectedObjects">
            <div :class="['color-'+object.id]" :style="objectPointTransform(object)"
                 class="object-element">{{ object.id }}
            </div>
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

import TouchPoint from "@js/Stuctures/TouchPoint";
import ObjectDetectionService from '@js/Services/ObjectDetectionService';

export default {
    name: 'MainView',
    data() {
        return {
            touches: [],
            detectedObjects: [],
            objects: [],    //Debug detected objects
            objectDefinition: null,
            objectDefinitionsArray: [],
            pointDistances: [],
            detectorLoopIntervalId: null,
            time: 0,
            isSmartDetectOn: false
        };
    },
    methods: {
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
        },
        objectPointTransform(detectedPosition) {
            return 'transform:translate(' + detectedPosition.x + 'px,' + detectedPosition.y + 'px)';
        },
        detectSmart() {
            const service = new ObjectDetectionService();
            this.detectedObjects = service.detectObjects(this.time, this.touches, this.objectDefinitionsArray, this.detectedObjects);
        },
        detect() {
            const service = new ObjectDetectionService();
            this.objects = service.detectObjectsRaw(this.touches, this.objectDefinitionsArray);
        },
        calibrate() {
            this.objects = [];
            const service = new ObjectDetectionService();
            const objDefId = 'def-' + this.objectDefinitionsArray.length;
            this.objectDefinition = service.calculateObjectDefinition(objDefId, this.touches, 10);
        },
        saveObjectDefinition() {
            if (this.objectDefinition) {
                this.objectDefinitionsArray.push(this.objectDefinition);
                this.objectDefinition = null;
            }
        },
        runDetectionLoop() {
            //this.detectorLoopIntervalId = setInterval(this.detect, 16);
            this.detectorLoopIntervalId = setInterval(() => {
                if (this.isSmartDetectOn) {
                    this.detectSmart();
                } else {
                    this.detect();
                }
                this.time += 16;
            }, 16);
        },
        clearBuffers() {
            this.objects = [];
            this.detectedObjects = [];
            this.touches = [];
            this.objectDefinition = null;
        }
    },
    mounted() {
        document.addEventListener('touchstart', function (event) {
            // for (const touch of event.touches) {
            //     this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            // }
            //this.detect();
        }.bind(this), false);
        document.addEventListener('touchend', function (event) {
        }, false);
        document.addEventListener('touchmove', function (event) {
            this.touches = [];
            for (const touch of event.touches) {
                this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            }
            //this.detect();
        }.bind(this), false);

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        const service = new ObjectDetectionService();

        // this.objectDefinitionsArray.push(
        //     service.createObjectDefinition(0, 68, 116, 131, 5)
        // );
        // this.objectDefinitionsArray.push(
        //     service.createObjectDefinition(1, 57, 116, 129, 5)
        // );

        this.objectDefinitionsArray.push(
            service.createObjectDefinition(1, 63.8, 53.8, 97.4, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(2, 63.8, 67.2, 84.0, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(3, 63.8, 84.0, 90.7, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(4, 63.8, 97.4, 100.8, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(5, 63.84, 53.76, 67.2, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(6, 53.76, 67.2, 84.0, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(7, 53.76, 84.0, 94.08, 5)
        );
        this.objectDefinitionsArray.push(
            service.createObjectDefinition(8, 53.76, 97.44, 104.16, 5)
        );

        this.runDetectionLoop();

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
        width: 180px;
        height: 180px;
        border: solid 1px white;
        left: 0;
        top: 0;
        margin-left: -90px;
        margin-top: -90px;
        border-radius: 50%;
        color: white;
        text-align: center;
        line-height: 80px;
        font-size: 20px;

        &.color-1 {
            background-color: rgba(255, 157, 0, 0.5);
        }

        &.color-2 {
            background-color: rgba(226, 255, 0, 0.5);
        }

        &.color-3 {
            background-color: rgba(0, 255, 66, 0.5);
        }

        &.color-4 {
            background-color: rgba(0, 249, 255, 0.5);
        }

        &.color-5 {
            background-color: rgba(133, 0, 255, 0.5);
        }

        &.color-6 {
            background-color: rgba(0, 122, 255, 0.5);
        }

        &.color-7 {
            background-color: rgba(255, 0, 176, 0.5);
        }

        &.color-8 {
            background-color: rgba(255, 0, 0, 0.5);
        }
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