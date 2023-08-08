<template>
  <div id="container">
    <div class="left">
      <h1 class="align whiteColor w700">
        Dental care<br>for everyone.
      </h1>
      <h5 class="align margin whiteColor w500">
            We are committed to providing<br>you with the best help possible.
      </h5>
      <router-link class="book_btn w700" to="/dashboard">Book appointment</router-link>
    </div>
    <div class="right">
      <div>
      <img class="banner" src="assets/Banner1.png" alt="Banner1" />
      </div>
      <div>
      <img class="banner" src="assets/Banner2.png" alt="Banner2" />
      </div>
    </div>
</div>
</template>

<script scoped>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then((response) => {
          this.message = response.data.message
        })
        .catch((error) => {
          this.message = error
        })
    }
  }
}
</script>

<style scoped>
#container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 56em;
  margin: 0em 8em;
}

.left {
  /* NOT WORKING????? */
  justify-content: left;
  margin-bottom: 4em;
}
.right {
  position: relative;
}

.align {
  text-align: left;
}

.margin {
  margin-bottom: 1.5em;
}

.whiteColor{
  color: white;
}

.book_btn {
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  border: 2px solid white;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}

.banner {
    max-width: 90%;
    height: auto;
    margin: 0.5em 0;
  }
</style>
