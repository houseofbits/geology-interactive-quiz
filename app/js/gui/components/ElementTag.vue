<template>
    <div class="tag">
        <slot></slot>
        <div class="inner-default" :class="{active: defaultActive}">
            <i class="far fa-question-circle"></i>
        </div>
        <div class="inner-incorrect" :class="{active: incorrect}">
            <i class="far fa-times-circle"></i>
        </div>
        <div class="inner-correct" :class="{active: correct}">
            <i class="far fa-check-circle"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: "ElementTag",
    props: {
        incorrect: {
            type: Boolean,
            default: false
        },
        correct: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        defaultActive() {
            return !this.incorrect && !this.correct;
        }
    }
}
</script>

<style lang="scss" scoped>
.tag {
    z-index: 1;
    position: absolute;
    width: 150px;
    height: 150px;
    border: solid 4px gray;
    border-radius: 50%;

    .inner-default {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        background: linear-gradient(to bottom, rgba(255,48,25,1) 0%,rgba(188,3,3,1) 100%);
        border-radius: 50%;
        line-height: 150px;
        text-align: center;
        vertical-align: middle;
        opacity:0;
        transition: all linear 1000ms;

        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(255,116,0,1) 0%,rgba(242,72,0,1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        &.active {
            opacity: 1;
        }
    }

    .inner-incorrect {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border-radius: 50%;
        line-height: 151px;
        text-align: center;
        vertical-align: middle;
        transform: scale(8);
        opacity:0;
        transition: all linear 1000ms;
        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(255,48,25,1) 0%,rgba(188,3,3,1) 100%);
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
        }
    }

    .inner-correct {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
        border-radius: 50%;
        line-height: 151px;
        text-align: center;
        vertical-align: middle;
        transform: scale(8);
        opacity:0;
        transition: all linear 1000ms;
        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(12,255,0,1) 0%,rgba(8,127,0,1) 100%);
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
        }
    }
}
</style>