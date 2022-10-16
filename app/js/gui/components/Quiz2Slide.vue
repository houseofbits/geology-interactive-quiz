<template>
    <div class="frame clip-column" :data-index="index" :class="{active: isOpen}">
        <div class="img1"></div>
        <div class="img2"></div>
        <div class="img3"></div>
        <div class="main-image" @click="open">
            <div class="main"></div>
            <div class="content"></div>
        </div>
        <div class="text">
            <slot name="text"/>
        </div>

<!--        <div class="close-button" @click="close">-->
<!--            <i class="fas fa-times"></i>-->
<!--        </div>-->
    </div>
</template>

<script>
export default {
    name: "Quiz2Slide",
    props: {
        index: {
            type: Number,
            required: true
        },
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            timer: null
        };
    },
    watch: {
        isOpen(val) {
            clearTimeout(this.timer);
            if (val) {
                this.timer = setTimeout(this.close, 60000);
            }
        }
    },
    methods: {
        open() {
            this.$emit('open', this.index);
        },
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="scss" scoped>

.frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 1024px;
    height: 768px;
    //background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);
    background: white;

    .text {
        position: absolute;
        top: 0;
        left: 0;
        width: 1024px;
        height: 768px;
        z-index: 6;
        opacity: 0;
        visibility: hidden;
        transition: all linear 500ms;
    }

    &.active .text{
        opacity: 1;
        visibility: visible;
    }

    .img1, .img2, .img3 {
        position: absolute;
        top: 0;
        left:0;
        width: 1024px;
        height: 768px;
        visibility: hidden;
        opacity: 0;
        transition: all linear 400ms;
        background-repeat: no-repeat;
        background-size: contain;
    }

    &[data-index="0"] {
        .img1 {
            background-image: url("@images/q2-bg1-2.jpg");
            transform: scale(0.6) translate(500px, 380px);
        }
        .img2 {
            background-image: url("@images/q2-bg1-3.jpg");
            transform: scale(0.6) translate(-500px, -380px);
        }
        .img3 {
            background-image: url("@images/q2-bg1-4.jpg");
            transform: scale(0.6) translate(500px, -380px);
        }
        &.active {
            .img1, .img2, .img3 {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    &[data-index="1"] {
        .img1 {
            background-image: url("@images/q2-bg2-2.jpg");
            transform: scale(2.0) translate(220px, -200px);
        }
        .img2 {
            background-image: url("@images/q2-bg2-3.jpg");
            transform: scale(0.6) translate(500px,  388px);
        }
        &.active {
            .img1, .img2 {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    &[data-index="2"] {
        .img1 {
            background-image: url("@images/q2-bg3-3.jpg");
            transform: scale(2) translate(120px, -350px);
        }
        .img2 {
            background-image: url("@images/q2-bg3-2.jpg");
            transform: scale(0.6) translate(500px,  330px);
        }
        &.active {
            .img1, .img2 {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    &[data-index="3"] {
        .img1 {
            background-image: url("@images/q2-bg4-3.jpg");
            transform: scale(1.2) translate(80px, -350px);
        }
        .img2 {
            background-image: url("@images/q2-bg4-2.jpg");
            transform: scale(0.6) translate(-500px,  330px);
        }
        &.active {
            .img1, .img2 {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    &[data-index="4"] {
        .img1 {
            background-image: url("@images/q2-bg5-3.jpg");
            transform: scale(1.2) translate(80px, -350px);
        }
        .img2 {
            background-image: url("@images/q2-bg5-2.jpg");
            transform: scale(0.6) translate(-500px,  330px);
        }
        &.active {
            .img1, .img2 {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    .main-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 1024px;
        height: 768px;
        transition: all linear 400ms;

        .main {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: all linear 400ms;
        }

        .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: all linear 400ms;
            opacity: 0;
        }
    }
}

.clip-column {
    z-index: 0;
    transition: all linear 400ms;

    &[data-index="0"] {
        clip-path: inset(0 80% 0 0);

        .main-image .main {
            background-image: url('@images/q2-main1.png');
        }
        .main-image .content {
            background-image: url('@images/q2-bg1.jpg');
        }
        .main-image {
            transform: scale(0.9) translate(-480px, 100px);
        }
        &.active .main-image {
            transform: scale(0.6) translate(-524px, 387px);
        }
    }

    &[data-index="1"] {
        clip-path: inset(0 60% 0 20%);

        .main-image .main {
            background-image: url('@images/q2-main2.png');
        }

        .main-image .content {
            background-image: url('@images/q2-bg2.jpg');
        }

        .main-image {
            transform: scale(0.9) translate(0px, 240px);
        }

        &.active .main-image {
            transform: scale(0.6) translate(-524px, 387px);
        }
    }

    &[data-index="2"] {
        clip-path: inset(0 40% 0 40%);

        .main-image .main {
            background-image: url('@images/q2-main3.png');
        }

        .main-image .content {
            background-image: url('@images/q2-bg3.jpg');
        }

        .main-image {
            transform: scale(0.9) translate(-30px, 200px);
        }

        &.active .main-image {
            transform: scale(0.6) translate(-524px, 330px);
        }
    }

    &[data-index="3"] {
        clip-path: inset(0 20% 0 60%);

        .main-image .main {
            background-image: url('@images/q2-main4.png');
        }
        .main-image .content {
            background-image: url('@images/q2-bg4.jpg');
        }

        .main-image {
            transform: scale(0.7) translate(310px, 270px);
        }

        &.active .main-image {
            transform: scale(0.6) translate(524px, 330px);
        }
    }

    &[data-index="4"] {
        clip-path: inset(0 0 0 80%);

        .main-image .main {
            background-image: url('@images/q2-main5.png');
        }
        .main-image .content {
            background-image: url('@images/q2-bg5.jpg');
        }

        .main-image {
            transform: scale(0.7) translate(310px, 170px);
        }

        &.active .main-image {
            transform: scale(0.6) translate(524px, 330px);
        }
    }

    &.active {
        clip-path: inset(0 0 0 0);
        z-index: 10;

        .main-image .content {
            opacity: 1;
        }
    }
}

.active .close-button {
    visibility: visible;
    opacity: 1;
}

</style>