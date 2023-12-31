import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Mqtt from './views/Mqtt.vue'
import VueMqtt from './views/VueMqtt.vue'
import Appointments from './views/Appointments.vue'
import Fika from './views/Fika.vue'

Vue.use(Router)
/* Routes */
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/mqtt',
      name: 'mqtt',
      component: Mqtt
    },
    {
      path: '/vuemqtt',
      name: 'vuemqtt',
      component: VueMqtt
    },
    {
      path: '/appointments',
      name: 'appointments',
      component: Appointments
    },
    {
      path: '/fika',
      name: 'fika',
      component: Fika
    }

  ]
})
