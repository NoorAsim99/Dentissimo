<template>
  <div class="container">
    <div class="col-md-3"></div>
    <div id="registerPage col-md-6">
      <div id="registerBox">
        <h4 class="w700">Select Break Type :</h4>
        <b-button
          variant="dark"
          v-b-tooltip.hover
          title="60min Break"
          class="w600"
          v-on:click="setLunch()"
          >Lunch</b-button
        >
        <b-button
          variant="warning"
          v-b-tooltip.hover
          title="30min Break"
          class="w600"
          v-on:click="setFika()"
          >Fika</b-button
        >
        <p class="breakSpacing w500">{{ this.break }} is selected</p>
        <div>
          <br />
          <h6 class="w700">Select Date / Time :</h6>
          <b-form-datepicker
            v-model="value"
            id="select-date"
            today-button
            reset-button
            close-button
            locale="en"
            @context="onClick"
          ></b-form-datepicker>
          <br />
          <div v-if="value !== ''">
               <div v-if="this.break == 'Lunch'">
              <div
                v-for="availableTime in availableLunchTimes"
                v-bind:key="availableTime"
              >
                <div class="margin">
                  <b-button
                    v-if="selectedTime == availableTime"
                    variant="success"
                    class="register_btn"
                    v-on:click="selectTime(availableTime)"
                    >{{ availableTime }}</b-button
                  >
                  <b-button
                    v-else
                    class="register_btn"
                    v-on:click="selectTime(availableTime)"
                    >{{ availableTime }}</b-button
                  >
                </div>
              </div>
            </div>
            <div v-if="this.break == 'Fika'">
              <div
                v-for="availableTime in availableFikaTimes"
                v-bind:key="availableTime"
              >
                <div class="margin">
                  <b-button
                    v-if="selectedTime == availableTime"
                    variant="success"
                    class="register_btn"
                    v-on:click="selectTime(availableTime)"
                    >{{ availableTime }}</b-button
                  >
                  <b-button
                    v-else
                    class="register_btn"
                    v-on:click="selectTime(availableTime)"
                    >{{ availableTime }}</b-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3"></div>
    <br />
    <b-button class="w700" id="bookingButton" v-on:click="doPublish()"
      >Book The Break</b-button
    >
    <p>
      {{ this.breakBooked }}
    </p>
  </div>
</template>

<script>
import { Api } from '@/Api'
import mqtt from 'mqtt'

export default {
  name: 'bookingView',
  props: ['clinicName'],
  data() {
    return {
      user: {
        email: '',
        isDentist: false
      },
      break: 'Lunch',
      breakTopic: 'fikahandler/lunchbreak',
      breakBooked: '',
      date: '',
      value: '',
      selectedTime: '',
      text: '',
      dentists: '0',
      availableFikaTimes: [
        '9:00 - 9:30',
        '9:30 - 10:00',
        '10:00 - 10:30',
        '10:30 - 11:00',
        '11:00 - 11:30',
        '11:30 - 12:00'
      ],
      availableLunchTimes: ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'],
      message: 'msg',
      connection: {
        host: 'xba005c0.eu-central-1.emqx.cloud', // broker.emqx.io
        port: 8083, // 8083
        endpoint: '/mqtt', // /mqtt
        clean: true, // Reserved session
        connectTimeout: 10000000, // Time out
        reconnectPeriod: 10000000, // Reconnection interval
        keepAlive: 10000000, // Keeps it alive so it doesnt reconnect
        // Certification Information
        clientId: 'mqttjs_3be2c321', // mqttjs_3be2c321
        username: 'dentistimo', // emqx_test
        password: 'Team11GU' // emqx_test
      },
      subscription: {
        topic: 'fikahandler/approval',
        qos: 1
      },
      publish: {
        topic: 'fikahandler/lunchbreak',
        qos: 1,
        payload: '{ "msg": "Hello, I am browser." }'
      },
      receiveNews: '',
      qosList: [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 }
      ],
      client: {
        connected: false
      },
      subscribeSuccess: false
    }
  },
  computed: {
    dynamicStyle() {
      return {
        // in the case of redComp, greenComp and blueComp are a vue prop or data
        color: `rgb(${this.redComp}, ${this.greenComp}, ${this.blueComp});`
      }
    }
  },
  mounted() {
    this.destroyConnection() // Maybe remove this but the thought is to clear all conections and start fresh
    this.createConnection()
    this.doSubscribe()
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
    // Create connection
    createConnection() {
      // Connect string, and specify the connection method used through protocol
      // ws unencrypted WebSocket connection <-
      // wss encrypted WebSocket connection
      // mqtt unencrypted TCP connection
      // mqtts encrypted TCP connection
      // wxs WeChat mini app connection
      // alis Alipay mini app connection
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      console.log(connectUrl)
      console.log(options)
      try {
        this.client = mqtt.connect(connectUrl, options) // connectUrl, options
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      this.client.on('error', (error) => {
        console.log('Connection failed', error)
      })
      this.client.on('message', (topic, message) => {
        this.receiveNews = this.receiveNews.concat(message)
        this.breakBooked = message
        console.log(`Received message ${message} from topic ${topic}`)
      })
    },
    doPublish() {
      const { qos } = this.publish
      const dateDate = new Date(this.value.toString())
      this.client.publish(
        this.breakTopic,
        `{
          "date": { "year": ${dateDate.getFullYear()}, "month": ${
          dateDate.getMonth() + 1
        }, "day": ${dateDate.getDate()} },
          "time": "${this.selectedTime}",
          "dentist": "${this.user.email}"
        }`,
        qos,
        (error) => {
          if (error) {
            console.log('Publish error', error)
          } else {
            console.log('Published')
          }
        }
      ) // `{ "msg": "${this.value.toString()} 9:30 ${publishMessage}" }`
    },
    doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
      })
    },
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end()
          this.client = {
            connected: false
          }
          console.log('Successfully disconnected!')
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },
    onClick(ctx) {
      this.date = ctx.selectedFormatted
    },
    setFika() {
      this.break = 'Fika'
      this.breakTopic = 'fikahandler/fikabreak'
    },
    setLunch() {
      this.break = 'Lunch'
      this.breakTopic = 'fikahandler/lunchbreak'
    },
    selectTime(time) {
      this.selectedTime = time
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
.margin {
  margin-bottom: 1.5em;
}
.register_btn {
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 50px;
  border: 2px solid black;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}
#bookingButton {
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
.w600 {
  margin-left: 5em;
  width: 15em;
  height: 2.75em;
  margin-top: 1em;
  border-radius: 15px;
}
.breakSpacing {
  margin: 2em 8em;
}
</style>
