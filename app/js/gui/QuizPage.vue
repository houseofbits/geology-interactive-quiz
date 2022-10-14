<template>
    <div class="frame" :class="{visible: selected}">
        <span class="title" :class="{inactive: isHint1Visible}" v-html="title"></span>
        <div
            class="hint1"
            :class="{active: isHint1Visible, inactive: isHint2Visible || (isHint1Visible && isCorrectAnswer)}"
            v-html="hint1"
        >
        </div>
        <div
            class="hint2"
            :class="{active: isHint2Visible, inactive: isHint2Visible && isCorrectAnswer}"
            v-html="hint2"
        >
        </div>

        <div class="correct-answer" :class="{visible:isCorrectAnswer}">
            <div class="block">{{ answerTitle }}</div>
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
                 :class="{incorrect: wrongAnswerIds.includes(answerId)}"
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

export default {
    name: "QuizPage",
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
            isDisabled: true,
            wrongAnswerIds: [],
            isCompleted: false,
        };
    },
    computed: {
        isCorrectAnswer() {
            return this.answerState === AnswerState.CORRECT;
        },
        allAnswerIdsShuffled() {
            const ids = Object.keys(this.answerNames);
            ids.sort(function (a, b) {
                return Math.random() - 0.5;
            });
            return ids;
        }
    },
    watch: {
        selected(value) {
            this.answerState = null;
            if (value === true) {
                this.isDisabled = !value;
                this.isCompleted = false;
                this.wrongAnswerIds = [];
                this.isHint1Visible = false;
                this.isHint2Visible = false;
            }
            if (value && this.useButtons) {
                this.isDisabled = true;
            }
        },
        useButtons(val) {
            if (this.selected) {
                this.isDisabled = val;
            }
        }
    },
    methods: {
        selectAnswerFromModal(answerId) {
            this.isAnswerModalVisible = false;
            this.setState(answerId);
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

            this.answerState = (parseInt(answerId) === parseInt(this.correctAnswerId))
                ? AnswerState.CORRECT
                : AnswerState.INCORRECT;

            if (this.answerState === AnswerState.CORRECT) {
                this.isCompleted = true;
                this.$emit('correct');
            } else {
                this.checkAnswerHints();
                this.wrongAnswerIds.push(answerId);
            }
        },
        checkAnswerHints() {
            const timeout = this.useButtons ? 0 : 1500;
            if (this.isHint1Visible) {
                if (this.isHint2Visible) {
                    setTimeout(this.finishIncorrect.bind(this), timeout);
                } else {
                    setTimeout(this.showHint2.bind(this), timeout);
                }
            } else {
                setTimeout(this.showHint1.bind(this), timeout);
            }
        },
        showHint1() {
            this.isHint1Visible = true;
            this.answerState = null;
        },
        showHint2() {
            this.isHint2Visible = true;
            this.answerState = null;
        },
        finishIncorrect() {
            this.isCompleted = true;
            this.$emit('incorrect');
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
        }
    },
    mounted() {
        this.isDisabled = !this.selected;
    }
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
        top: 340px;
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
            opacity: 0.7;
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

</style>