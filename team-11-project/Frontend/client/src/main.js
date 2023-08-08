/* eslint-disable semi */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueCookies from 'vue-cookies' /* Cookies: https://www.npmjs.com/package/vue-cookies */
import * as VueGoogleMaps from 'vue2-google-maps' // Import google maps package
// import VueMqtt from 'vue-mqtt';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueCookies)

/*
Vue.use(VueMqtt, 'ws://localhost:1883/ws', {
  clientId: 'WebClient-' + parseInt(Math.random() * 100000)
}); */

Vue.config.productionTip = false
/* import google maps plugin */
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBQl5Nr7R5cNrPDLDf_ufwXup0V0znF7lM',
    libraries: 'places,drawing,visualization,Maps JavaScript'
  },
  installComponent: true
});

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
