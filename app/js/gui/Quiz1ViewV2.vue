<template>
    <div class="screen">
        <div class="background"></div>
        <div class="main-title">
            <span>Izvēlies pareizo iezi</span>

            <div v-if="hasDetectionError" class="detector-info">
                <div class="icon hand-icon-2"></div>
                <div class="text">
                    Neizdevās atpazīt elementu. Mēģini vēlreiz novietojot elementu precīzi sarkanajā aplī.
                </div>
            </div>
            <div v-else class="detector-info">
                <div class="icon hand-icon-1"></div>
                <div class="text">Novieto atbilstošo elementu sarkanajā aplī. Turi to vismaz 2 sekundes, kamēr notiek
                    atpazīšana.
                </div>
            </div>


        </div>

        <div class="reset-button" @click="reset">
            <span>No sākuma</span>
            <i class="fas fa-sync-alt"></i>
        </div>

        <div class="continue-button" @click="nextQuestion">
            <span>Turpināt</span>
            <i class="fa-solid fa-arrow-right"></i>
        </div>

        <detector :position-x="50" :position-y="50" :definitions="featureDefinitions" :correct-answer="answer"
                  :state="state" @detected="setState" @failed="failedDetection"/>

        <div class="question-row" :class="{correct: isCorrect, wrong: isIncorrect}">
            <div class="answer">{{ title }}</div>
            <div class="question-text">{{ text }}</div>
        </div>

        <div class="container offscreen">
            <div class="row">
                <div class="col-lg-6 text-center">
                    <button class="btn btn-lg btn-success mt-2 btn-block" @click="setState(AnswerState.CORRECT)">
                        Correct
                    </button>
                    <button class="btn btn-lg btn-danger mt-2 btn-block" @click="setState(AnswerState.INCORRECT)">
                        Wrong
                    </button>
                    <button class="btn btn-lg btn-primary mt-2 btn-block" @click="nextQuestion">Next</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import {AnswerState} from "@js/Stuctures/Constants.js";
import Config from "@json/config.json";
import Detector from "@js/gui/components/Detector.vue";
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";

export default {
    name: "Quiz1ViewV2",
    components: {
        Detector
    },
    data() {
        return {
            AnswerState: AnswerState,
            resetTimeout: null,
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions1, 15),
            hasDetectionError: false,
            detectionErrorTimeout: null,

            isCorrect: false,
            isIncorrect: false,
            selectedQuestion: 0,
            state: null,
            questions: [
                {
                    answer: 4,
                    title: "OĻI",
                    text: "Iezis veidojies dēdēšanas procesā kalnu masīvu nogāzēs un kalnu upēs. Iežu atlūzas ir noapaļotas.",
                    state: null,
                },
                {
                    answer: 2,
                    title: "SMILŠAKMENS",
                    text: "Iezis ir veidojies ilgstoša ūdens transporta rezultātā. Ieža graudi ir noapaļoti, un tā sastāvā dominē minerāls kvarcs. ",
                    state: null,
                },
                {
                    answer: 6,
                    title: "MĀLS",
                    text: "Iezis veidojies, uzkrājoties ļoti sīkām iežu daļiņām ūdens tilpnēs mierīgos apstākļos. To galvenā sastāvdaļa ir īpaša minerālu grupa – mālu minerāli.",
                    state: null,
                }
            ]
        };
    },
    computed: {
        text() {
            return this.questions[this.selectedQuestion].text;
        },
        title() {
            return this.questions[this.selectedQuestion].title;
        },
        answer() {
            return this.questions[this.selectedQuestion].answer;
        },
    },
    methods: {
        nextQuestion() {
            this.selectedQuestion = (this.selectedQuestion + 1) % 3;
            this.state = null;
            this.isCorrect = false;
            this.isIncorrect = false;
        },
        setState(s) {
            this.state = s;
            this.isCorrect = s === AnswerState.CORRECT;
            this.isIncorrect = s === AnswerState.INCORRECT;
        },

        reset() {
            this.selectedQuestion = 0;
            this.state = null;
            this.isCorrect = false;
            this.isIncorrect = false;
        },
        updateResetTimer() {
            clearTimeout(this.resetTimeout);
            this.resetTimeout = setTimeout(this.reset, 60000);
        },
        failedDetection() {
            this.hasDetectionError = true;
            clearTimeout(this.detectionErrorTimeout);
            this.detectionErrorTimeout = setTimeout(() => this.hasDetectionError = false, 5000);
        },
    },
    mounted() {
        //To disable context menu
        window.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });
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
        top: 380px;
        left: 80px;
        right: 80px;
        height: 150px;
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

    //
    //.column2 {
    //    top: 380px;
    //    right: 0;
    //    width: 750px;
    //    height: 120px;
    //    padding-right: 20px;
    //
    //    .answer {
    //        left: 0;
    //        background-color: rgba(57, 130, 53, 0.68);
    //        padding-left: 20px;
    //        padding-right: 20px;
    //    }
    //
    //    &.correct .answer {
    //        opacity: 1;
    //    }
    //}
    //
    //.column3 {
    //    top: 580px;
    //    left: 0;
    //    width: 750px;
    //    height: 125px;
    //    padding-left: 20px;
    //
    //    .answer {
    //        right: 0;
    //        background-color: rgba(57, 130, 53, 0.68);
    //        padding-left: 20px;
    //        padding-right: 20px;
    //    }
    //
    //    &.correct .answer {
    //        opacity: 1;
    //    }
    //}

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
        left: 20px;
        bottom: 20px;
        width: auto;
        height: 32px;
        z-index: 50;
        display: flex;
        align-items: center;
        color: gray;
        font-weight: bold;

        i {
            font-size: 32px;
            color: #606060;
        }

        span {
            font-size: 18px;
            margin-right: 8px;
        }
    }

    .continue-button {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: auto;
        height: 32px;
        z-index: 50;
        display: flex;
        align-items: center;
        color: gray;
        font-weight: bold;

        i {
            font-size: 32px;
            color: #606060;
        }

        span {
            font-size: 18px;
            margin-right: 8px;
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