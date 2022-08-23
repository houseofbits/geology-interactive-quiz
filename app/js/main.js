import "@style/font.css";
import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router'
import MainApp from './MainApp.vue';
import IndexView from './gui/IndexView.vue';
import DetectorView from './gui/DetectorView.vue';
import DetectorV2View from './gui/DetectorV2View.vue';
import Quiz1View from './gui/Quiz1View.vue';
import Quiz1ViewV2 from './gui/Quiz1ViewV2.vue';
import Quiz2View from './gui/Quiz2View.vue';
import Quiz3View from './gui/Quiz3View.vue';
import IOView from './gui/IOView.vue';
import fontawesome from '@fortawesome/fontawesome-free/css/all.css';
import MultiTouchView from "./gui/MultiTouchView.vue";
import TouchErrorView from "@js/gui/TouchErrorView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: "/",
    routes: [
        {
            path: "/",
            name: "Index",
            component: IndexView,
        },
        {
            path: "/detector",
            name: "DetectorView",
            component: DetectorView,
        },
        {
            path: "/detector2",
            name: "DetectorV2View",
            component: DetectorV2View,
        },
        {
            path: "/quiz1",
            name: "Quiz1View",
            component: Quiz1View,
        },
        {
            path: "/quiz2",
            name: "Quiz2View",
            component: Quiz2View,
        },
        {
            path: "/quiz3",
            name: "Quiz3View",
            component: Quiz3View,
        },
        {
            path: "/io",
            name: "IOView",
            component: IOView,
        },
        {
            path: "/touch",
            name: "Touch",
            component: MultiTouchView,
        },
        {
            path: "/error",
            name: "TouchErrorView",
            component: TouchErrorView,
        },
    ]
});

if(document.getElementById('gui')) {
    new Vue({
        el: "#gui",
        router: router,
        render: h => h(MainApp)
    });
}