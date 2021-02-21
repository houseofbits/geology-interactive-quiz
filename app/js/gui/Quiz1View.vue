<template>
    <div class="screen">
        <span class="title">Izvēlies pareizo iezi</span>

        <div class="column1">
            <div :class="{green: isAnswerACorrect, red: isAnswerAIncorrect}" class="question-block">Iezis veidojies
                dēdēšanas procesā kalnu masīvu nogāzēs un kalnu upēs. Iežu
                atlūzas ir noapaļotas.
            </div>
            <div :class="{green: isAnswerACorrect, red: isAnswerAIncorrect}" class="active-area"></div>
        </div>
        <div class="column2">
            <div :class="{green: isAnswerBCorrect, red: isAnswerBIncorrect}" class="question-block">Iezis ir veidojies
                ilgstoša ūdens transporta rezultātā. Ieža graudi ir
                noapaļoti, un tā sastāvā dominē minerāls kvarcs.
            </div>
            <div :class="{green: isAnswerBCorrect, red: isAnswerBIncorrect}" class="active-area"></div>
        </div>
        <div class="column3">
            <div :class="{green: isAnswerCCorrect, red: isAnswerCIncorrect}" class="question-block">Iezis veidojies,
                uzkrājoties ļoti sīkām iežu daļiņām ūdens tilpnēs mierīgos
                apstākļos. To galvenā sastāvdaļa ir īpaša minerālu grupa – mālu minerāli.
            </div>
            <div :class="{green: isAnswerCCorrect, red: isAnswerCIncorrect}" class="active-area"></div>
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

const detectionService = new ObjectDetectionService();

const CorrectAnswerAId = 8;
const CorrectAnswerBId = 7;
const CorrectAnswerCId = 3;

const ActiveFeatures = [
    new DetectionFeature(CorrectAnswerAId, 55, 300, 300, 720),
    new DetectionFeature(CorrectAnswerBId, 390, 300, 630, 720),
    new DetectionFeature(CorrectAnswerCId, 730, 300, 970, 720)
];

const AnswerState = {
    UNKNOWN: 0,
    INCORRECT: 1,
    CORRECT: 2
};

export default {
    name: "Quiz1View",
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
                AnswerState.UNKNOWN
            ]
        };
    },
    computed: {
        isAnswerACorrect() {
            return this.answerState[0] === AnswerState.CORRECT;
        },
        isAnswerAIncorrect() {
            return this.answerState[0] === AnswerState.INCORRECT;
        },
        isAnswerBCorrect() {
            return this.answerState[1] === AnswerState.CORRECT;
        },
        isAnswerBIncorrect() {
            return this.answerState[1] === AnswerState.INCORRECT;
        },
        isAnswerCCorrect() {
            return this.answerState[2] === AnswerState.CORRECT;
        },
        isAnswerCIncorrect() {
            return this.answerState[2] === AnswerState.INCORRECT;
        },
    },
    methods: {
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

    .column1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 33.3%;
        height: 100%;
        // border: solid 1px yellow;
    }

    .column2 {
        position: absolute;
        top: 0;
        left: 33.3%;
        width: 33.3%;
        height: 100%;
        //border: solid 1px yellow;
    }

    .column3 {
        position: absolute;
        top: 0;
        left: 66.6%;
        width: 33.3%;
        height: 100%;
        //border: solid 1px yellow;
    }

    .active-area {
        position: absolute;
        top: 300px;
        left: 50px;
        right: 50px;
        bottom: 50px;
        border-radius: 80px;
        background: repeating-linear-gradient(
                45deg,
                rgba(247, 160, 22, 0.51) 0,
                rgba(255, 169, 0, 0.77) 30px,
                rgba(255, 145, 0, 0) 30px,
                rgba(255, 153, 62, 0) 60px
        );

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

    .question-block {
        position: absolute;
        top: 100px;
        left: 20px;
        right: 20px;
        height: auto;
        color: white;
        font-size: 21px;
        text-shadow: 1px 2px 2px black;

        &.green {
            color: greenyellow;
        }

        &.red {
            color: red;
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