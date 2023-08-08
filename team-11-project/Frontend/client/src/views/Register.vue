<template>
  <div class="container">
    <div class="col-md-3"></div>
    <div id="registerPage col-md-6">
      <div id="registerBox">
        <h2 class="w700">Create account</h2>
        <h9 class="w300 alreadyHave"
          >Already have an account?
          <router-link :to="{ name: 'login' }">Log in</router-link></h9
        >

        <div>
          <input
            class="longForm"
            for="email"
            type="email"
            placeholder="E-mail"
            required
            v-model="email"
            @blur="validateEmail"
          />
        </div>

        <div>
          <input
            class="shortFormLeft"
            v-model="fName"
            placeholder="First name"
          />
          <input
            class="shortFormRight"
            v-model="lName"
            placeholder="Last name"
          />
        </div>

        <div>
          <input class="longForm" v-model="ssn" placeholder="SSN" />
        </div>

        <div>
          <input
            class="longForm"
            v-model="password"
            placeholder="Password"
            type="password"
            description="We'll never share your data with anyone else."
          />
        </div>

        <p v-if="errorMessage !== ''" id="errorMessage">{{ errorMessage }}</p>

        <b-form-group
          description="We'll never share your data with anyone else."
        >
          <b-button class="w700" id="registerButton" v-on:click="register()"
            >Sign up</b-button
          >
        </b-form-group>
      </div>
    </div>
    <div class="col-md-3"></div>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  name: 'register',
  data() {
    return {
      email: '',
      fName: '',
      lName: '',
      ssn: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    register() {
      if (
        this.email === '' ||
        this.fName === '' ||
        this.lName === '' ||
        this.ssn === '' ||
        this.password === ''
      ) {
        this.errorMessage = 'Please fill out all fields'
      } else if (this.password.length < 8) {
        this.errorMessage = 'Password must be at least 8 characters long'
      } else if (!this.validateEmail()) {
        this.errorMessage = 'Please enter a valid email address'
      } else {
        this.errorMessage = ''

        const data = {
          name: {
            firstName: this.fName,
            lastName: this.lName
          },
          email: this.email,
          password: this.password,
          SSN: 1234567890,
          isDentist: true
        }
        Api.post('/users', data)
          .then((response) => {
            console.log(response)
            console.log('POSTed user')
            window.$cookies.set('cookie_password', this.password)
            window.$cookies.set('cookies_email', this.email)
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
  width: 25em;
  height: 2.25em;
  margin-top: 0.5em;
  padding: 1em;
  border-radius: 15px;
}
.shortFormLeft {
  border: 1px solid gray;
  width: 12.25em;
  height: 2.25em;
  margin-top: 0.5em;
  margin-right: 0.25em;
  padding: 1em;
  border-radius: 15px;
}
.shortFormRight {
  border: 1px solid gray;
  width: 12.25em;
  height: 2.25em;
  margin-top: 0.5em;
  margin-left: 0.25em;
  padding: 1em;
  border-radius: 15px;
}
</style>
