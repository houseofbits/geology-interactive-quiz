<template>
    <div class="frame" :class="{visible: selected}">
        <div class="questions-container">
            <div v-html="title" class="text visible"></div>
            <div v-html="hint1" class="text" :class="{visible:isHint1Visible}"></div>
            <div v-html="hint2" class="text" :class="{visible:isHint2Visible}"></div>
        </div>
        <div class="show-hint-buttons-block" :class="{visible: !isCorrectAnswer}">
            <div v-if="!isHint1Visible" @click="isHint1Visible=true">Papildiespēja
                <i class="fa-solid fa-right-long"></i>
            </div>
            <div v-else-if="!isHint2Visible" @click="isHint2Visible=true">Pēdējā papildiespēja
                <i class="fa-solid fa-right-long"></i>
            </div>
        </div>

        <div class="correct-answer" :class="{visible:isCorrectAnswer && !useButtons}">
            <div class="block">{{ answerTitle }}</div>
        </div>

        <div class="detector-info-block">
            <div :class="{visible: !useButtons && !isCorrectAnswer}" class="detector-info">
                <div class="icon hand-icon-1"></div>
                <div class="text">Novieto atbilstošo klucīti sarkanajā aplī. Turi to vismaz 2 sekundes, kamēr
                    notiek atpazīšana.
                </div>
            </div>
        </div>

        <detector
            :class="{visible: !useButtons}"
            :position-x="detectorPosition"
            :position-y="480"
            :definitions="featureDefinitions"
            :disabled="isDisabled"
            :state="answerState"
            @detected="setAnswer"
            @failed="failedDetection"
        />

        <answer-modal :visible="isAnswerModalVisible" :answers="modalAnswers" @selected="selectAnswerFromModal"/>

        <div :class="{visible: useButtons}" class="answer-buttons">
            <div v-for="answerId in allAnswerIdsShuffled" class="answer-button mt-2 btn-block mx-1"
                 :class="{disabled: isAnswerButtonDisabled(answerId), incorrect: isIncorrect(answerId), correct: isCorrect(answerId)}"
                 @click="setStateManually(answerId)">
                {{ answerNames[answerId] }}
            </div>
        </div>

        <div class="container offscreen">
            <div class="row">
                <div class="col-lg-12">
                    <button v-for="answerId in Object.keys(answerNames)"
                            class="btn btn-lg btn-success mt-2 btn-block mx-1"
                            @click="setAnswer(answerId)">
                        {{ answerNames[answerId] }}
                    </button>
                </div>
            </div>
            <button class="btn btn-lg btn-success mt-2 btn-block mx-1" @click="simulateTouch(1)">Simulate touch #1
            </button>
        </div>
    </div>
</template>

<script>
import Detector from "@js/gui/components/Detector.vue";
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import Config from "@json/config.json";
import {getSimilarFeatureIds, hasSimilarFeatures} from "@js/Helpers/SimilarFeatures";
import {AnswerState} from "@js/Stuctures/Constants";
import AnswerModal from "@js/gui/components/AnswerModal.vue";
import TouchSimulatorMixin from "@js/Helpers/TouchSimulatorMixin.js";

export default {
    name: "QuizPage",
    mixins: [TouchSimulatorMixin],
    components: {AnswerModal, Detector},
    props: {
        selected: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        hint1: {
            type: String,
            required: true
        },
        hint2: {
            type: String,
            required: true
        },
        answerTitle: {
            type: String,
            required: true
        },
        correctAnswerId: {
            type: Number,
            required: true,
        },
        detectorPosition: {
            type: Number,
            required: true,
        },
        useButtons: {
            type: Boolean,
            required: true
        }
    },
    emits: ['correct', 'incorrect', 'failed-detection'],
    data() {
        return {
            answerNames: {
                1: "DELTA",
                2: "EROZIJA",
                3: "HUMĪDS KLIMATS",
                4: "ARĪDS KLIMATS",
                5: "FIZIKĀLA DĒDĒŠANA",
                6: "ĶĪMISKĀ DĒDĒŠANA",
                7: "MĀLU MINERĀLI",
                8: "DĒDĒJUMGAROZA",
            },
            answerState: null,
            //TODO: Move to parent
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions3, 15),
            isAnswerModalVisible: false,
            modalAnswers: [],
            isHint1Visible: false,
            isHint2Visible: false,
            wrongAnswerIds: [],
            isCompleted: false,
            selectedAnswerId: null,
        };
    },
    computed: {
        isCorrectAnswer() {
            return this.answerState === AnswerState.CORRECT;
        },
        isIncorrectAnswer() {
            return this.answerState === AnswerState.INCORRECT;
        },
        allAnswerIdsShuffled() {
            const ids = Object.keys(this.answerNames);
            ids.sort(function (a, b) {
                return Math.random() - 0.5;
            });
            return ids;
        },
        isDisabled() {
            return !this.selected || this.useButtons || this.isAnswerModalVisible;
        }
    },
    watch: {
        selected(value) {
            if (value === true) {
                this.answerState = null;
                this.isCompleted = false;
                this.wrongAnswerIds = [];
                this.isHint1Visible = false;
                this.isHint2Visible = false;
                this.selectedAnswerId = null;
            }
        },
    },
    methods: {
        isCorrect(answerId) {
            return this.isCorrectAnswer && answerId === this.selectedAnswerId;
        },
        isIncorrect(answerId) {
            return this.isIncorrectAnswer && answerId === this.selectedAnswerId;
        },
        selectAnswerFromModal(answerId) {
            this.isAnswerModalVisible = false;
            this.setState(answerId);
        },
        isAnswerButtonDisabled(answerId) {
            return this.selectedAnswerId !== null && answerId !== this.selectedAnswerId;
        },
        setAnswer(answerId) {
            if (this.isCompleted || this.isAnswerModalVisible) {
                return;
            }

            if (this.shouldShowModalWithAnswers(answerId)) {
                this.showModalWithAnswers(answerId);
            } else {
                this.setState(answerId);
            }
        },
        setState(answerId) {
            if (this.wrongAnswerIds.includes(answerId) || this.isCompleted) {
                return;
            }

            this.selectedAnswerId = answerId;

            this.answerState = (parseInt(answerId) === parseInt(this.correctAnswerId))
                ? AnswerState.CORRECT
                : AnswerState.INCORRECT;

            this.isCompleted = true;

            if (this.answerState === AnswerState.CORRECT) {
                this.$emit('correct');
            } else {
                this.$emit('incorrect');
            }
        },
        failedDetection() {
            this.$emit('failed-detection');
        },
        showModalWithAnswers(answerId) {
            this.modalAnswers = [];
            for (const id of getSimilarFeatureIds(answerId)) {
                this.modalAnswers.push({
                    id,
                    name: this.answerNames[id]
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
        setStateManually(answerId) {
            if (this.useButtons) {
                this.setState(answerId);
            }
        },
        simulateTouch(index) {
            if (index === 1) {
                this.toggleFeatureEvent(1, 105, 485, this.featureDefinitions);
            } else if (index === 2) {
                this.toggleFeatureEvent(1, 205, 485, this.featureDefinitions);
            } else if (index === 3) {
                this.toggleFeatureEvent(1, 305, 485, this.featureDefinitions);
            }
        }
    },
}
</script>

<style lang="scss" scoped>

.frame {
    position: absolute;
    left: 0;
    top: 0;
    width: 1024px;
    height: 768px;
    visibility: hidden;

    &.visible {
        visibility: visible;
    }

    .title {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 32px;
        line-height: 38px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        transition: all linear 50ms;
        top: 190px;

        &.inactive {
            opacity: 0.4;
            transition: all linear 500ms;
            top: 140px;
            font-size: 24px;
            line-height: 26px;
        }
    }

    .hint1 {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 32px;
        line-height: 38px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        transform: scale(0.2);
        opacity: 0.0;
        transition: all linear 50ms;
        top: 280px;

        &.active {
            opacity: 1.0;
            transform: scale(1.0);
            transition: all linear 350ms;
        }

        &.inactive {
            opacity: 0.4;
            transition: all linear 350ms;
            top: 210px;
            font-size: 24px;
            line-height: 26px;
        }
    }

    .show-hint1-button {

    }

    .hint2 {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 32px;
        line-height: 38px;
        top: 300px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        transform: scale(0.2);
        opacity: 0.0;
        transition: all linear 50ms;

        &.active {
            opacity: 1.0;
            transform: scale(1.0);
            transition: all linear 350ms;
        }

        &.inactive {
            opacity: 0.4;
            text-shadow: 0 6px 35px rgba(0, 0, 0, 0.8);
            transition: all linear 350ms;
            top: 280px;
            font-size: 24px;
            line-height: 26px;
        }
    }

    .correct-answer {
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 48px;
        font-weight: bold;
        line-height: 48px;
        top: 380px;
        padding-left: 40px;
        padding-right: 40px;
        transform: scale(0.1);
        opacity: 0.0;
        transition: all linear 50ms;
        color: white;
        display: flex;
        justify-content: center;

        & .block {
            background-color: rgb(5, 109, 0);
            border-radius: 8px;
            padding: 12px 21px;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
        }

        &.visible {
            opacity: 1.0;
            transform: scale(1.0);
            transition: all linear 350ms;
        }
    }
}

.answer-buttons {
    position: absolute;
    width: 1024px;
    height: auto;
    top: 430px;
    left: 0;
    display: flex;
    padding: 8px;
    justify-content: center;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    z-index: 40;
    padding-left: 80px;
    padding-right: 80px;
    opacity: 0;
    transition: all linear 500ms;

    &.visible {
        opacity: 1;
        transition-duration: 200ms;
    }

    & .answer-button {
        transition: all;
        transition-duration: 200ms;
        font-weight: bold;
        text-align: center;
        font-size: 24px;
        color: white;
        background-color: #606060;
        border-radius: 6px;
        padding: 12px 16px;
        margin: 8px;
        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);


        &.incorrect, &.incorrect:hover {
            background-color: #b00000;
            opacity: 1;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
        }

        &.correct, &.correct:hover {
            background-color: rgb(5, 109, 0);
            opacity: 1;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.6);
        }

        &.disabled, &.disabled:hover {
            opacity: 0.6;
            background-color: #606060;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
        }

        &:hover {
            background-color: #2d2d2d;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.4);
        }
    }
}

.offscreen {
    position: absolute;
    width: 1024px;
    height: 500px;
    top: 768px;
}

.tag {
    position: absolute;
    z-index: 10;
    opacity: 0;
    transition: all linear 500ms;

    &.visible {
        opacity: 1;
        transition-duration: 200ms;
    }
}

.questions-container {
    position: absolute;
    left: 0;
    top: 80px;
    width: 1024px;
    height: 310px;
    //border: solid 1px red;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .text {
        //border: solid 1px blue;
        display: flex;
        justify-content: center;
        text-align: center;
        font-size: 32px;
        line-height: 36px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        width: 100%;
        margin-top: 0;
        transition: all linear 400ms;
        overflow: hidden;
        height: 0;
        opacity: 0;

        &:first-child {
            margin-top: 0;
        }

        &.visible {
            height: 100px;
            //margin-top: 32px;
            opacity: 1;
        }

    }
}

.show-hint-buttons-block {
    position: absolute;
    left: 0;
    top: 330px;
    width: 1024px;
    height: 30px;
    //border: solid 1px red;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 18px;
    color: rgb(119, 170, 197);
    font-weight: bold;
    transition: all linear 200ms;
    opacity: 0;

    &.visible {
        opacity: 1;
    }

    &:hover {
        color: #418bb4;
    }
}

.detector-info-block {
    position: absolute;
    top: 360px;
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
        transition: all linear 500ms;
        opacity: 0;

        &.visible {
            opacity: 1;
        }

        & .icon {
            width: 70px;
            height: 70px;
            margin-right: 8px;
            background-size: cover;

            &.hand-icon-1 {
                background-image: url('@images/hand-icon-1.png');
            }
        }

        & .text {
            font-size: 18px;
            font-weight: normal;
        }
    }
}

</style>