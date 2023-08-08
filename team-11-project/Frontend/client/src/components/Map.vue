<template>
  <div class="overlay">
    <GmapMap
      ref="Gothenburg Map"
      :center="centerLocation"
      style="height: 85%; width: 45%; position: absolute; bottom: 0; z-index: 1"
      :zoom="zoom"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        rorationControl: true,
        disableDefaultUi: true,
        rotateControl: false,
        scaleControl: false,
        minZoom: 4
      }"
    >
      <!-- adding custom map marker tag & logic -->
      <gmap-marker
        :key="clinic.id"
        v-for="clinic in clinics"
        :position="clinic.coordinate"
        alignment="bottomright"
        @click="$emit('select-clinic', clinic)"
        :clickable="true"
        :icon="{ url: './assets/clinic.png' }"
      ></gmap-marker>

      <gmap-info-window
        @closeclick="closeWindow()"
        :opened="window_open"
        :position="infowindow"
        :options="{
          pixelOffset: {
            width: 0,
            height: -35
          },
          content: ''
        }"
      >
      </gmap-info-window>
    </GmapMap>
  </div>
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import mqtt from 'mqtt'

export default {
  name: 'Map',
  components: {},
  data() {
    return {
      zoom: 13,
      centerLocation: {
        lat: 57.70887 /* 57.7089° N, 11.9746° E , Gothenburg Coordinates */,
        lng: 11.97456
      },
      markers: [
        {
          label: 'A',
          position: { lat: 57.707619, lng: 11.969388 }
        },
        {
          label: 'B',
          position: { lat: 11.0, lng: 11.0 }
        }
      ],
      info_marker: null,
      infowindow: { lat: 57.707619, lng: 11.969388 },
      infowindow2: { lat: 57.685255, lng: 11.942625 },
      infowindow3: { lat: 57.709872, lng: 11.940386 },
      infowindow4: { lat: 57.694723, lng: 11.991153 },
      window_open: false,
      infoContent: '<p1> asdasdsda </p1>',

      components: {
        'gmap-custom-marker': GmapCustomMarker
      },
      clinics: [],
      currentLocation: null,
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
        topic: 'frontend/clinicData',
        qos: 1
      },
      publish: {
        topic: 'clinichandler/allClinicsData',
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
    // this.setLocationLatLng()
    this.destroyConnection() // Maybe remove this but the thought is to clear all conections and start fresh
    this.createConnection()
    this.doSubscribe()
    this.doPublish()
    /* Uncomment if mqtt is acting up and you want to text with clinics
    this.clinics = [
      {
        coordinate: { lat: 57.707619, lng: 11.969388 },
        openinghours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '08:00', close: '08:00' },
          wednesday: { open: '07:00', close: '07:00' },
          thursday: { open: '09:00', close: '09:00' },
          friday: { open: '09:00', close: '09:00' }
        },
        _id: '61b0d6290020d34e801b4849',
        id: '1',
        name: 'Your Dentist',
        owner: 'Dan Tist',
        dentists: 3,
        address: 'Spannmålsgatan 20',
        city: 'Gothenburg',
        __v: 0
      },
      {
        coordinate: { lat: 57.709872, lng: 11.940386 },
        openinghours: {
          monday: { open: '06:00', close: '15:00' },
          tuesday: { open: '08:00', close: '08:00' },
          wednesday: { open: '07:00', close: '07:00' },
          thursday: { open: '07:00', close: '07:00' },
          friday: { open: '08:00', close: '08:00' }
        },
        _id: '61b2133fdc601c35a4c6193d',
        id: '3',
        name: 'The Crown',
        owner: 'Carmen Corona',
        dentists: 2,
        address: 'Lindholmsallen 19',
        city: 'Gothenburg',
        __v: 0
      },
      {
        coordinate: { lat: 57.694723, lng: 11.991153 },
        openinghours: {
          monday: { open: '10:00', close: '18:00' },
          tuesday: { open: '10:00', close: '10:00' },
          wednesday: { open: '10:00', close: '10:00' },
          thursday: { open: '10:00', close: '10:00' },
          friday: { open: '10:00', close: '10:00' }
        },
        _id: '61b21345dc601c35a4c61940',
        id: '4',
        name: 'Lisebergs Dentists',
        owner: 'Glen Hysen',
        dentists: 3,
        address: 'Liseberg',
        city: 'Gothenburg',
        __v: 0
      },
      {
        coordinate: { lat: 57.685255, lng: 11.942625 },
        openinghours: {
          monday: { open: '07:00', close: '19:00' },
          tuesday: { open: '07:00', close: '07:00' },
          wednesday: { open: '07:00', close: '07:00' },
          thursday: { open: '07:00', close: '07:00' },
          friday: { open: '07:00', close: '07:00' }
        },
        _id: '61b2134fdc601c35a4c61943',
        id: '2',
        name: 'Tooth Fairy Dentist',
        owner: 'Tooth Fairy',
        dentists: 1,
        address: 'Slottskogen',
        city: 'Gothenburg',
        __v: 0
      }
    ] */
  },
  methods: {
    openWindow(gmp) {
      this.window_open = true
      this.infowindow = gmp
    },
    closeWindow() {
      this.window_open = false
    },
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
        if (topic === 'frontend/clinicData') {
          if (!(message.toString() === 'adsadas')) {
            // Something somewhere is sending this string and causing it all to crash. So we have to do this wierdo stuff
            const recMessage = message.toString().split('£')
            recMessage.forEach((element) => {
              this.clinics.push(JSON.parse(element))
            })
          }
        }
        console.log('clinics')
        console.log(this.clinics)
      })
    },
    doPublish() {
      const { topic, qos } = this.publish
      this.client.publish(topic, 'Give clinics', qos, (error) => {
        if (error) {
          console.log('Publish error', error)
        } else {
          console.log('Published')
        }
      }) // `{ "msg": "${this.value.toString()} 9:30 ${publishMessage}" }`
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
} /* "height: 85%; width: 70%; position: fixed; bottom: 0; z-index: -1" */
</script>

<style>
#sidebar-no-header-title {
  color: blue;
}
@media screen and (max-width: 800px) {
  .overlay {
    display: none;
  }
}
</style>
