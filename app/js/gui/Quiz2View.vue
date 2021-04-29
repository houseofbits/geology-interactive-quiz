<template>
    <div class="screen">
        <span class="title">Atpazīsti vietas</span>

        <div :class="{green: isAnswerCorrect(0)}" class="active-area pos-1">{{ text[0].title }}</div>
        <div :class="{green: isAnswerCorrect(1)}" class="active-area pos-2">{{ text[1].title }}</div>
        <div :class="{green: isAnswerCorrect(2)}" class="active-area pos-3">{{ text[2].title }}</div>
        <div :class="{green: isAnswerCorrect(3)}" class="active-area pos-4">{{ text[3].title }}</div>
        <div :class="{green: isAnswerCorrect(4)}" class="active-area pos-5">{{ text[4].title }}</div>

        <div class="details" v-if="selectedAnswer !== null">
            <span class="text">{{ text[selectedAnswer].title }}</span>
            <span class="text" v-for="val in text[selectedAnswer].description">{{ val }}</span>
        </div>

        <div v-for="(object, index) in detectedObjects">
            <div :class="['color-'+object.id]" :style="objectPointTransform(object)"
                 class="object-element">{{ object.id }}
            </div>
        </div>
    </div>
</template>

<script>

import TouchPoint from "@js/Stuctures/TouchPoint";
import ObjectDetectionService from '@js/Services/ObjectDetectionService';
import DetectionFeature from "@js/Stuctures/DetectionFeature";
import TextLV from "@json/quiz2-text-lv.json";

const detectionService = new ObjectDetectionService();

const ActiveFeatures = [
    new DetectionFeature(8, 100, 150, 300, 350),        //Nogāze
    new DetectionFeature(7, 250, 450, 450, 650),        //Pakāje
    new DetectionFeature(3, 550, 450, 750, 650),        //Delta
    new DetectionFeature(3, 400, 150, 600, 350),        //Estuārs
    new DetectionFeature(3, 700, 150, 900, 350)         //Deltas nogāze
];

const ColumnPins = {
    upper: [
        3,14,15,4,11
    ],
    lower: [
        9,8,13,7,10
    ]
};

const AnswerState = {
    UNKNOWN: 0,
    INCORRECT: 1,
    CORRECT: 2
};

export default {
    name: "Quiz2View",
    data() {
        return {
            isDisabled: false,
            touches: [],
            detectedObjects: [],
            objectDefinitionsArray: [],
            detectorLoopIntervalId: null,
            time: 0,
            selectedAnswer: null,
            answerIndex: null,
        };
    },
    watch: {
        answerIndex(id) {
            // this.isDisabled = true;
            // if (id === null) {
            //     return;
            // }
            this.selectedAnswer = this.answerIndex;
        }
    },
    computed: {
        text() {
            return TextLV;
        },
    },
    methods: {
        isAnswerCorrect(i) {
            return this.selectedAnswer === i;
        },
        objectPointTransform(detectedPosition) {
            return 'transform:translate(' + detectedPosition.x + 'px,' + detectedPosition.y + 'px)';
        },
        detectSmart() {
            this.detectedObjects = detectionService.detectObjects(this.time, this.touches, this.objectDefinitionsArray, this.detectedObjects);
            this.checkForAnswer();
        },
        runDetectionLoop() {
            this.detectorLoopIntervalId = setInterval(() => {
                this.detectSmart();
                this.time += 16;
            }, 16);
        },
        checkForAnswer() {
            if (!this.isDisabled) {
                let answerIndex = null;
                if (this.detectedObjects.length > 0) {
                    for (let i = 0; i < ActiveFeatures.length; i++) {
                        let featureResults = detectionService.matchDetectedWithFeature(this.detectedObjects, ActiveFeatures[i]);
                        if (featureResults.length > 0) {
                            for (const result of featureResults) {
                                if (result.id === ActiveFeatures[i].id) {
                                    answerIndex = i;
                                }
                            }
                        }
                    }
                }
                this.answerIndex = answerIndex;
            }
        },
        setPortPin(pin, state) {
            const pinName = 'pin' + pin;
            axios.get('http://raspberry.pi:8888/set-port-pins', {
                responseType: 'text',
                params: {
                    port: 0,
                    [pinName]: state
                }
            });
        },
        setLightState(column) {
            for (const [i, v] of ColumnPins.lower.entries()) {
                this.setPortPin(v, i === column)
            }
            for (const [i, v] of ColumnPins.upper.entries()) {
                this.setPortPin(v, i === column)
            }
        }
    },
    mounted() {
        document.addEventListener('touchstart', function (event) {
            for (const touch of event.touches) {
                this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            }
        }.bind(this), false);
        document.addEventListener('touchend', function (event) {
            this.touches = [];
        }, false);
        document.addEventListener('touchmove', function (event) {
            this.touches = [];
            for (const touch of event.touches) {
                this.touches.push(new TouchPoint(touch.clientX, touch.clientY));
            }
        }.bind(this), false);

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        this.objectDefinitionsArray = detectionService.getObjectDefinitions();

        this.runDetectionLoop();

    }
}
</script>

<style lang="scss" scoped>

.screen {
    position: absolute;
    width: 1024px;
    height: 768px;

    .title {
        display: inline-block;
        width: 100%;
        color: white;
        text-align: center;
        font-size: 30px;
        line-height: 80px;
        //border: solid 1px red;
    }

    .details {
        position: absolute;
        background-color: rgba(100,100,100,0.7);
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
        height:200px;
        border-radius: 60px;
        color:white;
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
            top:150px;
            left:100px;
        }
        //Pakāje
        &.pos-2 {
            top:450px;
            left:250px;
        }
        //Delta
        &.pos-3 {
            top:450px;
            left:550px;
        }
        //Estuārs
        &.pos-4 {
            top:150px;
            left:400px;
        }
        //Deltas nogāze
        &.pos-5 {
            top:150px;
            left:700px;
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
</style>