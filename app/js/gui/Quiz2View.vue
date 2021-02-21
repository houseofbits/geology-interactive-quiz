<template>
    <div class="screen">
        <span class="title">Atpazīsti vietas</span>

        <div :class="{green: isAnswerCorrect(0), red: isAnswerIncorrect(0)}" class="active-area pos-1">Nogāze</div>
        <div :class="{green: isAnswerCorrect(1), red: isAnswerIncorrect(1)}" class="active-area pos-2">Pakāje</div>
        <div :class="{green: isAnswerCorrect(2), red: isAnswerIncorrect(2)}" class="active-area pos-3">Delta</div>
        <div :class="{green: isAnswerCorrect(3), red: isAnswerIncorrect(3)}" class="active-area pos-4">Estuārs</div>
        <div :class="{green: isAnswerCorrect(4), red: isAnswerIncorrect(4)}" class="active-area pos-5">Deltas nogāze</div>

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

const detectionService = new ObjectDetectionService();

const ActiveFeatures = [
    new DetectionFeature(8, 100, 150, 300, 350),        //Nogāze
    new DetectionFeature(7, 250, 450, 450, 650),        //Pakāje
    new DetectionFeature(3, 550, 450, 750, 650),        //Delta
    new DetectionFeature(3, 400, 150, 600, 350),        //Estuārs
    new DetectionFeature(3, 700, 150, 900, 350)         //Deltas nogāze
];

const AnswerState = {
    UNKNOWN: 0,
    INCORRECT: 1,
    CORRECT: 2
};

export default {
    name: "Quiz2View",
    data() {
        return {
            touches: [],
            detectedObjects: [],
            objectDefinitionsArray: [],
            detectorLoopIntervalId: null,
            time: 0,
            answerState: [
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN
            ]
        };
    },
    methods: {
        isAnswerCorrect(i) {
            return this.answerState[i] === AnswerState.CORRECT;
        },
        isAnswerIncorrect(i) {
            return this.answerState[i] === AnswerState.INCORRECT;
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
            this.answerState[0] = AnswerState.UNKNOWN;
            this.answerState[1] = AnswerState.UNKNOWN;
            this.answerState[2] = AnswerState.UNKNOWN;
            this.answerState[3] = AnswerState.UNKNOWN;
            this.answerState[4] = AnswerState.UNKNOWN;

            if (this.detectedObjects.length > 0) {
                for (let i = 0; i < ActiveFeatures.length; i++) {
                    let featureResults = detectionService.matchDetectedWithFeature(this.detectedObjects, ActiveFeatures[i]);
                    if (featureResults.length > 0) {
                        for (const result of featureResults) {
                            this.$set(this.answerState,
                                i,
                                (result.id === ActiveFeatures[i].id) ? AnswerState.CORRECT : AnswerState.INCORRECT
                            );
                        }
                    }
                }
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