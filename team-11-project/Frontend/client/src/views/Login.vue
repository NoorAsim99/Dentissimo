<template>
  <div class="container">
    <div class="col-md-3"></div>
    <div id="registerPage col-md-6">
      <div id="registerBox">
        <h2 class="w700">Welcome back</h2>
        <h9 class="w300 alreadyHave"
          >Don't have an account?
          <router-link :to="{ name: 'register' }">Sign up</router-link></h9
        >
        <div>
          <input class="shortFormLeft" v-model="email" placeholder="E-mail" />
          <p1 class="w300">or</p1>
          <input class="shortFormRight" v-model="ssn" placeholder="SSN" />
        </div>

        <div>
          <input
            class="longForm"
            v-model="password"
            type="password"
            placeholder="Password"
          />
        </div>

        <p v-if="errorMessage !== ''" id="errorMessage">{{ errorMessage }}</p>

        <b-button class="w700" id="registerButton" v-on:click="login()"
          >Sign in</b-button
        >
      </div>
    </div>
    <div class="col-md-3"></div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'login',
  data() {
    return {
      email: '',
      ssn: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    login() {
      if ((this.email === '' || this.ssn === '') && this.password === '') {
        this.errorMessage = 'Error message'
      } else {
        this.errorMessage = ''
        Api.get('/users/' + this.email + '/' + this.password)
          .then((response) => {
            console.log(response)
            console.log('Logged in user user')
            console.log(response.data.email)

            window.$cookies.set('cookie_password', this.password)
            window.$cookies.set('cookies_email', this.email)
            this.$router.push({ name: 'dashboard' })
          })
          .catch((error) => {
            console.log('Error: ' + error)
          })
      }
    },
    validateEmail() {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(this.email).toLowerCase())
    }
  }
}
</script>

<style scoped>
#registerPage {
  background-color: white;
  width: 30em;
  padding: 2em;
  border-radius: 20px;
}
.container {
  background-color: white;
  font-family: 'Montserrat', sans-serif;
  width: 30em;
  padding: 2em;
  border-radius: 20px;
  margin-top: 3em;
}
#registerButton {
  background: rgba(83, 154, 242, 1);
  width: 25em;
  height: 2.75em;
  margin-top: 1em;
  border-radius: 15px;
}
#errorMessage {
  color: rgb(233, 45, 49);
  margin-top: 0.5em;
}
.alreadyHave {
  margin-bottom: 0.5em;
}
.longForm {
  border: 1px solid gray;
  width: 24em;
  height: 2.25em;
  margin-top: 0.5em;
  padding: 1em;
  border-radius: 15px;
}
.shortFormLeft {
  border: 1px solid gray;
  width: 11.25em;
  height: 2.25em;
  margin-top: 0.5em;
  margin-right: 0.25em;
  padding: 1em;
  border-radius: 15px;
}
.shortFormRight {
  border: 1px solid gray;
  width: 11.25em;
  height: 2.25em;
  margin-top: 0.5em;
  margin-left: 0.25em;
  padding: 1em;
  border-radius: 15px;
}
</style>
