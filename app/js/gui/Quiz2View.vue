<template>
    <div class="screen">

        <quiz2-slide v-for="(n, index) in 5" :index="index" :key="'slide'+index" :is-open="openIndex===index"
                     @close="closeSlide">
            <template v-slot:text>
                <div class="info">
                    <h1>{{ text[index].title }}</h1>
                    <ul>
                        <li v-for="desc in text[index].description">{{ desc }}</li>
                    </ul>
                </div>
            </template>
        </quiz2-slide>

        <detector v-for="(a, index) in 5"
                  :key="index"
                  :class="{visible: openIndex===null}"
                  :position-x="tagState[index].x"
                  :position-y="tagState[index].y"
                  :definitions="featureDefinitions"
                  :correct-answer="tagState[index].answer"
                  :state="tagState[index].state"
                  @detected="(s) => setTagAnswerState(index, s)"
                  @failed="failedDetection"/>

        <div v-for="(a, index) in 5" class="point" :data-index="index" :class="{visible: !openIndex}"
             :key="'line'+index">
            <div class="line"></div>
        </div>

        <div class="main-title" :class="{visible: !openIndex}">
            <span>Atpazīsti vietas</span>

            <div v-if="hasDetectionError" class="detector-info">
                <div class="icon hand-icon-2"></div>
                <div class="text">
                    Neizdevās atpazīt elementu. Mēģini vēlreiz novietojot elementu precīzi sarkanajā aplī.
                </div>
            </div>
            <div v-else class="detector-info">
                <div class="icon hand-icon-1"></div>
                <div class="text">Novieto atbilstošo elementu sarkanajā aplī. Turi to vismaz 2 sekundes, kamēr notiek
                    atpazīšana.
                </div>
            </div>

        </div>

        <div class="container offscreen">
            <div class="row">
                <div class="col-lg-6 text-center">
                    <button class="btn btn-lg btn-success mt-2 btn-block" @click="setDebugState(0,true)">Correct #1
                    </button>
                    <button class="btn btn-lg btn-success mt-2 btn-block" @click="setDebugState(1,true)">Correct #2
                    </button>
                    <button class="btn btn-lg btn-success mt-2 btn-block" @click="setDebugState(2,true)">Correct #3
                    </button>
                    <button class="btn btn-lg btn-success mt-2 btn-block" @click="setDebugState(3,true)">Correct #4
                    </button>
                    <button class="btn btn-lg btn-success mt-2 btn-block" @click="setDebugState(4,true)">Correct #5
                    </button>
                </div>
                <div class="col-lg-6 text-center">
                    <button class="btn btn-lg btn-danger mt-2 btn-block" @click="setDebugState(0,false)">Wrong #1
                    </button>
                    <button class="btn btn-lg btn-danger mt-2 btn-block" @click="setDebugState(1,false)">Wrong #2
                    </button>
                    <button class="btn btn-lg btn-danger mt-2 btn-block" @click="setDebugState(2,false)">Wrong #3
                    </button>
                    <button class="btn btn-lg btn-danger mt-2 btn-block" @click="setDebugState(3,false)">Wrong #4
                    </button>
                    <button class="btn btn-lg btn-danger mt-2 btn-block" @click="setDebugState(4,false)">Wrong #5
                    </button>
                </div>
            </div>
        </div>


    </div>
</template>

<script>

import axios from 'axios';
import Quiz2Slide from "./components/Quiz2Slide.vue";
import TextLV from "@json/quiz2-text-lv.json";
import ObjectRecognitionServiceInstance from '@js/Services/ObjectRecongnitionService.js';
import Config from "@json/config.json";
import {AnswerState} from "@js/Stuctures/Constants.js";
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import Detector from "@js/gui/components/Detector.vue";

export default {
    name: "Quiz2View",
    components: {
        Quiz2Slide,
        Detector
    },
    data() {
        return {
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions2, 15),
            answerIndex: null,
            openIndex: null,
            tagState: [
                {
                    state: null,
                    timer: null,
                    x: 25,
                    y: 150,
                    answer: 1,
                },
                {
                    state: null,
                    timer: null,
                    x: 230,
                    y: 250,
                    answer: 2,
                },
                {
                    state: null,
                    timer: null,
                    x: 435,
                    y: 150,
                    answer: 3,
                },
                {
                    state: null,
                    timer: null,
                    x: 640,
                    y: 250,
                    answer: 5,
                },
                {
                    state: null,
                    timer: null,
                    x: 845,
                    y: 150,
                    answer: 7,
                },
            ],
            hasDetectionError: false,
            detectionErrorTimeout: null,
        };
    },
    watch: {
        answerIndex(id) {
            if (id === null) {
                return;
            }
            this.openIndex = id;
            this.requestLightState(this.openIndex);
        }
    },
    computed: {
        text() {
            return TextLV;
        },
    },
    methods: {
        setDebugState(index, state) {
            this.setTagAnswerState(index, state ? AnswerState.CORRECT : AnswerState.INCORRECT);
        },
        isTagCorrect(index) {
            return this.tagState[index].state === AnswerState.CORRECT;
        },
        isTagIncorrect(index) {
            return this.tagState[index].state === AnswerState.INCORRECT;
        },
        setTagAnswerState(index, state) {
            if (this.tagState[index].state === null) {
                this.tagState[index].state = state;
                setTimeout(() => this.openSlide(index), 1000);
            } else if (state === null) {
                this.tagState[index].state = null;
            }
        },
        openSlide(index) {
            this.answerIndex = (this.tagState[index].state === AnswerState.CORRECT) ? index : null;

            clearTimeout(this.tagState[index].timer);

            this.tagState[index].timer = setTimeout(() => {
                this.setTagAnswerState(index, null);
            }, 5000);
        },
        clearTagState() {
            this.setTagAnswerState(0, null);
            this.setTagAnswerState(1, null);
            this.setTagAnswerState(2, null);
            this.setTagAnswerState(3, null);
            this.setTagAnswerState(4, null);
        },
        closeSlide() {
            this.requestLightState(null);
            this.openIndex = null;
            this.answerIndex = null;
            this.clearTagState();
        },
        async requestPortPinsWithParams(params) {
            try {
                await axios.get(Config.quiz2.endpointUrl, {
                    responseType: 'text',
                    withCredentials: false,
                    params: params
                });
            } catch (e) {
                console.log('axios error' + e.message);
            }
        },
        requestLightState(column) {
            const pins = Config.quiz2.columnPins;
            let params = {
                port: 0
            };
            for (const [i, v] of pins.lower.entries()) {
                params['pin' + v] = (i === column) ? 1 : 0;
            }
            for (const [i, v] of pins.upper.entries()) {
                params['pin' + v] = (i === column) ? 1 : 0;
            }
            this.requestPortPinsWithParams(params);
        },
        failedDetection() {
            this.hasDetectionError = true;
            clearTimeout(this.detectionErrorTimeout);
            this.detectionErrorTimeout = setTimeout(() => this.hasDetectionError = false, 5000);
        },
    },
    mounted() {

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        this.clearTagState();

        // ObjectRecognitionServiceInstance.setObjectDefinitions(Config.objectDefinitions2);
        //
        // ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(0, 0, 0, 203, 350));
        // ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(1, 203, 0, 407, 450));
        // ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(2, 407, 0, 612, 350));
        // ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(3, 612, 0, 818, 450));
        // ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(4, 818, 0, 1024, 350));
        //
        // ObjectRecognitionServiceInstance.detectedHandler = this.onObjectUpdated;
        // ObjectRecognitionServiceInstance.detectedNewHandler = this.onNewObjectDetected;
        // ObjectRecognitionServiceInstance.detectedLostHandler = this.onObjectRemoved;
        //
        // ObjectRecognitionServiceInstance.runDetectionLoop();

    }
}
</script>

<style lang="scss" scoped>

.screen {
    position: absolute;
    width: 1024px;
    height: 768px;
    //background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);
    background: white;

    .offscreen {
        position: absolute;
        width: 1024px;
        height: 500px;
        top: 768px;
    }

    .main-title {
        display: inline-block;
        color: gray;
        position: absolute;
        font-weight: bold;
        width: 1024px;
        left: 0;
        height: 120px;
        text-align: center;
        font-size: 38px;
        line-height: 80px;
        background-color: white;
        color: #606060;
        opacity: 0.0;
        transition: all linear 500ms;

        &.visible {
            opacity: 1.0;
        }
    }

    .detector-info {
        display: flex;
        align-content: flex-end;
        justify-content: center;
        flex-direction: row;
        align-items: flex-end;
        position: absolute;
        top: 35px;
        left: 0;
        right: 0;
        padding: 6px;

        & .icon {
            width: 70px;
            height: 70px;
            margin-right: 8px;
            background-size: cover;

            &.hand-icon-1 {
                background-image: url('@images/hand-icon-1.png');
            }

            &.hand-icon-2 {
                background-image: url('@images/hand-icon-2.png');
            }
        }

        & .text {
            font-size: 18px;
            font-weight: normal;
        }
    }

    .details {
        position: absolute;
        background-color: rgba(100, 100, 100, 0.7);
        top: 200px;
        bottom: 200px;
        left: 100px;
        right: 100px;
        color: white;

        .text {
            font-size: 22px;
            display: inline-block;
            width: 100%;
            padding-right: 30px;
            padding-left: 30px;
            padding-top: 30px;
        }
    }

    .active-area {
        position: absolute;
        width: 200px;
        height: 200px;
        border-radius: 60px;
        color: white;
        font-size: 25px;
        text-align: center;
        line-height: 200px;
        background: repeating-linear-gradient(
                45deg,
                rgba(247, 160, 22, 0.51) 0,
                rgba(255, 169, 0, 0.77) 20px,
                rgba(255, 145, 0, 0) 20px,
                rgba(255, 153, 62, 0) 40px
        );
        //Nogāze
        &.pos-1 {
            top: 150px;
            left: 100px;
        }

        //Pakāje
        &.pos-2 {
            top: 450px;
            left: 250px;
        }

        //Delta
        &.pos-3 {
            top: 450px;
            left: 550px;
        }

        //Estuārs
        &.pos-4 {
            top: 150px;
            left: 400px;
        }

        //Deltas nogāze
        &.pos-5 {
            top: 150px;
            left: 700px;
        }

        &.green {
            background: repeating-linear-gradient(
                    45deg,
                    rgba(137, 255, 0, 0.6) 0,
                    rgba(112, 255, 0, 0.66) 20px,
                    rgba(0, 0, 255, 0) 20px,
                    rgba(63, 187, 62, 0) 40px
            );
            border: solid 10px rgba(112, 255, 0, 0.66);
        }

        &.red {
            background: repeating-linear-gradient(
                    45deg,
                    rgba(255, 96, 0, 0.6) 0,
                    rgba(255, 96, 0, 0.66) 20px,
                    rgba(255, 96, 0, 0) 20px,
                    rgba(255, 96, 0, 0) 40px
            );
            border: solid 10px rgba(255, 96, 0, 0.6);
        }
    }

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

.tag {
    position: absolute;
    z-index: 10;
    opacity: 0;
    transition: all linear 500ms;

    &.visible {
        opacity: 1;
    }

    &[data-index="0"] {
        top: 120px;
        left: 27.4px;
    }

    &[data-index="1"] {
        top: 210px;
        left: 232.2px;
    }

    &[data-index="2"] {
        top: 120px;
        left: 437px;
    }

    &[data-index="3"] {
        top: 210px;
        left: 641.8px;
    }

    &[data-index="4"] {
        top: 120px;
        left: 846.6px;
    }
}

.point {
    position: absolute;
    background-color: white;
    width: 40px;
    height: 40px;
    z-index: 4;
    border-radius: 50%;
    opacity: 0;
    transition: all linear 500ms;

    &.visible {
        opacity: 0.7;
    }

    .line {
        position: absolute;
        width: 3px;
        height: 200px;
        background-color: white;
        bottom: 40px;
        left: 18px;
    }

    &[data-index="0"] {
        left: 82.4px;
        bottom: 80px;

        .line {
            height: 346px;
        }
    }

    &[data-index="1"] {
        left: 287.2px;
        bottom: 80px;

        .line {
            height: 247px;
        }
    }

    &[data-index="2"] {
        left: 492px;
        bottom: 80px;

        .line {
            height: 346px;
        }
    }

    &[data-index="3"] {
        left: 696.8px;
        bottom: 80px;

        .line {
            height: 247px;
        }
    }

    &[data-index="4"] {
        left: 901.6px;
        bottom: 80px;

        .line {
            height: 346px;
        }
    }
}

.info {
    background-color: rgba(255, 255, 255, 0.6);
    margin: 50px;
    color: black;
    padding: 20px;

    h1 {
        font-size: 50px;
    }

    ul li {
        font-size: 23px;
        line-height: 23px;
        padding-top: 25px;
    }
}
</style>