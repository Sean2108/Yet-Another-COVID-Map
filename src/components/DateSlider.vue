<template>
<div three-line>
    <p>From {{range[0]}} to {{range[1]}}</p>
  <v-range-slider
    v-model="range"
    :max="max"
    :min="min"
    hide-details
    three-line
    class="align-center"
  >
  </v-range-slider>
  </div>
</template>

<script>
export default {
    props: {
        min: Number,
        max: Number,
        range: Array
    }
};
</script>