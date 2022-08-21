<template>
    <div class="main-view">
        <div v-for="touch in service.touches">
            <div :style="touchPointTransform(touch)" class="touch-element"></div>
        </div>
    </div>
</template>

<script>

import TouchPoint from "@js/Stuctures/TouchPoint";
import ObjectRecognitionServiceInstance from '@js/Services/ObjectRecongnitionService.js';
import TouchRegister from "@js/Services/TouchRegister";

export default {
    name: 'MultiTouchView',
    data() {
        return {
            service: new TouchRegister()
        };
    },
    methods: {
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
        },
    },
    mounted() {
        this.service.registerInputHandlers();
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
