<template>
    <div class="frame" :class="{visible: selected}">
        <span class="title" :class="{inactive: isHint1Visible || isCorrectAnswer}">{{ title }}</span>
        <div class="hint1" :class="{active: isHint1Visible, inactive: isHint2Visible || (isHint1Visible && isCorrectAnswer)}">{{ hint1 }}</div>
        <div class="hint2" :class="{active: isHint2Visible, inactive: isHint2Visible && isCorrectAnswer}">{{ hint2 }}</div>
        <div class="correct-answer" :class="{visible:isCorrectAnswer}">{{ answerTitle }}</div>
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
        },
        answerTitle: {
            type: String,
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
        line-height: 32px;
        padding-left: 40px;
        padding-right: 40px;

        color: #414141;
        text-shadow: 0 6px 20px rgba(0,0,0,0.4);
        transition: all linear 50ms;
        top: 190px;

        &.inactive {
            opacity: 0.4;
            text-shadow: 0 6px 35px rgba(0,0,0,0.8);
            transition: all linear 500ms;
            top: 100px;
        }
    }

    .hint1 {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 28px;
        line-height: 26px;

        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        text-shadow: 0 6px 20px rgba(0,0,0,0.4);
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
            text-shadow: 0 6px 35px rgba(0,0,0,0.8);
            transition: all linear 350ms;
            top: 190px;
        }
    }

    .hint2 {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 26px;
        line-height: 26px;
        top: 280px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        text-shadow: 0 6px 20px rgba(0,0,0,0.4);
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
            text-shadow: 0 6px 35px rgba(0,0,0,0.8);
            transition: all linear 350ms;
            top: 265px;
        }
    }

    .correct-answer {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 48px;
        font-weight: bold;
        line-height: 48px;
        top: 340px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        text-shadow: 0 6px 20px rgba(0,0,0,0.4);
        transform: scale(0.1);
        opacity: 0.0;
        transition: all linear 50ms;
        background: linear-gradient(to bottom, rgba(28,214,0,1) 0%,rgba(5,109,0,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &.visible {
            opacity: 1.0;
            transform: scale(1.0);
            transition: all linear 350ms;
        }
    }
}

</style>