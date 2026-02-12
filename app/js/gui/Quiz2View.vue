<template>
    <div class="screen">

        <quiz2-slide v-for="(n, index) in 5" :index="index" :key="'slide'+index" :is-open="openIndex===index"
                     @open="openSlideManually(index)"
                     @close="closeSlide">
            <template v-slot:text>
                <div class="info">
                    <div class="slide-header">
                        <div>{{ text[index].title }}</div>

                        <div class="main-buttons-block">
                            <div class="reset-button" @click="closeSlide">
                                <span>Aizvērt</span>
                                <i class="fas fa-times"></i>
                            </div>
                        </div>

                    </div>
                    <ul>
                        <li v-for="desc in text[index].description">{{ desc }}</li>
                    </ul>
                </div>
            </template>
        </quiz2-slide>

        <div :class="{visible: !openIndex}" class="answers-block">
            <div @click="openSlideManually(0)" class="answer-button" :class="{visible:isAnswerCorrect(0) || useButtons}">
                <span>NOGĀZE</span>
                <span class="link">Apskatīt
                    <i class="fa-solid fa-right-long"></i>
                </span>
            </div>
            <div @click="openSlideManually(1)" class="answer-button" :class="{visible:isAnswerCorrect(1) || useButtons}">
                <span>PAKĀJE</span>
                <span class="link">Apskatīt
                    <i class="fa-solid fa-right-long"></i>
                </span>
            </div>
            <div @click="openSlideManually(2)" class="answer-button" :class="{visible:isAnswerCorrect(2) || useButtons}">
                <span>DELTA</span>
                <span class="link">Apskatīt
                    <i class="fa-solid fa-right-long"></i>
                </span>
            </div>
            <div @click="openSlideManually(3)" class="answer-button" :class="{visible:isAnswerCorrect(3) || useButtons}">
                <span>ESTUĀRS</span>
                <span class="link">Apskatīt
                    <i class="fa-solid fa-right-long"></i>
                </span>
            </div>
            <div @click="openSlideManually(4)" class="answer-button" :class="{visible:isAnswerCorrect(4) || useButtons}">
                <span>DELTAS NOGĀZE</span>
                <span class="link">Apskatīt
                    <i class="fa-solid fa-right-long"></i>
                </span>
            </div>
        </div>

        <detector
            v-for="(a, index) in 5"
            :key="index"
            :class="{visible: openIndex===null && !useButtons && !isAnswerCorrect(index)}"
            :position-x="tagState[index].x"
            :position-y="tagState[index].y"
            :definitions="featureDefinitions"
            :disabled="isDisabled(index)"
            :state="answerState[index]"
            @detected="(s) => setAnswer(index, s)"
            @failed="failedDetection"
            @processing="startProcessing(index)"
            @click="handleDetectorClick(index)"
        />

        <div
            v-for="(a, index) in 5" class="point"
            :data-index="index"
            :class="{visible: isLineVisible(index)}"
            :key="'line'+index"
        >
            <div class="line" :class="{processing: (index===processingIndex)}"></div>
        </div>

        <div class="main-title">
            <div>
                <span>Atpazīsti vietas</span>
            </div>

            <div class="main-buttons-block">
                <div class="variants-button" @click="useButtons=!useButtons">
                    {{ useButtons ? 'Izmantot elementus' : 'Skatīt atbildes' }}
                </div>
                <div class="reset-button" @click="reset">
                    <span>No sākuma</span>
                    <i class="fas fa-sync-alt"></i>
                </div>
            </div>
        </div>

        <!-- <div v-if="!useButtons && !areAllAnswersCorrect" class="detector-info-block">
            <div v-if="hasDetectionError" class="detector-info">
                <div class="icon hand-icon-2"></div>
                <div class="text">
                    Neizdevās atpazīt elementu. Mēģini vēlreiz novietojot elementu precīzi sarkanajā aplī.
                </div>
            </div>
            <div v-else class="detector-info">
                <div class="icon hand-icon-1"></div>
                <div class="text">Novieto atbilstošo klucīti sarkanajā aplī. Turi to vismaz 2 sekundes, kamēr
                    notiek atpazīšana.
                </div>
            </div>
        </div> -->

        <answer-modal :visible="isAnswerModalVisible" :answers="modalAnswers" @selected="selectAnswerFromModal"/>

        <div class="container offscreen">
            <div class="row">
                <div v-for="(n,index) in 5" class="col-lg-2 text-center">
                    <button v-for="answerId in Object.keys(answerNames)"
                            class="btn btn-lg w-100 overflow-hidden btn-success mt-2 btn-block mx-1"
                            @click="setAnswer(index, answerId)">
                        {{ answerNames[answerId] }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
import Quiz2Slide from "./components/Quiz2Slide.vue";
import TextLV from "@json/quiz2-text-lv.json";
import Config from "@json/config.json";
import {AnswerState} from "@js/Stuctures/Constants.js";
import FeatureDefinitionBuilder from "@js/Services/FeatureDefinitionBuilder";
import Detector from "@js/gui/components/Detector.vue";
import AnswerModal from "@js/gui/components/AnswerModal.vue";
import {getSimilarFeatureIds, hasSimilarFeatures} from "@js/Helpers/SimilarFeatures.js";
import InactivityWatcher from "@js/Services/InactivityWatcher.js";

export default {
    name: "Quiz2View",
    components: {
        AnswerModal,
        Quiz2Slide,
        Detector
    },
    data() {
        return {
            featureDefinitions: FeatureDefinitionBuilder.buildDefinitionsFromConfiguration(Config.objectDefinitions2, 15),
            openIndex: null,
            answerState: [
                null,
                null,
                null,
                null,
                null
            ],
            correctAnswers: [
                1,
                2,
                3,
                5,
                7
            ],


            tagState: [
                {
                    state: null,
                    timer: null,
                    x: 25,
                    y: 170,
                    answer: 1,
                },
                {
                    state: null,
                    timer: null,
                    x: 230,
                    y: 270,
                    answer: 2,
                },
                {
                    state: null,
                    timer: null,
                    x: 435,
                    y: 170,
                    answer: 3,
                },
                {
                    state: null,
                    timer: null,
                    x: 640,
                    y: 270,
                    answer: 5,
                },
                {
                    state: null,
                    timer: null,
                    x: 845,
                    y: 170,
                    answer: 7,
                },
            ],
            hasDetectionError: false,
            detectionErrorTimeout: null,
            useButtons: false,
            isAnswerModalVisible: false,
            modalAnswers: [],
            answerNames: {
                1: "NOGĀZE",
                2: "PAKĀJE",
                3: "DELTA",
                5: "ESTUĀRS",
                7: "DELTAS NOGĀZE",
            },
            selectedIndex: null,
            processingIndex: null
        };
    },
    computed: {
        text() {
            return TextLV;
        },
        areAllAnswersCorrect() {
            for (const state of this.answerState) {
                if (state !== AnswerState.CORRECT) {
                    return false;
                }
            }
            return true;
        },
    },
    methods: {
        handleDetectorClick(which) {
            if (this.isAnswerModalVisible) {
                return;
            }

            if (this.answerState[which] === null) {
                this.selectedIndex = which;
                this.showModalWithAnswers(0, which);
            }
        },
        isLineVisible(index) {
            if (this.isAnswerCorrect(index) || this.useButtons) {
                return false;
            }
            return !this.openIndex && index !== this.processingIndex;
        },
        isAnswerCorrect(index) {
            return this.answerState[index] === AnswerState.CORRECT;
        },
        reset() {
            this.$router.go();
        },
        openSlide(index) {
            this.openIndex = index;
            this.requestLightState(index);
        },
        closeSlide() {
            this.openIndex = null;
            this.requestLightState(null);
        },
        async requestPortPinsWithParams(params) {
            try {
                await axios.get(Config.quiz2.endpointUrl, {
                    responseType: 'text',
                    withCredentials: false,
                    params: params
                });
            } catch (e) {
                console.log('axios error' + e.message);
            }
        },
        requestLightState(column) {
            const pins = Config.quiz2.columnPins;
            let params = {
                port: 0
            };
            for (const [i, v] of pins.lower.entries()) {
                params['pin' + v] = (i === column) ? 1 : 0;
            }
            for (const [i, v] of pins.upper.entries()) {
                params['pin' + v] = (i === column) ? 1 : 0;
            }
            this.requestPortPinsWithParams(params);
        },
        startProcessing (index) {
            this.processingIndex = index;
        },
        failedDetection() {
            this.hasDetectionError = true;
            clearTimeout(this.detectionErrorTimeout);
            this.detectionErrorTimeout = setTimeout(() => this.hasDetectionError = false, 5000);
        },
        setState(index, answerId) {
            const state = parseInt(answerId) === this.correctAnswers[index] ? AnswerState.CORRECT : AnswerState.INCORRECT;
            this.$set(this.answerState, index, state);
            if (state === AnswerState.CORRECT) {
                this.openIndex = index;
            }
        },
        setAnswer(which, answerId) {
            this.processingIndex = null;

            if (this.isAnswerModalVisible || this.openIndex !== null) {
                return;
            }

            answerId = parseInt(answerId);

            if (this.answerState[which] === null) {
                if (this.shouldShowModalWithAnswers(answerId)) {
                    this.selectedIndex = which;
                    this.showModalWithAnswers(answerId, which);
                } else {
                    this.setState(which, answerId);
                }
            }
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
            this.setState(this.selectedIndex, answerId);
            this.isAnswerModalVisible = false;
            this.selectedIndex = null;
        },
        isDisabled(index) {
            if (this.processingIndex !== null) {
                return index !== this.processingIndex;
            }

            if (this.isAnswerCorrect(index)) {
                return true;
            }

            if (this.openIndex !== null || this.useButtons) {
                return true;
            }
            return this.selectedIndex !== null && this.selectedIndex !== index;
        },
        openSlideManually(index) {
            if (this.useButtons || this.isAnswerCorrect(index)) {
                this.openSlide(index);
            }
        },
        simulateTouch(index) {
            if (index === 1) {
                this.toggleFeatureEvent(1, 30,155, this.featureDefinitions);
            } else if (index === 2) {
                this.toggleFeatureEvent(1, 235,255, this.featureDefinitions);
            } else if (index === 3) {
                this.toggleFeatureEvent(1, 440,155, this.featureDefinitions);
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
    position: absolute;
    width: 1024px;
    height: 768px;
    //background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);
    background: white;

    .offscreen {
        position: absolute;
        width: 1024px;
        height: 500px;
        top: 768px;
    }

    .main-title {
        position: absolute;
        font-weight: bold;
        width: 1024px;
        left: 0;
        height: 65px;
        text-align: center;
        font-size: 38px;
        background-color: white;
        color: #606060;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 16px;
        padding-right: 16px;
        border-bottom: 1px solid lightgray;

        &.visible {
            opacity: 1.0;
        }
    }

    .main-buttons-block {
        display: flex;

        .variants-button {
            font-size: 18px;
            margin-right: 36px;
            display: flex;
            align-items: center;
            color: rgb(119, 170, 197);
            transition: all linear 200ms;

            &:hover {
                color: #418bb4;

                i {
                    color: #418bb4;
                }
            }
        }

        .reset-button {
            width: auto;
            height: 32px;
            color: rgb(119, 170, 197);
            display: flex;
            align-items: center;
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
    }

    .detector-info-block {
        position: absolute;
        top: 30px;
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

    .details {
        position: absolute;
        background-color: rgba(100, 100, 100, 0.7);
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
        height: 200px;
        border-radius: 60px;
        color: white;
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
            top: 150px;
            left: 100px;
        }

        //Pakāje
        &.pos-2 {
            top: 450px;
            left: 250px;
        }

        //Delta
        &.pos-3 {
            top: 450px;
            left: 550px;
        }

        //Estuārs
        &.pos-4 {
            top: 150px;
            left: 400px;
        }

        //Deltas nogāze
        &.pos-5 {
            top: 150px;
            left: 700px;
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

.tag {
    position: absolute;
    z-index: 10;
    opacity: 0;
    transition: all linear 500ms;

    &.visible {
        opacity: 1;
    }

    &[data-index="0"] {
        top: 120px;
        left: 27.4px;
    }

    &[data-index="1"] {
        top: 210px;
        left: 232.2px;
    }

    &[data-index="2"] {
        top: 120px;
        left: 437px;
    }

    &[data-index="3"] {
        top: 210px;
        left: 641.8px;
    }

    &[data-index="4"] {
        top: 120px;
        left: 846.6px;
    }
}

.point {
    position: absolute;
    background-color: white;
    width: 40px;
    height: 40px;
    z-index: 4;
    border-radius: 50%;
    opacity: 0;
    transition: all linear 500ms;

    & .line {
        position: absolute;
        width: 3px;
        background-color: white;
        bottom: 40px;
        left: 18px;
        transition: all linear 500ms;
        height: 0;
    }

    &.visible {
        opacity: 0.7;
    }

    &[data-index="0"] {
        left: 82.4px;
        bottom: 80px;

        &.visible > .line {
            height: 320px;
        }
    }

    &[data-index="1"] {
        left: 287.2px;
        bottom: 80px;

        &.visible > .line {
            height: 225px;
        }
    }

    &[data-index="2"] {
        left: 492px;
        bottom: 80px;

        &.visible > .line {
            height: 346px;
        }
    }

    &[data-index="3"] {
        left: 696.8px;
        bottom: 80px;

        &.visible > .line {
            height: 224px;
        }
    }

    &[data-index="4"] {
        left: 901.6px;
        bottom: 80px;

        &.visible > .line {
            height: 346px;
        }
    }
}

.info {
    background-color: rgba(255, 255, 255, 1);

    & .slide-header {
        color: #606060;
        padding-left: 16px;
        padding-right: 16px;
        font-size: 38px;
        font-weight: bold;
        height: 65px;
        border-bottom: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    & ul {
        background-color: rgba(255,255,255,0.8);
        position: absolute;
        top:240px;
        left:50px;
        right:50px;
        height: auto;
        padding: 30px;
    }

    ul li {
        font-size: 23px;
        line-height: 26px;
        padding-bottom: 25px;
        color: #606060;
        list-style-type: none;

        &:last-child {
            padding-bottom: 0;
        }
    }
}

.answers-block {
    position: absolute;
    width: 1024px;
    height: auto;
    display: flex;
    top: 130px;
    justify-content: space-around;
    transition: all linear 500ms;
    opacity: 0;
    align-items: flex-end;

    &.visible {
        opacity: 1;
    }

    div {
        //color: white;
        width: 100%;
        flex-basis: 0;
        font-size: 32px;
        line-height: 32px;
        text-align: center;
    }
}

.answer-button {
    transition: all;
    transition-duration: 600ms;
    font-weight: bold;
    text-align: center;
    font-size: 24px;
    //color: white;
    color: #606060;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 8px;
    //box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    flex-grow: 1;
    text-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    opacity: 0;
    //border-right: 1px solid lightgray;

    & > * {
        pointer-events: none;
    }

    &.visible {
        opacity: 1;
    }

    & .link {
        margin-top: 42px;
        height: 32px;
        font-size: 18px;
        color: rgb(119, 170, 197);
        align-items: center;
        transition: all linear 200ms;
        text-shadow: none;

        &:hover {
            color: #418bb4;

            i {
                color: #418bb4;
            }
        }
    }
}

</style>