<template>
    <div class="frame" :class="{visible: selected}">
        <span class="title" :class="{inactive: isHint1Visible}">{{ title }}</span>
        <div class="hint1" :class="{active: isHint1Visible, inactive: isHint2Visible}">{{ hint1 }}</div>
        <div class="hint2" :class="{active: isHint2Visible}">{{ hint2 }}</div>
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
        top: 100px;
        color: #414141;
        text-shadow: 0 6px 20px rgba(0,0,0,0.4);
        transition: all linear 50ms;

        &.inactive {
            opacity: 0.4;
            text-shadow: 0 6px 35px rgba(0,0,0,0.8);
            transition: all linear 500ms;
        }
    }

    .hint1 {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 28px;
        line-height: 26px;
        top: 190px;
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
    }

    .active-area {
        position: absolute;
        left: 100px;
        top:400px;
        bottom: 150px;
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
    }
}

</style>