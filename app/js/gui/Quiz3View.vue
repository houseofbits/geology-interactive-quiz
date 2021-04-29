<template>
    <div class="view">

        <div class="reset-button" @click="reset">
            <i class="fas fa-sync-alt"></i>
        </div>

        <div class="container m-0 p-0 test-buttons-overlay">
            <div class="row debug m-0 p-0 pt-2 pl-2">
                <button class="btn btn-sm btn-success m-1" type="button" @click="selectedCorrectAnswer">Rigth answer
                </button>
                <button class="btn btn-sm btn-danger m-1" type="button" @click="selectedWrongAnswer">Wrong answer
                </button>
            </div>
        </div>

        <quiz-page
            v-for="(n, index) in 8" :key="index"
            :finished="isPageFinished"
            :selected="index===selectedQuestion"
            :title="text[index].title"
            :hint1="text[index].hint1"
            :hint2="text[index].hint2"
            :is-correct-answer="isCorrectAnswer"
            :number-of-errors="numberOfIncorrectAnswers"
            :class="pageClass(index)"
        />

        <quiz3-final-page :selected="selectedQuestion===8" :page-answers="pageAnswers" :class="pageClass(8)"/>

        <div v-for="(object, index) in detectedObjects">
            <div :class="['color-'+object.id]" :style="objectPointTransform(object)"
                 class="object-element">{{ object.id }}
            </div>
        </div>

        <quiz3-navigator :items="pageAnswers" :selected="selectedQuestion"/>

        <div class="main-title" :class="{visible:!isFinalViewVisible}">Pievieno pareizo nosaukumu</div>

    </div>
</template>

<script>

import TouchPoint from "@js/Stuctures/TouchPoint";
import ObjectDetectionService from '@js/Services/ObjectDetectionService';
import DetectionFeature from "@js/Stuctures/DetectionFeature";
import QuizPage from "@js/gui/QuizPage.vue";
import Quiz3Navigator from '@js/gui/components/Quiz3Navigator.vue';
import TextLV from "@json/quiz3-text-lv.json";
import Quiz3FinalPage from "@js/gui/components/Quiz3FinalPage.vue";

const detectionService = new ObjectDetectionService();

const ActiveFeatures = [
    new DetectionFeature(1, 100, 400, 920, 720),
    new DetectionFeature(2, 100, 400, 920, 720),
    new DetectionFeature(3, 100, 400, 920, 720),
    new DetectionFeature(4, 100, 400, 920, 720),
    new DetectionFeature(5, 100, 400, 920, 720),
    new DetectionFeature(6, 100, 400, 920, 720),
    new DetectionFeature(7, 100, 400, 920, 720),
    new DetectionFeature(8, 100, 400, 920, 720)
];

const AnswerState = {
    UNKNOWN: 0,
    CURRENT: 1,
    INCORRECT: 2,
    CORRECT: 3
};

export default {
    name: "Quiz3View",
    components: {
        Quiz3FinalPage,
        QuizPage,
        Quiz3Navigator
    },
    data() {
        return {
            isDisabled: true,
            touches: [],
            detectedObjects: [],
            objectDefinitionsArray: [],
            detectorLoopIntervalId: null,
            time: 0,
            selectedQuestion: 0,
            isCorrectAnswer: false,
            numberOfIncorrectAnswers: 0,
            answerId: null,
            wrongAnswers: [],
            isPageFinished: false,
            pageAnswers: [
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN,
                AnswerState.UNKNOWN
            ],
            isFinalViewVisible: false,
            resetTimeout: null
        };
    },
    watch: {
        answerId(id) {
            if (id === null) {
                return;
            }
            const featureId = ActiveFeatures[this.selectedQuestion].id;
            if (id === featureId) {
                this.selectedCorrectAnswer();
            } else {
                if (!this.wrongAnswers.includes(id)) {
                    this.selectedWrongAnswer();
                    this.wrongAnswers.push(id);
                }
            }
        }
    },
    computed: {
        isAnswerCorrect() {
            const featureId = ActiveFeatures[this.selectedQuestion].id;
            return this.answerId === featureId;
        },
        isAnswerIncorrect() {
            if (this.answerId === null) {
                return false;
            }
            const featureId = ActiveFeatures[this.selectedQuestion].id;
            return this.answerId !== featureId;
        },
        text() {
            return TextLV;
        }
    },
    methods: {
        selectedCorrectAnswer() {
            this.isCorrectAnswer = true;
            this.continueNextDelayed();
        },
        selectedWrongAnswer() {
            this.numberOfIncorrectAnswers++;
            if (this.numberOfIncorrectAnswers > 2) {
                this.continueNextDelayed();
            }
        },
        iconClass(state, index) {
            const classes = [];
            if (this.selectedQuestion === index) {
                classes.push('selected');
            }
            if (state === AnswerState.CORRECT) {
                classes.push('correct');
            }
            if (state === AnswerState.INCORRECT) {
                classes.push('incorrect');
            }
            return classes;
        },
        iconText(state, index) {
            if (state === AnswerState.CORRECT) {
                return this.text[index].answer;
            }
            if (index < this.selectedQuestion) {
                return '?';
            }
            return '';
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
        objectPointTransform(detectedPosition) {
            return 'transform:translate(' + detectedPosition.x + 'px,' + detectedPosition.y + 'px)';
        },
        detectSmart() {
            if (!this.isDisabled) {
                this.detectedObjects = detectionService.detectObjects(this.time, this.touches, this.objectDefinitionsArray, this.detectedObjects);
                this.checkForAnswer();
            }
        },
        runDetectionLoop() {
            this.detectorLoopIntervalId = setInterval(() => {
                this.detectSmart();
                this.time += 16;
            }, 16);
        },
        checkForAnswer() {

            let answerId = null;

            if (this.detectedObjects.length > 0) {

                const feature = ActiveFeatures[this.selectedQuestion];
                let featureResults = detectionService.matchDetectedWithFeature(this.detectedObjects, feature);
                if (featureResults.length > 0) {
                    for (const result of featureResults) {
                        answerId = result.id;
                    }
                }
            }
            this.answerId = answerId;
        },
        reset() {
            this.selectedQuestion = 0;
            this.initPage();
        },
        initPage() {
            this.isCorrectAnswer = false;
            this.numberOfIncorrectAnswers = 0;
            this.isPageFinished = false;
            this.wrongAnswers = [];
            this.detectedObjects = [];
            this.touches = [];
            if (this.selectedQuestion === 0) {
                this.isFinalViewVisible = false;
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
            this.setQuestionState(AnswerState.CURRENT);
            this.isDisabled = false;
        },
        continueNextDelayed() {
            this.isDisabled = true;
            this.isPageFinished = true;
            if (this.isCorrectAnswer) {
                this.setQuestionState(AnswerState.CORRECT);
            } else {
                this.setQuestionState(AnswerState.INCORRECT);
            }
            setTimeout(this.continueNext, 1000);
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
        }
    },
    mounted() {
        document.addEventListener('touchstart', function (event) {
            //this.touches = [];
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
            this.updateResetTimer();
        }.bind(this), false);

        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        this.objectDefinitionsArray = detectionService.getObjectDefinitions();

        this.runDetectionLoop();

        this.initPage();

    }
}
</script>

<style lang="scss" scoped>

.view {
    position: absolute;
    width: 1024px;
    height: 768px;
    overflow: hidden;
    background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);

    .test-buttons-overlay {
        position: absolute;
        z-index: 100;
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
        opacity: 0.0;
        transform: scale(0.2);
        transition: all linear 500ms;

        &.visible {
            opacity: 1.0;
            transform: scale(1.0);
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

    .page-out {
        left: -1024px;
        transition: all linear 500ms;
    }

    .page-active {
        left: 0;
        transition: all linear 500ms;
    }

    .page-in {
        left: 1024px;
        transition: all linear 500ms;
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
</style>