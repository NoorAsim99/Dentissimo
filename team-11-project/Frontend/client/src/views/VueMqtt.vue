<template>
  <div class="container">
    <div class="col-md-3"></div>
    <div id="registerPage col-md-6">
      <h4>{{ message }}</h4>
      <h4>{{ client.connected }}</h4>
      <b-button class="w700" id="registerButton" v-on:click="createConnection()"
        >CONNECT</b-button
      >
      <b-button
        class="w700"
        id="registerButton"
        v-on:click="destroyConnection()"
        >DISCONNECT</b-button
      >
      <b-button class="w700" id="registerButton" v-on:click="doSubscribe()"
        >SUBSCRIBE</b-button
      >
      <b-button class="w700" id="registerButton" v-on:click="doPublish()"
        >PUBLISH</b-button
      >
    </div>
    <div class="col-md-3"></div>
  </div>
</template>

<script>
export default {
  name: 'Booking',
  components: {},
  data() {
    return {
      office: ''
    }
  },
  mounted() {
    this.$mqtt.on('close', (err) => {
      if (err) console.log(err)
      console.log('close')
      this.$mqtt.unsubscribe('dentistimo/dentists/dentist')
    })
    this.$mqtt.on('offline', (err) => {
      if (err) console.log(err)
      console.log('offline')
      this.$mqtt.unsubscribe('dentistimo/dentists/dentist')
    })
    this.$mqtt.on('connect', (connack) => {
      if (connack.sessionPresent === false) {
        this.$mqtt.publish(
          'dentistimo/dentistoffice',
          JSON.stringify({ method: 'getOne', id: `${this.$route.params.id}` }),
          1
        )
        this.$mqtt.subscribe('dentistimo/dentists/dentist')
      }
    })
  },
  mqtt: {
    // Retrieves the data from a specific dentist office.
    'dentistimo/dentists/dentist'(data) {
      const jsonData = JSON.parse(data)
      if (jsonData != null) {
        this.office = jsonData
      } else {
        console.log('empty jsonString recieved')
        const message =
          'empty mqtt jsonString sent to bookingGUI via the broker. on topic: dentistimo/dentists '
        this.$mqtt.publish('dentistimo/log/error', message, 2)
      }
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
</style>
