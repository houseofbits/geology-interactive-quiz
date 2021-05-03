<template>
    <div class="tag">
        <slot></slot>
        <div class="inner">
            <i class="far fa-question-circle"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: "ElementTag",
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

    .inner {
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
        i {
            font-size: 50px;
            background: linear-gradient(to bottom, rgba(255,116,0,1) 0%,rgba(242,72,0,1) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
}
</style>