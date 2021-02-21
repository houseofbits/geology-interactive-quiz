import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router'
import MainApp from './MainApp.vue';
import MainView from './gui/MainView.vue';
import Quiz1View from './gui/Quiz1View.vue';
import Quiz2View from './gui/Quiz2View.vue';
import Quiz3View from './gui/Quiz3View.vue';
import MainSceneInstance from './scene/MainInstance';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "Main",
            component: MainView,
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
    ]
});

if(document.getElementById('gui')) {
    new Vue({
        el: "#gui",
        router: router,
        render: h => h(MainApp)
    });
}