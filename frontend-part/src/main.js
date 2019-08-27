import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { BAlert, BSpinner } from 'bootstrap-vue';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './styles/styles.scss';

Vue.use(BootstrapVue);
Vue.component('b-alert', BAlert);
Vue.component('b-spinner', BSpinner);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
