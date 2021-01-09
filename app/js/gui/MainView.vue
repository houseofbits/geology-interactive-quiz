<template>
    <div class="main-view">
        <div v-for="touch in touches">
            <div :style="touchPointTransform(touch)" class="touch-element"></div>
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

export default {
    name: 'MainView',
    data() {
        return {
            touches: [],
        };
    },
    methods: {
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
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


}
</style>

<style>
html {
    touch-action:none;
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