import 'bootstrap';
import Vue from 'vue';
import MainView from './gui/MainView.vue';
import MainSceneInstance from './scene/MainInstance';

if(document.getElementById('gui')) {
    const AppRoot = Vue.extend(MainView);
    new AppRoot({
        el: '#gui'
    });
}