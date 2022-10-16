<template>
    <div class="main-view">
        <div class="container m-0 p-0">

<!--            <detector :position-x="100" :position-y="100" :definitions="featureDefinitions" :correct-answer="6" :state="state1" @detected="(s) => this.state1 = s" @failed="() => this.state1 = null"/>-->
<!--            <detector :position-x="200" :position-y="300" :definitions="featureDefinitions" :correct-answer="6" :state="state2" @detected="(s) => this.state2 = s" @failed="() => this.state2 = null"/>-->

            <div class="row m-0 mt-2">
                <h4 class="text-light">{{ isDetectionStarted ? "Detection in progress" : ""}}</h4>
                <div class="col-2 pl-1">
                    <table v-if="results" class="table table-bordered table-sm table-dark table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Matching</th>
                            <th>CountW</th>
                            <th>Total</th>
                            <th>Min</th>
                            <th>Max</th>
                            <th>Mean</th>
                            <th>Count</th>
                            <th>Angles</th>
                            <th>Angle sum</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(result, index) in results" :key="index">
                            <td>{{ result.id }}</td>
                            <td>{{ result.matchingWeight }}</td>
                            <td>{{ result.countWeight }}</td>
                            <td>{{ result.totalWeight }}</td>
                            <td>{{ result.minWeight }}</td>
                            <td>{{ result.maxWeight }}</td>
                            <td>{{ result.meanWeight }}</td>
                            <td>{{ result.count }}</td>
                            <td>{{ result.angles }}</td>
                            <td>{{ result.angleSum }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-for="touch in detector.touch.touches">
                <div :style="touchPointTransform(touch)" class="touch-element">
                    <div class="aura"></div>
                </div>
            </div>
        </div>

        <div class="container offscreen">
            <button class="btn btn-lg btn-success mt-2 btn-block mx-1" @click="simulateTouch">Simulate touch</button>
        </div>
    </div>
</template>

<script>

import RegionDetectionService from '@js/Services/RegionDetectionService';
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import Config from "@json/config.json";
import Detector from "@js/gui/components/Detector.vue";
import SimilarFeatureFinder from "@js/Services/SimilarFeatureFinder";
import TouchSimulatorMixin from "@js/Helpers/TouchSimulatorMixin.js";

export default {
    name: 'DetectorView',
    components: {Detector},
    mixins: [TouchSimulatorMixin],
    data() {
        return {
            state1: null,
            state2: null,
            detector: new RegionDetectionService(),
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions3, 15),
            results: null,
            isDetectionStarted: false,
            similarFeatureFinder: new SimilarFeatureFinder()
        };
    },
    methods: {
        touchPointTransform(touchPoint) {
            return 'transform:translate(' + touchPoint.x + 'px,' + touchPoint.y + 'px)';
        },
        resultHandler(results) {
            this.results = results;
            this.isDetectionStarted = false;
        },
        beginDetection() {
            this.isDetectionStarted = true;
        },
        simulateTouch() {
            this.toggleFeatureEvent(1, 400,400, this.featureDefinitions);
        }
    },
    mounted() {
        this.detector.touch.region.set(0, 0, 1024, 768);
        this.detector.touch.registerInputHandlers();
        this.detector.featureDefinitions = this.featureDefinitions;
        this.detector.rawResultHandler = this.resultHandler;
        this.detector.detectStartHandler = this.beginDetection;
        this.detector.runDetectionLoop();

        // this.similarFeatureFinder.setFeatures(this.featureDefinitions);
        // for (let i = 0; i < this.featureDefinitions.length; i++) {
        //     this.similarFeatureFinder.findSimilar(i);
        // }
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

    .offscreen {
        position: absolute;
        width: 1024px;
        height: 500px;
        top: 768px;
    }

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
