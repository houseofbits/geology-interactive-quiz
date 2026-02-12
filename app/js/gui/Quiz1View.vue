<template>
    <div class="screen">
        <div class="background"></div>
        <div class="main-title">
            <span>Izvēlies pareizo iezi</span>

            <div class="reset-button" @click="reset">
                <span>No sākuma</span>
                <i class="fas fa-sync-alt"></i>
            </div>
        </div>

        <!-- <div class="detector-info-block">
            <div v-if="hasDetectionError" class="detector-info">
                <div class="icon hand-icon-2"></div>
                <div class="text">
                    Neizdevās atpazīt elementu. Mēģini vēlreiz novietojot elementu precīzi sarkanajā aplī.
                </div>
            </div>
            <div v-else class="detector-info">
                <div class="icon hand-icon-1"></div>
                <div class="text">Novieto atbilstošo klucīti sarkanajā aplī. Turi to vismaz 2 sekundes, kamēr notiek
                    atpazīšana.
                </div>
            </div>
        </div> -->

        <detector @click="clickDetector(0)" :position-x="800" :position-y="150" :definitions="featureDefinitions" :disabled="isADisabled"
                  :state="answerState[0]" @detected="(s) => this.setAnswer(0, s)" @failed="failedDetection"/>

        <detector @click="clickDetector(1)" :position-x="60" :position-y="370" :definitions="featureDefinitions" :disabled="isBDisabled"
                  :state="answerState[1]" @detected="(s) => this.setAnswer(1, s)" @failed="failedDetection"/>

        <detector @click="clickDetector(2)" :position-x="800" :position-y="550" :definitions="featureDefinitions" :disabled="isCDisabled"
                  :state="answerState[2]" @detected="(s) => this.setAnswer(2, s)" @failed="failedDetection"/>

        <div class="question-row column1" :class="{correct: isACorrect, wrong: isAIncorrect}">
            <div class="answer">OĻI</div>
            <div class="question-text">Iezis veidojies
                dēdēšanas procesā kalnu masīvu nogāzēs un kalnu upēs. Iežu
                atlūzas ir noapaļotas.
            </div>
        </div>

        <div class="question-row column2" :class="{correct: isBCorrect, wrong: isBIncorrect, disabled: isBDisabled}">
            <div class="answer">SMILŠAKMENS</div>
            <div class="question-text">Iezis ir veidojies
                ilgstoša ūdens transporta rezultātā. Ieža graudi ir
                noapaļoti, un tā sastāvā dominē minerāls kvarcs.
            </div>
        </div>

        <div class="question-row column3" :class="{correct: isCCorrect, wrong: isCIncorrect, disabled: isCDisabled}">
            <div class="answer">MĀLS</div>
            <div class="question-text">Iezis veidojies,
                uzkrājoties ļoti sīkām iežu daļiņām ūdens tilpnēs mierīgos
                apstākļos. To galvenā sastāvdaļa ir īpaša minerālu grupa – mālu minerāli.
            </div>
        </div>

        <answer-modal :visible="isAnswerModalVisible" :answers="modalAnswers" @selected="selectAnswerFromModal"/>

        <div class="container offscreen">
            <div class="row">
                <div class="col-lg-12">
                    <button v-for="answerId in Object.keys(answerNames)"
                            class="btn btn-lg btn-success mt-2 btn-block mx-1"
                            @click="setAnswer(0, answerId)">
                        {{ answerNames[answerId] }}
                    </button>
                </div>
                <div class="col-lg-12">
                    <button v-for="answerId in Object.keys(answerNames)"
                            class="btn btn-lg btn-success mt-2 btn-block mx-1"
                            @click="setAnswer(1, answerId)">
                        {{ answerNames[answerId] }}
                    </button>
                </div>
                <div class="col-lg-12">
                    <button v-for="answerId in Object.keys(answerNames)"
                            class="btn btn-lg btn-success mt-2 btn-block mx-1"
                            @click="setAnswer(2, answerId)">
                        {{ answerNames[answerId] }}
                    </button>
                </div>
            </div>
<!--            <button class="btn btn-lg btn-success mt-2 btn-block mx-1" @click="simulateTouch(1)">Simulate touch #1-->
<!--            </button>-->
<!--            <button class="btn btn-lg btn-success mt-2 btn-block mx-1" @click="simulateTouch(2)">Simulate touch #2-->
<!--            </button>-->
<!--            <button class="btn btn-lg btn-success mt-2 btn-block mx-1" @click="simulateTouch(3)">Simulate touch #3-->
<!--            </button>-->
        </div>

    </div>
</template>

<script>

import {AnswerState} from "@js/Stuctures/Constants.js";
import Config from "@json/config.json";
import Detector from "@js/gui/components/Detector.vue";
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import AnswerModal from "@js/gui/components/AnswerModal.vue";
import {getSimilarFeatureIds, hasSimilarFeatures} from "@js/Helpers/SimilarFeatures";
import TouchSimulatorMixin from "@js/Helpers/TouchSimulatorMixin.js";
import InactivityWatcher from "@js/Services/InactivityWatcher.js";

export default {
    name: "Quiz1View",
    mixins: [TouchSimulatorMixin],
    components: {
        AnswerModal,
        Detector
    },
    data() {
        return {
            AnswerState: AnswerState,
            answerState: [
                null,
                null,
                null
            ],
            resetTimeout: null,
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions1, 15),
            hasDetectionError: false,
            detectionErrorTimeout: null,
            isAnswerModalVisible: false,
            modalAnswers: [],
            answerNames: {
                6: "MĀLS",
                5: "ŠĶEMBAS",
                2: "SMILŠAKMENS",
                3: "GRANTS",
                4: "OĻI",
                8: "ZVIRGZDI",
            },
        };
    },
    computed: {
        isACorrect() {
            return this.answerState[0] === AnswerState.CORRECT;
        },
        isAIncorrect() {
            return this.answerState[0] === AnswerState.INCORRECT;
        },
        isBCorrect() {
            return this.answerState[1] === AnswerState.CORRECT;
        },
        isBIncorrect() {
            return this.answerState[1] === AnswerState.INCORRECT;
        },
        isCCorrect() {
            return this.answerState[2] === AnswerState.CORRECT;
        },
        isCIncorrect() {
            return this.answerState[2] === AnswerState.INCORRECT;
        },
        isAActive() {
            return this.answerState[0] === null;
        },
        isBActive() {
            return this.answerState[1] === null;
        },
        isCActive() {
            return this.answerState[2] === null;
        },
        isADisabled() {
            return this.isAnswerModalVisible;
        },
        isBDisabled() {
            if (this.isAnswerModalVisible) {
                return true;
            }

            return this.isAActive;
        },
        isCDisabled() {
            if (this.isAnswerModalVisible) {
                return true;
            }

            return this.isBActive;
        }
    },
    methods: {
        clickDetector(which) {
            console.log("clickDetector", which);
            if (this.isAnswerModalVisible) {
                return;
            }

            if (this.answerState[which] === null) {
                this.showModalWithAnswers(0, which);
            }
        },
        getCorrectAnswer(which) {
            return Config.quiz1.correct[which];
        },
        reset() {
            this.$router.go();
        },
        updateResetTimer() {
            clearTimeout(this.resetTimeout);
            this.resetTimeout = setTimeout(this.reset, 60000);
        },
        setAnswer(which, answerId) {
            if (this.isAnswerModalVisible) {
                return;
            }

            if (this.answerState[which] === null) {
                if (this.shouldShowModalWithAnswers(answerId, which)) {
                    this.showModalWithAnswers(answerId, which);
                } else {
                    this.setState(which, answerId);
                }
            }
        },
        setState(which, answerId) {
            const state = parseInt(answerId) === this.getCorrectAnswer(which) ? AnswerState.CORRECT : AnswerState.INCORRECT;
            this.$set(this.answerState, which, state);
        },
        failedDetection() {
            this.hasDetectionError = true;
            clearTimeout(this.detectionErrorTimeout);
            this.detectionErrorTimeout = setTimeout(() => this.hasDetectionError = false, 5000);
        },
        showModalWithAnswers(answerId, which) {
            this.modalAnswers = [];
            for (const answerId  of Object.keys(this.answerNames)) {
                this.modalAnswers.push({
                    id: answerId,
                    name: this.answerNames[answerId]
                });
            }
            this.modalAnswers.sort(function (a, b) {
                return Math.random() - 0.5;
            });

            this.isAnswerModalVisible = true;
        },
        shouldShowModalWithAnswers(answerId) {
            return hasSimilarFeatures(answerId);
        },
        selectAnswerFromModal(answerId) {
            if (this.isAActive) {
                console.log(answerId);
                this.setState(0, answerId);
            } else if (this.isBActive) {
                this.setState(1, answerId);
            } else if (this.isCActive) {
                this.setState(2, answerId);
            }
            this.isAnswerModalVisible = false;
        },
        simulateTouch(index) {
            if (index === 1) {
                this.toggleFeatureEvent(1, 805, 155, this.featureDefinitions);
            } else if (index === 2) {
                this.toggleFeatureEvent(1, 65, 375, this.featureDefinitions);
            } else if (index === 3) {
                this.toggleFeatureEvent(1, 805, 555, this.featureDefinitions);
            }
        }
    },
    mounted() {
        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        InactivityWatcher.registerInputHandlers();
        InactivityWatcher.setCallback(this.reset);
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
    background: white;

    .offscreen {
        position: absolute;
        width: 1024px;
        height: 500px;
        top: 768px;
    }

    .background {
        top: 60px;
        left: 0;
        position: absolute;
        width: 1024px;
        height: 768px;
        background-image: url('@images/q1-bg1.png');
        opacity: 0.7;
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

    .answer {
        position: absolute;
        top: -45px;
        font-size: 30px;
        font-weight: bold;
        text-shadow: 0 6px 20px rgba(0, 0, 0, 1);
        color: white;
        display: block;
        transition: all linear 1000ms;
        opacity: 0;
    }

    .question-row {
        display: flex;
        align-items: center;
        position: absolute;
        background-color: rgba(255, 255, 255, 1);
        transition: all linear 500ms;
    }

    .column1 {
        top: 180px;
        left: 0;
        width: 750px;
        height: 100px;
        padding-left: 20px;

        .answer {
            right: 0;
            background-color: rgba(57, 130, 53, 0.68);
            padding-left: 20px;
            padding-right: 20px;
        }

        &.correct .answer {
            opacity: 1;
        }
    }

    .column2 {
        top: 380px;
        right: 0;
        width: 750px;
        height: 120px;
        padding-right: 20px;
        opacity: 1;

        &.disabled {
            opacity: 0.7;
        }

        .answer {
            left: 0;
            background-color: rgba(57, 130, 53, 0.68);
            padding-left: 20px;
            padding-right: 20px;
        }

        &.correct .answer {
            opacity: 1;
        }
    }

    .column3 {
        top: 580px;
        left: 0;
        width: 750px;
        height: 125px;
        padding-left: 20px;
        opacity: 1;

        &.disabled {
            opacity: 0.7;
        }

        .answer {
            right: 0;
            background-color: rgba(57, 130, 53, 0.68);
            padding-left: 20px;
            padding-right: 20px;
        }

        &.correct .answer {
            opacity: 1;
        }
    }

    .correct {
        background: linear-gradient(to bottom, rgba(57, 130, 53, 0.68) 0%, rgba(158, 221, 0, 0.56) 100%);
        transform: scale(1.05);
        transition: all linear 500ms;

        .question-text {
            color: white;
            text-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
        }
    }

    .wrong {
        background: linear-gradient(to bottom, rgba(211, 4, 4, 0.64) 0%, rgba(255, 48, 25, 0.65) 100%);
        transform: scale(1.05);
        transition: all linear 500ms;

        .question-text {
            color: white;
            text-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
        }
    }

    .reset-button {
        position: absolute;
        right: 20px;
        top: 20px;
        width: auto;
        height: 32px;
        z-index: 50;
        display: flex;
        align-items: center;
        color: rgb(119, 170, 197);
        transition: all linear 200ms;

        i {
            font-size: 32px;
            color: rgb(119, 170, 197);
            transition: all linear 200ms;
        }

        span {
            font-size: 18px;
            margin-right: 8px;
        }

        &:hover {
            color: #418bb4;

            i {
                color: #418bb4;
            }
        }
    }

    .question-text {
        margin: 10px;
        color: #414141;
        font-size: 28px;
        line-height: 32px;
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

</style>