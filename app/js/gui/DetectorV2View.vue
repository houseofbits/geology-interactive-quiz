<template>
    <div class="main-view">
        <div class="container m-0 p-0">

            <detector :position-x="100" :position-y="100" :definitions="featureDefinitions" :correct-answer="6" :state="state1" @detected="(s) => this.state1 = s" @failed="() => this.state1 = null"/>
            <detector :position-x="200" :position-y="300" :definitions="featureDefinitions" :correct-answer="6" :state="state2" @detected="(s) => this.state2 = s" @failed="() => this.state2 = null"/>

            <div v-for="touch in detector.touch.touches">
                <div :style="touchPointTransform(touch)" class="touch-element"></div>
            </div>
        </div>
    </div>
</template>

<script>

import RegionDetectionService from '@js/Services/RegionDetectionService';
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import Config from "@json/config.json";
import Detector from "@js/gui/components/Detector.vue";

export default {
    name: 'DetectorView',
    components: {Detector},
    data() {
        return {
            state1: null,
            state2: null,
            detector: new RegionDetectionService(),
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions1, 15)
        };
    },
    methods: {
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
        },
    },
    mounted() {
        this.detector.touch.region.set(0, 0, 1024, 768);
        this.detector.touch.registerInputHandlers();
        this.detector.featureDefinitions = this.featureDefinitions; //FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions1, 15);
        //this.detector.runDetectionLoop();
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
