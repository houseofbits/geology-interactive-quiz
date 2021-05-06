<template>
    <div class="screen">
        <span class="title">Atpazīsti vietas</span>

        <quiz2-slide v-for="(n, index) in 5" :index="index" :key="'slide'+index" :is-open="openIndex===index" @click="testClick"
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

        <element-tag v-for="(a, index) in 5" class="tag" :data-index="index" :class="{visible: !openIndex}"
                     :key="'element'+index"/>
        <div v-for="(a, index) in 5" class="point" :data-index="index" :class="{visible: !openIndex}" :key="'line'+index">
            <div class="line"></div>
        </div>

        <div class="main-title" :class="{visible: !openIndex}">Atpazīsti vietas</div>
    </div>
</template>

<script>

import Quiz2Slide from "./components/Quiz2Slide.vue";
import ElementTag from "./components/ElementTag.vue";
import DetectionFeature from "@js/Stuctures/DetectionFeature";
import TextLV from "@json/quiz2-text-lv.json";
import ObjectRecognitionServiceInstance from '@js/Services/ObjectRecongnitionService.js';

const ColumnPins = {
    upper: [
        3, 14, 15, 4, 11
    ],
    lower: [
        9, 8, 13, 7, 10
    ]
};

const AnswerState = {
    UNKNOWN: 0,
    INCORRECT: 1,
    CORRECT: 2
};

const CorrectAnswersIds = [1, 2, 3, 4, 5];

export default {
    name: "Quiz2View",
    components: {
        Quiz2Slide,
        ElementTag
    },
    data() {
        return {
            answerIndex: null,
            openIndex: null
        };
    },
    watch: {
        answerIndex(id) {
            if (id === null) {
                return;
            }
            this.openIndex = id;
        }
    },
    computed: {
        text() {
            return TextLV;
        },
    },
    methods: {
        testClick(index) {
            this.openIndex = index;
        },
        closeSlide() {
            this.openIndex = null;
        },
        checkAnswer(result) {
            const id = result.regionId;
            if (CorrectAnswersIds[id] === result.id) {
                this.answerIndex = id;
            } else {
                this.answerIndex = null;
            }
        },
        requestPortPinsWithParams(params) {
            axios.get('http://raspberry.pi:8888/set-port-pins', {
                responseType: 'text',
                params: params
            });
        },
        requestLightState(column) {
            let params = {
                port: 0
            };
            for (const [i, v] of ColumnPins.lower.entries()) {
                params['pin' + v] = (i === column) ? 1 : 0;
            }
            for (const [i, v] of ColumnPins.upper.entries()) {
                params['pin' + v] = (i === column) ? 1 : 0;
            }
            this.requestPortPinsWithParams(params);
        },
        onNewObjectDetected(result) {
            this.checkAnswer(result);
        },
        onObjectRemoved(result) {
        },
        onObjectUpdated(result) {
            this.checkAnswer(result);
        }
    },
    mounted() {

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(0, 0, 0, 203, 350));
        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(1, 203, 0, 407, 450));
        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(2, 407, 0, 612, 350));
        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(3, 612, 0, 818, 450));
        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(4, 818, 0, 1024, 350));

        ObjectRecognitionServiceInstance.detectedHandler = this.onObjectUpdated;
        ObjectRecognitionServiceInstance.detectedNewHandler = this.onNewObjectDetected;
        ObjectRecognitionServiceInstance.detectedLostHandler = this.onObjectRemoved;

        ObjectRecognitionServiceInstance.runDetectionLoop();

    }
}
</script>

<style lang="scss" scoped>

.screen {
    position: absolute;
    width: 1024px;
    height: 768px;
    background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);

    .main-title {
        display: inline-block;
        color: gray;
        position: absolute;
        width: 1024px;
        top: 20px;
        left: 0;
        height: 80px;
        text-align: center;
        font-size: 65px;
        line-height: 80px;
        text-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        background: linear-gradient(to bottom, rgba(255, 183, 107, 1) 0%, rgba(255, 167, 61, 1) 55%, rgba(255, 124, 0, 1) 87%, rgba(255, 127, 4, 1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0.0;
        transition: all linear 500ms;
        z-index: 5;

        &.visible {
            opacity: 1.0;
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
    z-index: 5;
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
            height: 380px;
        }
    }

    &[data-index="1"] {
        left: 287.2px;
        bottom: 80px;

        .line {
            height: 290px;
        }
    }

    &[data-index="2"] {
        left: 492px;
        bottom: 80px;

        .line {
            height: 380px;
        }
    }

    &[data-index="3"] {
        left: 696.8px;
        bottom: 80px;

        .line {
            height: 290px;
        }
    }

    &[data-index="4"] {
        left: 901.6px;
        bottom: 80px;

        .line {
            height: 380px;
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