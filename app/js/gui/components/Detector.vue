<template>
    <div class="tag" :style="style" :class="{loading: processing}">
        <slot></slot>
        <div class="loading-ring">
            <div class="ring-layer"></div>
        </div>
        <div class="inner-default" :class="{active: defaultActive, disabled: disabled}">
            <i class="far fa-question-circle"></i>
        </div>
        <div class="inner-incorrect" :class="{active: incorrect, disabled: disabled}">
            <i class="far fa-times-circle"></i>
        </div>
        <div class="inner-correct" :class="{active: correct, disabled: disabled}">
            <i class="far fa-check-circle"></i>
        </div>

        <div class="tag-border"></div>

    </div>
</template>

<script>
import RegionDetectionService from "@js/Services/RegionDetectionService";
import {AnswerState} from "@js/Stuctures/Constants";

export default {
    name: "Detector",
    props: {
        positionX: {
            type: Number,
            required: true
        },
        positionY: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        },
        state: {
            type: Number,
            default: null
        },
        definitions: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            processing: false,
            detector: new RegionDetectionService()
        };
    },
    watch: {
        disabled(value) {
            this.detector.setDisabled(value);
        }
    },
    computed: {
        style() {
            return {
                top: this.positionY + 'px',
                left: this.positionX + 'px',
            };
        },
        defaultActive() {
            return !this.incorrect && !this.correct;
        },
        correct() {
            return this.state === AnswerState.CORRECT;
        },
        incorrect() {
            return this.state === AnswerState.INCORRECT;
        }
    },
    methods: {
        detectStartHandler() {
            this.processing = !this.correct && !this.incorrect;
        },
        detectEndHandler() {
            if (this.processing) {
                this.processing = false;
                this.emitFailed();
            }
        },
        detectedObjectHandler(id) {
            if (this.processing && !this.incorrect && !this.correct) {
                this.emitState(id);
                this.processing = false;
            }
        },
        emitState(id) {
            if (!this.disabled) {
                this.$emit('detected', id);
            }
        },
        emitFailed() {
            if (!this.disabled) {
                this.$emit('failed');
            }
        },
    },
    mounted() {
        this.detector.touch.region.set(this.positionX - 30,this.positionY - 30, this.positionX + 180, this.positionY + 180);
        this.detector.touch.registerInputHandlers();
        this.detector.featureDefinitions = this.definitions;
        this.detector.runDetectionLoop();
        this.detector.detectStartHandler = this.detectStartHandler;
        this.detector.detectEndHandler = this.detectEndHandler;
        this.detector.detectedObjectHandler = this.detectedObjectHandler;
    },
    beforeUnmount() {
        this.detector.touch.unregisterInputHandlers();
    }
}
</script>

<style lang="scss" scoped>

@keyframes question-mark {
    0%   {transform: scale(1.0);}
    30%   {transform: scale(1.6);}
    100%   {transform: scale(1.0);}
}

.tag {
    pointer-events: none;
    z-index: 1;
    position: absolute;
    width: 150px;
    height: 150px;

    &.loading {
        & .loading-ring {
            left: -20px;
            right: -20px;
            top: -20px;
            bottom: -20px;
            opacity: 1;
        }

        & .tag-border {
            left: -20px;
            right: -20px;
            top: -20px;
            bottom: -20px;
            opacity: 0;
        }
    }

    & .loading-ring {
        position: absolute;
        clip-path: circle(50% at 50% 50%);
        left: -5px;
        right: -5px;
        top: -5px;
        bottom: -5px;
        transition: all;
        transition-duration: 500ms;
        opacity: 0;

        & .ring-layer {
            position: absolute;
            //background-color: rgba(255,255,255,0.5);
            background: linear-gradient(to bottom, rgba(255, 48, 25, 0.5) 0%, rgba(188, 3, 3, 0.5) 100%);
            pointer-events: none;
            width: 100%;
            height: 100%;
            animation: spin 2s infinite;
            animation-timing-function: linear;
        }
    }

    & .tag-border {
        border: solid 4px gray;
        border-radius: 50%;
        position: absolute;
        left: -5px;
        right: -5px;
        top: -5px;
        bottom: -5px;
        transition: all;
        transition-duration: 500ms;
        opacity: 1;
    }

    .inner-default {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        background: linear-gradient(to bottom, rgba(255, 48, 25, 1) 0%, rgba(188, 3, 3, 1) 100%);
        border-radius: 50%;
        line-height: 161px;
        text-align: center;
        vertical-align: middle;
        opacity: 0;
        transition: all linear 1000ms;

        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(255, 116, 0, 1) 0%, rgba(242, 72, 0, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        &:not(.disabled) {
            i {
                animation-name: question-mark;
                animation-duration: 1000ms;
                animation-iteration-count: infinite;
            }
        }

        &.active {
            opacity: 1;

            &.disabled {
                opacity: 0.8;
            }
        }

        &.disabled {
            filter: grayscale(100);
        }
    }

    .inner-incorrect {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border-radius: 50%;
        line-height: 161px;
        text-align: center;
        vertical-align: middle;
        transform: scale(8);
        opacity: 0;
        transition: all linear 1000ms;

        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(255, 48, 25, 1) 0%, rgba(188, 3, 3, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 1px 2px red);
        }

        &.active {
            opacity: 1;
            transform: scale(2.4);

            i {
                filter: drop-shadow(0 3px 4px green);
            }

            &.disabled {
                opacity: 0.8;
            }
        }

        &.disabled {
            filter: grayscale(100);
        }
    }

    .inner-correct {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border-radius: 50%;
        line-height: 161px;
        text-align: center;
        vertical-align: middle;
        transform: scale(8);
        opacity: 0;
        transition: all linear 1000ms;

        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(12, 255, 0, 1) 0%, rgba(8, 127, 0, 1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 1px 2px green);
        }

        &.active {
            opacity: 1;
            transform: scale(2.6);

            i {
                filter: drop-shadow(0 3px 4px green);
            }

            &.disabled {
                opacity: 0.8;
            }
        }

        &.disabled {
            filter: grayscale(100);
        }
    }
}

@keyframes spin {
    0.00% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 0.0%, 50.0% 0.0%);
    }
    1.39% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 0.8%, 58.7% 0.8%);
    }
    2.78% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 3.0%, 67.1% 3.0%);
    }
    4.17% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 6.7%, 75.0% 6.7%);
    }
    5.56% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 11.7%, 82.1% 11.7%);
    }
    6.94% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 17.9%, 88.3% 17.9%);
    }
    8.33% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 25.0%, 93.3% 25.0%);
    }
    9.72% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 32.9%, 97.0% 32.9%);
    }
    11.11% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 41.3%, 99.2% 41.3%);
    }
    12.50% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50.0%, 100.0% 50.0%);
    }
    13.89% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 58.7%, 99.2% 58.7%);
    }
    15.28% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 67.1%, 97.0% 67.1%);
    }
    16.67% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 75.0%, 93.3% 75.0%);
    }
    18.06% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 82.1%, 88.3% 82.1%);
    }
    19.44% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 88.3%, 82.1% 88.3%);
    }
    20.83% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 93.3%, 75.0% 93.3%);
    }
    22.22% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 97.0%, 67.1% 97.0%);
    }
    23.61% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 99.2%, 58.7% 99.2%);
    }
    25.00% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100.0%, 100% 100%, 0% 100%, 0% 100.0%, 50.0% 100.0%);
    }
    26.39% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 99.2%, 100% 100%, 0% 100%, 0% 99.2%, 41.3% 99.2%);
    }
    27.78% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 97.0%, 100% 100%, 0% 100%, 0% 97.0%, 32.9% 97.0%);
    }
    29.17% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 93.3%, 100% 100%, 0% 100%, 0% 93.3%, 25.0% 93.3%);
    }
    30.56% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 88.3%, 100% 100%, 0% 100%, 0% 88.3%, 17.9% 88.3%);
    }
    31.94% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 82.1%, 100% 100%, 0% 100%, 0% 82.1%, 11.7% 82.1%);
    }
    33.33% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 75.0%, 100% 100%, 0% 100%, 0% 75.0%, 6.7% 75.0%);
    }
    34.72% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 67.1%, 100% 100%, 0% 100%, 0% 67.1%, 3.0% 67.1%);
    }
    36.11% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 58.7%, 100% 100%, 0% 100%, 0% 58.7%, 0.8% 58.7%);
    }
    37.50% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50.0%, 100% 100%, 0% 100%, 0% 50.0%, 0.0% 50.0%);
    }
    38.89% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 41.3%, 100% 100%, 0% 100%, 0% 41.3%, 0.8% 41.3%);
    }
    40.28% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 32.9%, 100% 100%, 0% 100%, 0% 32.9%, 3.0% 32.9%);
    }
    41.67% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 25.0%, 100% 100%, 0% 100%, 0% 25.0%, 6.7% 25.0%);
    }
    43.06% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 17.9%, 100% 100%, 0% 100%, 0% 17.9%, 11.7% 17.9%);
    }
    44.44% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 11.7%, 100% 100%, 0% 100%, 0% 11.7%, 17.9% 11.7%);
    }
    45.83% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 6.7%, 100% 100%, 0% 100%, 0% 6.7%, 25.0% 6.7%);
    }
    47.22% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 3.0%, 100% 100%, 0% 100%, 0% 3.0%, 32.9% 3.0%);
    }
    48.61% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 0.8%, 100% 100%, 0% 100%, 0% 0.8%, 41.3% 0.8%);
    }
    49.99% {
        clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 0.8%, 100% 100%, 0% 100%, 0% 0.8%, 41.3% 0.8%);
    }
    50.00% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 0.0%, 0% 100%, 100% 100%, 100% 0.0%, 50.0% 0.0%);
    }
    51.39% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 0.8%, 0% 100%, 100% 100%, 100% 0.8%, 58.7% 0.8%);
    }
    52.78% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 3.0%, 0% 100%, 100% 100%, 100% 3.0%, 67.1% 3.0%);
    }
    54.17% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 6.7%, 0% 100%, 100% 100%, 100% 6.7%, 75.0% 6.7%);
    }
    55.56% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 11.7%, 0% 100%, 100% 100%, 100% 11.7%, 82.1% 11.7%);
    }
    56.94% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 17.9%, 0% 100%, 100% 100%, 100% 17.9%, 88.3% 17.9%);
    }
    58.33% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 25.0%, 0% 100%, 100% 100%, 100% 25.0%, 93.3% 25.0%);
    }
    59.72% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 32.9%, 0% 100%, 100% 100%, 100% 32.9%, 97.0% 32.9%);
    }
    61.11% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 41.3%, 0% 100%, 100% 100%, 100% 41.3%, 99.2% 41.3%);
    }
    62.50% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 50.0%, 0% 100%, 100% 100%, 100% 50.0%, 100.0% 50.0%);
    }
    63.89% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 58.7%, 0% 100%, 100% 100%, 100% 58.7%, 99.2% 58.7%);
    }
    65.28% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 67.1%, 0% 100%, 100% 100%, 100% 67.1%, 97.0% 67.1%);
    }
    66.67% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 75.0%, 0% 100%, 100% 100%, 100% 75.0%, 93.3% 75.0%);
    }
    68.06% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 82.1%, 0% 100%, 100% 100%, 100% 82.1%, 88.3% 82.1%);
    }
    69.44% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 88.3%, 0% 100%, 100% 100%, 100% 88.3%, 82.1% 88.3%);
    }
    70.83% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 93.3%, 0% 100%, 100% 100%, 100% 93.3%, 75.0% 93.3%);
    }
    72.22% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 97.0%, 0% 100%, 100% 100%, 100% 97.0%, 67.1% 97.0%);
    }
    73.61% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 99.2%, 0% 100%, 100% 100%, 100% 99.2%, 58.7% 99.2%);
    }
    75.00% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 100.0%, 50.0% 100.0%);
    }
    76.39% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 99.2%, 41.3% 99.2%);
    }
    77.78% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 97.0%, 32.9% 97.0%);
    }
    79.17% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 93.3%, 25.0% 93.3%);
    }
    80.56% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 88.3%, 17.9% 88.3%);
    }
    81.94% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 82.1%, 11.7% 82.1%);
    }
    83.33% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 75.0%, 6.7% 75.0%);
    }
    84.72% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 67.1%, 3.0% 67.1%);
    }
    86.11% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 58.7%, 0.8% 58.7%);
    }
    87.50% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 50.0%, 0.0% 50.0%);
    }
    88.89% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 41.3%, 0.8% 41.3%);
    }
    90.28% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 32.9%, 3.0% 32.9%);
    }
    91.67% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 25.0%, 6.7% 25.0%);
    }
    93.06% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 17.9%, 11.7% 17.9%);
    }
    94.44% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 11.7%, 17.9% 11.7%);
    }
    95.83% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 6.7%, 25.0% 6.7%);
    }
    97.22% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 3.0%, 32.9% 3.0%);
    }
    98.61% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 0.8%, 41.3% 0.8%);
    }
    99.99% {
        clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 0.8%, 41.3% 0.8%);
    }
}
</style>