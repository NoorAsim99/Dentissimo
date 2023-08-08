<template>
  <div class="container">
    <div class="col-md-3"></div>
    <div id="registerPage col-md-6">
      <h4> {{ message }} </h4>
      <h4> {{ client.connected }} </h4>
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
import mqtt from 'mqtt'
/* THIS IS JUST FOR TESTING IF MQTT WORKS, NOT ACTUALLY GOING TO USE THIS VIEW */
export default {
  data() {
    return {
      message: 'msg',
      connection: {
        host: 'broker.emqx.io', // broker.emqx.io
        port: 8083, // 8083
        endpoint: '/mqtt', // /mqtt
        clean: true, // Reserved session
        connectTimeout: 1000, // Time out
        reconnectPeriod: 0, // Reconnection interval
        // Certification Information
        clientId: 'mqttjs_3be2c321', // mqttjs_3be2c321
        username: 'emqx_test', // emqx_test
        password: 'emqx_test' // emqx_test
      },
      subscription: {
        topic: 'topic/browser',
        qos: 0
      },
      publish: {
        topic: 'topic/browser',
        qos: 0,
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
        console.log(`Received message ${message} from topic ${topic}`)
      })
    },
    doPublish() {
      const { topic, qos, payload } = this.publish
      this.client.publish(topic, payload, qos, (error) => {
        if (error) {
          console.log('Publish error', error)
        } else {
          console.log('Published' + payload)
        }
      })
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
