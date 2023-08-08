<template>
  <!-- Since if the server crashes or cannot connect to mongodb it will not immediately send back a 404 response, an unathorized user could gain access to the page for a short while. This v-if makes sure that at least nothing is rendered on the page in that case. Not as nice as immediately kicking the user back to the home page but works fine for now. -->
  <div v-if="user.email!=''" id="container">
    <div class="left">
      <booking-view v-bind:clinicName="selectedClinic" />
      <!-- <div>
        <b-button class="w700" id="bookingButton">My bookings</b-button>
      </div> -->
    </div>
    <div class="right">
      <map-view v-on:select-clinic="selectClinic" />
    </div>
    <div class="position-absolute top-100 start-50 translate-middle">
      <b-button id="sidebarButton" v-b-toggle.sidebar-no-header
        ><b>Menu</b></b-button
      >

      <b-sidebar
        id="sidebar-no-header"
        bg-variant="dark"
        aria-labelledby="sidebar-no-header-title"
        no-header
        shadow
      >
        <template #footer="{ hide }">
          <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
            <b-button variant="warning" size="sm" @click="hide"
              ><b>Close</b></b-button
            >
          </div>
        </template>

        <div class="px-3 py-3 text-left align-items-left">
          <h4 id="sidebar-no-header-title"><b></b></h4>
          <br />
          <!--Avatar icon to show signed in user & info-->
          <b-avatar
            v-b-tooltip.hover
            title="Account info"
            button
            @click="onClick"
            pill
            variant="warning"
            class="avatar"
          ></b-avatar>
          <span class="avatar-text"
            ><b>User :{{ user.email }} </b></span
          >

          <b-button
            v-b-tooltip.hover
            title="Manage appointments"
            block
            id="sidebarButton"
            size="md"
            v-on:click="$router.push('/appointments') "
            ><b>My appointments</b></b-button
          >
          <b-button
          v-if="user.isDentist==true"
            v-b-tooltip.hover
            title="Book Fika"
            block
            id="sidebarButton"
            size="md"
            v-on:click="$router.push('/fika') "
            ><b>Fika</b></b-button
          >
        </div>
      </b-sidebar>
    </div>
  </div>
</template>

<script>
import { Api } from '@/Api'
import Booking from '../components/Booking.vue'
import Map from '../components/Map.vue'

export default {
  name: 'home',
  components: {
    'booking-view': Booking,
    'map-view': Map
  },
  data() {
    return {
      user: {
        email: '',
        isDentist: false
      },
      selectedClinic: 'No clinic selected'
    }
  },
  created() {
    const cookiePass = window.$cookies.get('cookie_password')
    const cookieEmail = window.$cookies.get('cookies_email')
    console.log(cookiePass)
    console.log(cookieEmail)

    Api.get('/users/' + cookieEmail + '/' + cookiePass)
      .then((response) => {
        console.log(response)
        console.log('Logged in user')
        this.user.email = response.data.email
        this.user.isDentist = response.data.isDentist
      })
      .catch((error) => {
        console.log('Error: ' + error)
        /* If failed to authenticate, send user back to landing page */
        this.$router.push({ name: 'home' })
      })
  },
  methods: {
    getMessage() {},
    selectClinic(name) {
      this.selectedClinic = name
    },
    onClick() {
      this.$bvModal.msgBoxOk('Email Address : ', {
        title: 'Info',
        size: 'sm',
        buttonSize: 'md',
        okVariant: 'success',
        headerClass: 'p-1 border-bottom-1',
        footerClass: 'p-1 border-top-2'
      })
    }
  }
}
</script>

<style scoped>
.left {
  justify-content: left;
  float: left;
  margin-bottom: 4em;
  margin-right: 4em;
}
#container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  max-width: 50em;
  margin: 0em 2em;
}
#bookingButton {
  background: rgba(83, 154, 242, 1);
  width: 30em;
  height: 3em;
  margin-top: 1em;
  border-radius: 15px;
}
#sidebarButton {
  background: rgba(83, 154, 242, 1);
  border-radius: 15px;
}
#userText {
  color: white;
}
.avatar {
  margin-bottom: 1em;
}
.avatar-text {
  color: red;
  margin-left: 1em;
}
</style>
