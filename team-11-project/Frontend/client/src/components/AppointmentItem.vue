<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-6">
        <div class="booking">
          <div class="textPart">
            <p class="w700">{{ appointment.date.day }}/{{ appointment.date.month }}/{{ appointment.date.year }} - {{ appointment.time }}</p>
            <p class="w500">{{ appointment.clinic }}</p>
          </div>
          <b-button
            class="w700"
            id="cancelButton"
            v-on:click="$emit('del-appointment', appointment._id)"
            >Cancel</b-button
          >
        </div>
      </div>
      <div class="col-md-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'appointment-item',
  props: ['appointment']
}
</script>

<style scoped>
.booking {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: white;
  width: 30em;
  padding: 2em;
  border-radius: 20px;
  margin: 1em;
}
#cancelButton {
    background-color: red;
    height: 2.5em;
}
</style>
