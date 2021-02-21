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

@font-face {
    font-family: "customFont";
    src: url("../fonts/font.ttf");
}

body {
    font-family: "customFont", serif;
    user-select: none;
    background-color: darkgray;
    overflow: hidden;
}
</style>