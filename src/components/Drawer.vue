<template>
  <v-navigation-drawer
    v-model="drawer"
    color="grey darken-2"
    width="500"
    expand-on-hover
    right
    absolute
    dark
  >
    <v-list nav three-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-calendar-range</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Date Selection</v-list-item-title>
          <v-list-item-subtitle>
            <template v-if="range">
              <p>From {{ from }} to {{ to }}</p>
              <v-range-slider
                v-model="range"
                :max="max"
                :min="0"
                hide-details
                v-on:input="updateDates"
                class="align-center"/></template
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-counter</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            >Statistics ({{ country ? country : "Global" }})</v-list-item-title
          >
          <v-list-item-subtitle>
            <p v-if="data">
              Confirmed cases:
              {{
                data[range[1]].Confirmed -
                  (range[0] === 0 ? 0 : data[range[0]].Confirmed)
              }}
            </p>
            <p v-if="data">
              Deaths:
              {{
                data[range[1]].Deaths -
                  (range[0] === 0 ? 0 : data[range[0]].Deaths)
              }}
            </p>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-chart-line</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>History</v-list-item-title>
          <v-list-item-subtitle>
            <Chart v-if="data" v-bind:data="data" />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-newspaper-variant</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>News</v-list-item-title>
          <v-list-item-subtitle>
            <News />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { fetchData } from "../utils/Fetcher.ts";
import Chart from "./Chart.vue";
import News from "./News.vue";
export default {
  components: {
    Chart,
    News,
  },
  async created() {
    this.data = await fetchData("cases", "", "", false, true);
    this.max = this.data.length - 1;
    this.range = [0, this.max];
    this.from = this.data[0].Date;
    this.to = this.data[this.max].Date;
  },
  data() {
    return {
      drawer: true,
      country: null,
      data: null,
      range: null,
      min: 0,
      max: null,
      from: null,
      to: null,
    };
  },
  methods: {
    updateDates([fromIndex, toIndex]) {
      this.from = this.data[fromIndex].Date;
      this.to = this.data[toIndex].Date;
    },
  },
};
</script>
