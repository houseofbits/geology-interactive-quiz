<template>
    <div class="main-view">
        <div v-for="touch in service.touches">
            <div :style="touchPointTransform(touch)" class="touch-element">
                <div class="aura"></div>
            </div>
        </div>
    </div>
</template>

<script>

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
        this.service.region.maxx = 1080;
        this.service.region.maxy = 768;
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
}
</style>
