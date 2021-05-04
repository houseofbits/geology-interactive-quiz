<template>
    <div class="screen">
        <div class="background"></div>
        <span class="main-title">Izvēlies pareizo iezi</span>

        <div class="reset-button">
            <i class="fas fa-sync-alt" @click="reset"></i>
        </div>

        <element-tag class="tag tag-1"/>
        <element-tag class="tag tag-2"/>
        <element-tag class="tag tag-3"/>

        <div class="column1" :class="{correct: isAnswerACorrect, wrong: isAnswerAIncorrect}">
            <div class="question-text">Iezis veidojies
                dēdēšanas procesā kalnu masīvu nogāzēs un kalnu upēs. Iežu
                atlūzas ir noapaļotas.
            </div>
        </div>

        <div class="column2" :class="{correct: isAnswerBCorrect, wrong: isAnswerBIncorrect}">
            <div class="question-text">Iezis ir veidojies
                ilgstoša ūdens transporta rezultātā. Ieža graudi ir
                noapaļoti, un tā sastāvā dominē minerāls kvarcs.
            </div>
        </div>

        <div class="column3" :class="{correct: isAnswerCCorrect, wrong: isAnswerCIncorrect}">
            <div class="question-text">Iezis veidojies,
                uzkrājoties ļoti sīkām iežu daļiņām ūdens tilpnēs mierīgos
                apstākļos. To galvenā sastāvdaļa ir īpaša minerālu grupa – mālu minerāli.
            </div>
        </div>

    </div>
</template>

<script>

import ObjectDetectionService from '@js/Services/ObjectDetectionService';
import DetectionFeature from "@js/Stuctures/DetectionFeature";
import ElementTag from "./components/ElementTag.vue";
import ObjectRecognitionServiceInstance from '@js/Services/ObjectRecongnitionService.js';
const detectionService = new ObjectDetectionService();

const CorrectAnswerAId = 8;
const CorrectAnswerBId = 7;
const CorrectAnswerCId = 2;

const AnswerState = {
    UNKNOWN: 0,
    INCORRECT: 1,
    CORRECT: 2
};

export default {
    name: "Quiz1View",
    components: {
        ElementTag
    },
    data() {
        return {
            answerState: [
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN
            ],
            resetTimeout: null
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
        reset() {
            this.$set(this.answerState, 0, AnswerState.UNKNOWN);
            this.$set(this.answerState, 1, AnswerState.UNKNOWN);
            this.$set(this.answerState, 2, AnswerState.UNKNOWN);
            ObjectRecognitionServiceInstance.resetDetector();
        },
        updateResetTimer() {
            clearTimeout(this.resetTimeout);
            this.resetTimeout = setTimeout(this.reset, 60000);
        },

        //TODO Check for result age
        checkAnswer(result) {
            if (result.regionId === 1) {
                this.$set(this.answerState,
                    0,
                    (result.id === CorrectAnswerAId) ? AnswerState.CORRECT : AnswerState.INCORRECT
                );
            }
            if (result.regionId === 2) {
                this.$set(this.answerState,
                    1,
                    (result.id === CorrectAnswerBId) ? AnswerState.CORRECT : AnswerState.INCORRECT
                );
            }
            if (result.regionId === 3) {
                this.$set(this.answerState,
                    2,
                    (result.id === CorrectAnswerCId) ? AnswerState.CORRECT : AnswerState.INCORRECT
                );
            }
            this.updateResetTimer();
        },

        onNewObjectDetected(result) {
            this.checkAnswer(result);
        },
        onObjectRemoved(result) {   },
        onObjectUpdated(result) {   }
    },
    mounted() {

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(1, 680, 90, 1000, 300));
        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(2, 15, 300, 330, 510));
        ObjectRecognitionServiceInstance.addRegion(new DetectionFeature(3, 680, 500, 1000, 720));

        ObjectRecognitionServiceInstance.detectedHandler = this.onObjectUpdated;
        ObjectRecognitionServiceInstance.detectedNewHandler = this.onNewObjectDetected;
        ObjectRecognitionServiceInstance.detectedLostHandler = this.onObjectRemoved;

        ObjectRecognitionServiceInstance.runDetectionLoop();

    }
}
</script>

<style lang="scss" scoped>

.screen {
    top: 0;
    left: 0;
    position: absolute;
    width: 1024px;
    height: 768px;
    background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);

    .background {
        top: 0;
        left: 0;
        position: absolute;
        width: 1024px;
        height: 768px;
        background-image: url('@images/q1-bg1.png');
    }

    .main-title {
        display: inline-block;
        color: gray;
        position: absolute;
        width: 1024px;
        left: 0;
        height: 80px;
        text-align: center;
        font-size: 50px;
        line-height: 80px;
        text-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        background: linear-gradient(to bottom, rgba(255, 183, 107, 1) 0%, rgba(255, 167, 61, 1) 55%, rgba(255, 124, 0, 1) 87%, rgba(255, 127, 4, 1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .column1 {
        position: absolute;
        top: 140px;
        left: 0;
        width: 650px;
        height: 120px;
        background-color: rgba(255,255,255,0.5);
        padding-left: 20px;
    }

    .column2 {
        position: absolute;
        top: 360px;
        right: 0;
        width: 650px;
        height: 120px;
        background-color: rgba(255,255,255,0.5);
        padding-right: 20px;
    }

    .column3 {
        position: absolute;
        top: 580px;
        left: 0;
        width: 650px;
        height: 135px;
        background-color: rgba(255,255,255,0.5);
        padding-left: 20px;
    }

    .correct {
        background: linear-gradient(to bottom, rgba(57,130,53,0.68) 0%,rgba(158,221,0,0.56) 100%);
        transform: scale(1.05);
        transition: all linear 500ms;

        .question-text {
            color: white;
            text-shadow: 0 6px 20px rgba(0,0,0,0.7);
        }
    }

    .wrong {
        background: linear-gradient(to bottom, rgba(211,4,4,0.64) 0%,rgba(255,48,25,0.65) 100%);
        transform: scale(1.05);
        transition: all linear 500ms;

        .question-text {
            color: white;
            text-shadow: 0 6px 20px rgba(0,0,0,0.7);
        }
    }

    .reset-button {
        position: absolute;
        right: 10px;
        top: 20px;
        width: 60px;
        height: 60px;
        z-index: 50;

        i {
            font-size: 50px;
            color: gray;
        }
    }

    .question-text {
        margin: 10px;
        color: #414141;
        font-size: 28px;
        line-height: 28px;
        text-shadow: 0 6px 20px rgba(0,0,0,0.4);
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
    transition: all linear 500ms;

    &.tag-1 {
        top: 130px;
        right: 60px;
    }

    &.tag-2 {
        top: 340px;
        left: 60px;
    }

    &.tag-3 {
        top: 550px;
        right: 60px;
    }
}

//.line {
//    background-color: rgba(255,255,255,0.5);
//    position: absolute;
//    height: 3px;
//
//    &.line-1 {
//        width: 164px;
//        top: 205px;
//        right: 210px;
//    }
//
//    &.line-2 {
//        width: 164px;
//        top: 415px;
//        left: 210px;
//    }
//
//    &.line-3 {
//        width: 164px;
//        top: 625px;
//        right: 210px;
//    }
//}


</style>