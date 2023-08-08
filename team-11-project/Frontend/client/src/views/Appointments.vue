<template>
  <div>
    <p>{{ this.user.email }}</p>
    <b-button class="w700" id="bookingButton" v-on:click="doPublish()"
      >Refresh</b-button
    >
    <span v-if="client.connected" class="dotGreen"></span>
    <span v-else class="dotRed"></span>
    <div v-for="appointment in appointments" v-bind:key="appointment._id">
      <appointment-item
        v-bind:appointment="appointment"
        v-on:del-appointment="deleteAppointment"
      />
    </div>
  </div>
</template>

<script>
import AppointmentItem from '../components/AppointmentItem.vue'
import { Api } from '@/Api'
import mqtt from 'mqtt'

export default {
  name: 'appointments',
  components: {
    'appointment-item': AppointmentItem
  },
  data() {
    return {
      user: {
        email: '',
        isDentist: false
      },
      appointments: [],
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
        topic: 'frontend/patientbooking',
        qos: 1
      },
      publish: {
        topic: 'bookinghandler/patientbooking',
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
  mounted() {
    this.destroyConnection() // Maybe remove this but the thought is to clear all conections and start fresh
    this.createConnection()
    this.doSubscribe()
    this.doPublish()
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
        // this.receiveNews = this.receiveNews.concat(message)
        console.log('news')
        // console.log(`Received message ${message} from topic ${topic}`)
        if (topic === 'frontend/patientbooking' && message.length > 0) {
          if (!(message.toString() === 'adsadas')) {
            // Something somewhere is sending this string and causing it all to crash. So we have to do this wierdo stuff
            this.appointments = []
            const recMessage = message.toString().split('£')
            console.log(recMessage)
            recMessage.forEach((element) => {
              this.appointments.push(JSON.parse(element))
            })
          }
        }
      })
    },
    doPublish() {
      const { topic, qos } = this.publish
      console.log(`{ "patient": "${this.user.email}" }`)
      this.client.publish(
        topic,
        `{ "patient": "${this.user.email}" }`,
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
    deleteAppointment(id) {
      const { qos } = this.publish
      this.client.publish(
        'bookinghandler/deletebooking',
        `${id}`,
        qos,
        (error) => {
          if (error) {
            console.log('Publish error', error)
          } else {
            console.log('Published')
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.dotRed {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: red;
  display: inline-block;
}
.dotGreen {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: green;
  display: inline-block;
}
</style>
