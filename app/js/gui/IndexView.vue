<template>
    <div class="screen">
        <div class="container h-100">
            <div class="row h-100">
                <div class="col-sm"></div>
                <div class="col-sm text-center bg-dark">
                    <router-link class="btn btn-lg btn-success mt-5 btn-block" to="/quiz1">Quiz #1</router-link>
                    <router-link class="btn btn-lg btn-success mt-5 btn-block" to="/quiz2">Quiz #2</router-link>
                    <router-link class="btn btn-lg btn-success mt-5 btn-block" to="/quiz3">Quiz #3</router-link>
                    <router-link class="btn btn-lg btn-primary mt-5 btn-block" to="/detector">Detector test
                    </router-link>
                    <router-link class="btn btn-lg btn-primary mt-5 btn-block" to="/io">IO Test</router-link>
                </div>
                <div class="col-sm"></div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "IOView",
    data() {
        return {};
    },
    computed: {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.screen {
    position: absolute;
    width: 1024px;
    height: 768px;
}
</style>