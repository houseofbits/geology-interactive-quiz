<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: "MainApp"
}
</script>

<style lang="scss">

@import "~/bootstrap/bootstrap.scss";

html {
    touch-action: none;
}

body {
    font-family: Arimo;
    user-select: none;
    background-color: darkgray;
    overflow: hidden;
    // cursor: none;
}
</style>