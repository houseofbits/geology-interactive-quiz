<template>
    <div class="frame clip-column" :data-index="index" @click="toggle" :class="{active: on}">
        <div class="main-image">
            <div class="main"></div>
            <div class="content"></div>
        </div>
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
            on: false
        };
    },
    methods: {
        toggle() {
            this.on = !this.on;
            this.$emit('click', this.on, this.index);
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
    background: linear-gradient(to bottom, rgba(255, 255, 160, 1) 0%, rgba(255, 255, 255, 1) 72%);

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
            background-image: url('@images/q2-bg1.jpg');
            transition: all linear 400ms;
        }

        .content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('@images/q2-bg1.jpg');
            filter: grayscale(100%);
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
            background-image: url('@images/q2-bg1.jpg');
        }
        .main-image .content {
            background-image: url('@images/q2-bg1.jpg');
        }
        &.active .main-image {
            transform: scale(0.5) translate(50px, 50px);
        }
    }

    &[data-index="1"] {
        clip-path: inset(0 60% 0 20%);

        .main-image .main {
            background-image: url('@images/q2-bg2.jpg');
        }

        .main-image .content {
            background-image: url('@images/q2-bg2.jpg');
        }

        .main-image {
            //top: 100px;
        }

        &.active .main-image {
            transform: scale(0.5) translate(50px, 50px);
        }
    }

    &[data-index="2"] {
        clip-path: inset(0 40% 0 40%);

        .main-image .main {
            background-image: url('@images/q2-bg3.jpg');
        }
        .main-image .content {
            background-image: url('@images/q2-bg3.jpg');
        }
        &.active .main-image {
            transform: scale(0.5) translate(50px, 50px);
        }
    }

    &[data-index="3"] {
        clip-path: inset(0 20% 0 60%);

        .main-image .main {
            background-image: url('@images/q2-bg4.jpg');
        }
        .main-image .content {
            background-image: url('@images/q2-bg4.jpg');
        }
        &.active .main-image {
            transform: scale(0.5) translate(50px, 50px);
        }
    }

    &[data-index="4"] {
        clip-path: inset(0 0 0 80%);

        .main-image .main {
            background-image: url('@images/q2-bg5.jpg');
        }
        .main-image .content {
            background-image: url('@images/q2-bg5.jpg');
        }
        &.active .main-image {
            transform: scale(0.5) translate(50px, 50px);
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


</style>