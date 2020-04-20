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
          <v-list-item-title>Selections</v-list-item-title>
          <v-list-item-subtitle>
            <template v-if="range">
              <v-range-slider
                v-model="range"
                :max="max"
                :min="0"
                hide-details
                v-on:input="updateDates"
                class="align-center"
              >
                <template v-slot:prepend>
                  {{ from }}
                </template>
                <template v-slot:append>
                  {{ to }}
                </template>
              </v-range-slider>
            </template>
            <v-switch
              v-model="showConfirmed"
              :label="showConfirmed ? 'Show Confirmed Cases' : 'Show Deaths'"
              v-on:change="changeShowConfirmed"
          /></v-list-item-subtitle>
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
              {{ getConfirmed }}
            </p>
            <p v-if="data">
              Deaths:
              {{ getDeaths }}
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
            <Chart v-if="data" :data="data" />
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
            <News :country="country" />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { fetchData } from "../utils.ts";
import Chart from "./Chart.vue";
import News from "./News.vue";
export default {
  components: {
    Chart,
    News,
  },
  async created() {
    this.data = await fetchData("cases", "", "", "", false, false, true);
    this.max = this.data.length - 1;
    this.range = [0, this.max];
    this.from = this.data[0].Date;
    this.to = this.data[this.max].Date;
  },
  mounted() {
    this.$root.$on("countrySelected", async (country) => {
      this.country = country;
      const countryData = await fetchData(
        "cases",
        "",
        "",
        country,
        true,
        true,
        false
      );
      this.data = countryData[country].Counts;
    });
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
      showConfirmed: true,
    };
  },
  computed: {
    getConfirmed: function() {
      const [from, to] = this.range;
      return (
        this.data[to].Confirmed - (from === 0 ? 0 : this.data[from].Confirmed)
      );
    },
    getDeaths: function() {
      const [from, to] = this.range;
      return this.data[to].Deaths - (from === 0 ? 0 : this.data[from].Deaths);
    },
  },
  methods: {
    updateDates([fromIndex, toIndex]) {
      this.from = this.data[fromIndex].Date;
      this.to = this.data[toIndex].Date;
    },
    changeShowConfirmed(showConfirmed) {
      this.$root.$emit("changeShowConfirmed", showConfirmed);
    },
  },
};
</script>
