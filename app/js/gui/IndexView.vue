<template>
    <div class="screen">
        <div class="container h-100">
            <div class="row h-100">
                <div class="col-sm bg-dark"></div>
                <div class="col-sm text-center bg-dark d-grid gap-2 p-5">
                    <router-link class="btn btn-lg btn-success d-flex align-items-center justify-content-center"
                                 to="/quiz1">
                        Izvēlies pareizo iezi
                    </router-link>
                    <router-link class="btn btn-lg btn-success d-flex align-items-center justify-content-center"
                                 to="/quiz2">
                        Atpazīsti vietas
                    </router-link>
                    <router-link class="btn btn-lg btn-success d-flex align-items-center justify-content-center"
                                 to="/quiz3">
                        Pievieno pareizo nosaukumu
                    </router-link>
<!--                    <router-link class="btn btn-lg btn-primary d-flex align-items-center justify-content-center"-->
<!--                                 to="/detector">-->
<!--                        Detector test-->
<!--                    </router-link>-->
                    <!-- <router-link class="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                                 to="/detector2">
                        Detector
                    </router-link> -->
                    <router-link class="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                                 to="/io">
                        IO Test
                    </router-link>
                    <!-- <router-link class="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                                 to="/touch">
                        Multitouch
                    </router-link>
                    <router-link class="btn btn-lg btn-primary d-flex align-items-center justify-content-center"
                                 to="/error">
                        Error regions
                    </router-link> -->
                </div>
                <div class="col-sm bg-dark"></div>
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