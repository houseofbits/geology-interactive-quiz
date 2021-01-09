<template>
    <div class="MainView">
        {{ message }}
    </div>
</template>

<script>
    export default {
        name: 'MainView',
        computed: {
            message() {
                return 'Gui Layer';
            }
        }
    };
</script>

<style>
@font-face {
    font-family: "customFont";
    src: url("../../fonts/font.ttf");
}

body {
    font-family: "customFont", serif;
    user-select: none;
    background-color: darkgray;
    /*overflow: hidden;*/
}
</style>