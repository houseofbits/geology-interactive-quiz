<template>
    <div>
        <div class="bg2" :data-selected="selected"></div>
        <div class="bg1" :data-selected="selected"></div>

        <div v-for="(status, index) in items" class="pug" :data-index="index" :data-status="status">
            <i class="far fa-check-circle"></i>
            <i class="far fa-times-circle"></i>
            <i class="far fa-question-circle"></i>
        </div>

        <div v-for="(i, index) in 7" class="line" :data-index="index"></div>

    </div>
</template>

<script>
export default {
    name: "Quiz3Navigator",
    props: {
        items: {
            type: Array,
            required: true
        },
        selected: {
            type: Number,
            required: true
        },
    }
}
</script>

<style lang="scss" scoped>
.bg1 {
    position: absolute;
    width: 2877px;
    height: 309px;
    bottom: 0;
    left: 0;
    background-image: url('@images/bg1.png');
    transition: all ease-in-out 1000ms;

    @for $i from 0 through 8 {
        &[data-selected="#{$i}"] {
            left: - $i * 200px;
        }
    }
}

.bg2 {
    position: absolute;
    width: 2877px;
    height: 309px;
    bottom: 0;
    left: 0;
    background-image: url('@images/bg2.png');
    opacity: 0.4;
    transition: all ease-in-out 1000ms;

    @for $i from 0 through 8 {
        &[data-selected="#{$i}"] {
            left: - $i * 100px;
        }
    }
}
.pug {
    position: absolute;
    bottom:35px;
    left: 100px;
    width:60px;
    height: 60px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 15px 37px 5px rgba(0,0,0,0.5);
    transform: scale(1.0);
    transition: all ease-in-out 500ms;

    i {
        left: 3px;
        top: 3px;
        font-size: 54px;
        color: black;
        position: absolute;

        &.fa-question-circle {
            display:none;
            color:rgba(255,255,255,0.8);
        }
        &.fa-times-circle {
            display:none;
            color: rgba(255,180,180,0.8);
        }
        &.fa-check-circle {
            display:none;
            color: rgba(180,255,180,0.8);
        }
    }

    &[data-status="0"] {
        background-color: rgba(255,255,255,0.5);
        transform: scale(0.8);
        .fa-question-circle {
            display:inline;
        }
    }
    &[data-status="1"] {
        transform: scale(1.2);
    }
    &[data-status="2"] {
        background-color: rgba(255,0,0,0.5);
        .fa-times-circle {
            display:inline;
        }
    }
    &[data-status="3"] {
        background-color: rgba(0,255,0,0.5);
        .fa-check-circle {
            display:inline;
        }
    }
}

@for $i from 0 through 7 {
    [data-index="#{$i}"] {
        left: 130px + $i * 100px;
    }
}

.line {
    width: 40px;
    height: 4px;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.6) 50%,rgba(255,255,255,0) 100%);
    position: absolute;
    bottom: 63px;

    @for $i from 0 through 7 {
        &[data-index="#{$i}"] {
            left: 190px + $i * 100px;
        }
    }
}

.icon{
    left: 3px;
    top: 3px;
    font-size: 54px;
    color: black;
    position: absolute;
}
</style>