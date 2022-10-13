<template>
    <div class="view">
        <quiz-page
            v-for="(n, index) in 8"
            :key="'page'+index"
            :selected="index===selectedQuestion"
            :title="text[index].title"
            :hint1="text[index].hint1"
            :hint2="text[index].hint2"
            :class="pageClass(index)"
            :answer-title="text[index].answer"
            :correct-answer-id="getCorrectAnswerId(index)"
            :detector-position="detectorPositions[index]"
            :use-buttons="useButtons"
            @correct="selectedCorrectAnswer"
            @incorrect="selectedWrongAnswer"
            @failed-detection="failedDetection"
        />

        <quiz3-final-page :selected="selectedQuestion===8" :page-answers="pageAnswers" :class="pageClass(8)"/>

        <quiz3-navigator :items="pageAnswers" :selected="selectedQuestion"/>

        <div class="main-title">
            <div>
                <span v-if="selectedQuestion!==8">Pievieno pareizo nosaukumu</span>
            </div>

            <div class="main-buttons-block">
                <div class="variants-button" @click="useButtons=!useButtons">
                    {{ useButtons ? 'Izmantot elementus' : 'Atbilžu varianti'}}
                </div>
                <div class="reset-button" @click="reset">
                    <span>No sākuma</span>
                    <i class="fas fa-sync-alt"></i>
                </div>
            </div>
        </div>
        <div v-if="selectedQuestion!==8 && !useButtons" class="detector-info-block">
            <div v-if="hasDetectionError" class="detector-info">
                <div class="icon hand-icon-2"></div>
                <div class="text">
                    Neizdevās atpazīt elementu. Mēģini vēlreiz novietojot elementu precīzi sarkanajā aplī.
                </div>
            </div>
            <div v-else class="detector-info">
                <div class="icon hand-icon-1"></div>
                <div class="text">Novieto atbilstošo elementu sarkanajā aplī. Turi to vismaz 2 sekundes, kamēr
                    notiek
                    atpazīšana.
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import ElementTag from "./components/ElementTag.vue";
import QuizPage from "@js/gui/QuizPage.vue";
import Quiz3Navigator from '@js/gui/components/Quiz3Navigator.vue';
import TextLV from "@json/quiz3-text-lv.json";
import Quiz3FinalPage from "@js/gui/components/Quiz3FinalPage.vue";
import ObjectRecognitionServiceInstance from '@js/Services/ObjectRecongnitionService.js';
import {AnswerState} from "@js/Stuctures/Constants.js";
import Config from "@json/config.json";
import Detector from "@js/gui/components/Detector.vue";
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import AnswerModal from "@js/gui/components/AnswerModal.vue";
import {getSimilarFeatureIds, hasSimilarFeatures} from "@js/Helpers/SimilarFeatures";

export default {
    name: "Quiz3View",
    components: {
        AnswerModal,
        Quiz3FinalPage,
        QuizPage,
        Quiz3Navigator,
        ElementTag,
        Detector
    },
    data() {
        return {
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions3, 15),
            selectedQuestion: 0,
            pageAnswers: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ],
            detectorPositions: [
                100,
                200,
                300,
                400,
                500,
                600,
                700,
                800,
            ],
            isFinalViewVisible: false,
            resetTimeout: null,
            hasDetectionError: false,
            detectionErrorTimeout: null,
            useButtons: false,
        };
    },
    computed: {
        text() {
            return TextLV;
        },
        correctAnswer() {
            return Config.quiz3.correctAnswerIds[this.selectedQuestion];
        }
    },
    methods: {
        getCorrectAnswerId(index) {
            return Config.quiz3.correctAnswerIds[index];
        },
        selectedCorrectAnswer() {
            this.setQuestionState(AnswerState.CORRECT);
            setTimeout(this.continueNext, 1000);
        },
        selectedWrongAnswer() {
            this.setQuestionState(AnswerState.INCORRECT);
            setTimeout(this.continueNext, 500);
        },
        pageClass(i) {
            if (i < this.selectedQuestion) {
                return 'page-out';
            }
            if (i === this.selectedQuestion) {
                return 'page-active';
            }
            if (i > this.selectedQuestion) {
                return 'page-in';
            }
        },
        reset() {
            this.selectedQuestion = 0;
            this.initPage();
        },
        initPage() {
            this.updateResetTimer();
            if (this.selectedQuestion === 0) {
                this.pageAnswers = [
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN,
                    AnswerState.UNKNOWN
                ];
            }

            this.pageAnswers[this.selectedQuestion] = AnswerState.CURRENT;
        },
        continueNext() {
            this.updateResetTimer();
            if (this.selectedQuestion + 1 === 8) {
                this.isFinalViewVisible = true;
                this.selectedQuestion = 8;
                return;
            }
            this.selectedQuestion = (this.selectedQuestion + 1) % 8;
            this.initPage();
        },
        setQuestionState(state) {
            this.$set(this.pageAnswers, this.selectedQuestion, state);
        },
        updateResetTimer() {
            clearTimeout(this.resetTimeout);
            this.resetTimeout = setTimeout(this.reset, 60000);
        },
        failedDetection() {
            this.updateResetTimer();
            this.hasDetectionError = true;
            clearTimeout(this.detectionErrorTimeout);
            this.detectionErrorTimeout = setTimeout(() => this.hasDetectionError = false, 3000);
        },
    },
    mounted() {

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        this.initPage();
    }
}
</script>

<style lang="scss" scoped>

.view {
    position: absolute;
    width: 1024px;
    height: 768px;
    //overflow: hidden;
    //background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);
    background: white;

    .offscreen {
        position: absolute;
        width: 1024px;
        height: 500px;
        top: 768px;
    }

    .test-buttons-overlay {
        position: absolute;
        z-index: 100;
    }

    .main-title {
        color: gray;
        position: absolute;
        font-weight: bold;
        width: 1024px;
        left: 0;
        height: 65px;
        text-align: center;
        font-size: 38px;
        background-color: white;
        color: #606060;
        transition: all linear 500ms;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 16px;
        padding-right: 16px;
        border-bottom: 1px solid lightgray;
    }

    .detector-info-block {
        position: absolute;
        top: 35px;
        width: 100%;
        height: auto;

        & .detector-info {
            display: flex;
            align-content: flex-end;
            justify-content: center;
            flex-direction: row;
            align-items: center;
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
    }

    .main-buttons-block {
        display: flex;

        .variants-button {
            font-size: 18px;
            margin-right: 36px;
            display: flex;
            align-items: center;

            &:hover {
                color: #2d2d2d;

                i {
                    color: #2d2d2d;
                }
            }
        }

        .reset-button {
            width: auto;
            height: 32px;
            z-index: 50;
            display: flex;
            align-items: center;

            i {
                font-size: 32px;
                color: #606060;
            }

            span {
                font-size: 18px;
                margin-right: 8px;
            }

            &:hover {
                color: #2d2d2d;

                i {
                    color: #2d2d2d;
                }
            }
        }
    }

    .page-out {
        left: -1024px;
        transition: all ease-in 500ms;
    }

    .page-active {
        left: 0;
        transition: all linear 500ms;
    }

    .page-in {
        left: 1024px;
        transition: all ease-out 500ms;
    }

    .overview-row {
        position: absolute;
        width: 1024px;
        height: 150px;
        left: 0;
        bottom: 0;
        text-align: center;

        .item {
            display: inline-block;
            line-height: 100px;
            text-align: center;
            vertical-align: middle;
            height: 100px;
            width: 100px;
            background-color: gray;
            margin-top: 10px;
            margin-left: 5px;
            margin-right: 5px;
            color: white;
            font-size: 22px;
            overflow: hidden;
            border-radius: 30px;

            &.selected {
                border: solid 3px yellow;
            }

            &.correct {
                background-color: green;
            }

            &.incorrect {
                background-color: red;
            }
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
    opacity: 0;
    transition: all linear 500ms;

    &.visible {
        opacity: 1;
    }

    @for $i from 0 through 7 {
        &[data-index="#{$i}"] {
            bottom: 180px;
            left: 87px + $i * 100px;
        }
    }
}

</style>