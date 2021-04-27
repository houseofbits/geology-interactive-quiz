<template>
    <div class="screen" :class="{visible: selected, green: isFinishedCorrect, red: isFinishedIncorrect}">
        <span class="title">{{ title }}</span>

        <span class="hint1" v-if="isHint1Visible">{{ hint1 }}</span>

        <span class="hint2" v-if="isHint2Visible">{{ hint2 }}</span>

        <div class="active-area"></div>

    </div>
</template>

<script>
export default {
    name: "QuizPage",
    props: {
        finished: {
            type: Boolean,
            required: true
        },
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
        isCorrectAnswer: {
            type: Boolean,
            required: true
        },
        numberOfErrors: {
            type: Number,
            required: true
        }
    },
    computed: {
        isHint1Visible() {
            return this.numberOfErrors > 0;
        },
        isHint2Visible() {
            return this.numberOfErrors > 1;
        },
        isFinishedCorrect() {
            return this.finished && this.isCorrectAnswer;
        },
        isFinishedIncorrect() {
            return this.finished && !this.isCorrectAnswer;
        }
    }
}
</script>

<style lang="scss" scoped>

.screen {
    position: absolute;
    left: 0;
    top: 0;
    width: 1024px;
    height: 768px;
    visibility: hidden;
    //background: linear-gradient(to bottom, rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%);
    background-color: white;

    &.green {
        background-color: green;
    }
    &.red {
        background-color: darkred;
    }

    &.visible {
        visibility: visible;
    }

    .title {
        display: inline-block;
        width: 100%;
        color: white;
        text-align: center;
        font-size: 32px;
        line-height: 32px;
        padding-left: 40px;
        padding-right: 40px;
        margin-top: 30px;
    }

    .hint1 {
        display: inline-block;
        width: 100%;
        color: white;
        text-align: center;
        font-size: 26px;
        line-height: 26px;
        margin-top: 30px;
        padding-left: 40px;
        padding-right: 40px;
    }

    .hint2 {
        display: inline-block;
        width: 100%;
        color: white;
        text-align: center;
        font-size: 26px;
        line-height: 26px;
        margin-top: 30px;
        padding-left: 40px;
        padding-right: 40px;
    }

    .active-area {
        position: absolute;
        left: 100px;
        top:300px;
        bottom: 200px;
        right:100px;
        border-radius: 60px;
        color:white;
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
        //
        //&.green {
        //    background: repeating-linear-gradient(
        //            45deg,
        //            rgba(137, 255, 0, 0.6) 0,
        //            rgba(112, 255, 0, 0.66) 20px,
        //            rgba(0, 0, 255, 0) 20px,
        //            rgba(63, 187, 62, 0) 40px
        //    );
        //    border: solid 10px rgba(112, 255, 0, 0.66);
        //}
        //
        //&.red {
        //    background: repeating-linear-gradient(
        //            45deg,
        //            rgba(255, 96, 0, 0.6) 0,
        //            rgba(255, 96, 0, 0.66) 20px,
        //            rgba(255, 96, 0, 0) 20px,
        //            rgba(255, 96, 0, 0) 40px
        //    );
        //    border: solid 10px rgba(255, 96, 0, 0.6);
        //}
    }
}

</style>