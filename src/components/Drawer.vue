<template>
  <v-navigation-drawer
    v-model="drawer"
    :color="color"
    :expand-on-hover="expandOnHover"
    :mini-variant="miniVariant"
    :right="right"
    :width="500"
    absolute
    dark
  >
    <v-list nav three-line>
        <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-counter</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Statistics</v-list-item-title>
          <v-list-item-subtitle
            >
            <p>Confirmed cases: {{confirmed}}</p>
            <p>Deaths: {{deaths}}</p>
            </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-calendar-range</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Date Selection</v-list-item-title>
          <v-list-item-subtitle
            ><DateSlider v-bind:min="0" v-bind:max="10" v-bind:range="[2, 5]"
          /></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-chart-line</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>History</v-list-item-title>
          <v-list-item-subtitle>
            TODO: add graph
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-newspaper-variant</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>News</v-list-item-title>
          <v-list-item-subtitle>
            TODO: add news
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import DateSlider from "./DateSlider.vue";
export default {
  components: {
    DateSlider,
  },
  data() {
    return {
      drawer: true,
      color: "grey darken-2",
      right: true,
      miniVariant: false,
      expandOnHover: true,
      background: false,
      confirmed: 10,
      deaths: 5
    };
  },
};
</script>
