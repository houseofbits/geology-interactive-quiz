<template>
    <div class="frame" :class="{visible: selected}">
        <div class="title" :class="{visible:selected}">Paldies par spēli!</div>
        <div class="info">Pareizās atbildes {{ correctNum }} no 8</div>
    </div>
</template>

<script>
export default {
    name: "Quiz3FinalPage",
    props:{
        selected: {
            type: Boolean,
            required: true
        },
        pageAnswers: {
            type: Array,
            required: true
        },
    },
    computed: {
        correctNum() {
            return this.pageAnswers.filter(val => val===3).length;
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
    background-color: greenyellow;

    &.visible {
        visibility: visible;
    }

    .title {
        display: inline-block;
        color: gray;
        position:absolute;
        width:1024px;
        left:0;
        top: 220px;
        height:80px;
        text-align: center;
        font-size: 60px;
        line-height: 80px;
        text-shadow: 0 6px 20px rgba(0,0,0,0.7);
        background: linear-gradient(to bottom, rgba(180,221,180,1) 0%,rgba(101,196,0,1) 62%,rgba(0,138,0,1) 88%,rgba(0,87,0,1) 99%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0.0;
        transition: all linear 500ms;

        &.visible {
            opacity: 1.0;
        }
    }

    .info {
        position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 35px;
        line-height: 26px;
        top: 340px;
        padding-left: 40px;
        padding-right: 40px;
        color: #414141;
        text-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }
}
</style>