import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router'
import MainApp from './MainApp.vue';
import IndexView from './gui/IndexView.vue';
import DetectorView from './gui/DetectorView.vue';
import Quiz1View from './gui/Quiz1View.vue';
import Quiz2View from './gui/Quiz2View.vue';
import Quiz3View from './gui/Quiz3View.vue';
import IOView from './gui/IOView.vue';
import MainSceneInstance from './scene/MainInstance';
import fontawesome from '@fortawesome/fontawesome-free/css/all.css';

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
    ]
});

if(document.getElementById('gui')) {
    new Vue({
        el: "#gui",
        router: router,
        render: h => h(MainApp)
    });
}