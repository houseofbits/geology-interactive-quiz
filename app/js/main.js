import 'bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router'
import MainApp from './MainApp.vue';
import MainView from './gui/MainView.vue';
import MainSceneInstance from './scene/MainInstance';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "Main",
            component: MainView,
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