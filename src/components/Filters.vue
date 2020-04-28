<template>
  <v-card v-if="worldData" dark raised :width="width">
    <v-card-title class="justify-center">
      <v-icon class="hidden-sm-and-down" large left>
        mdi-filter
      </v-icon>
      <span class="title font-weight-light">Filters</span>
    </v-card-title>

    <v-card-actions style="margin-top: 2rem;">
      <v-range-slider
        v-model="range"
        :max="max"
        :min="0"
        hide-details
        v-on:input="updateDates"
        class="align-center"
        thumb-label="always"
        :thumb-size="45"
        thumb-color="grey darken-2"
        prepend-icon="mdi-calendar-range"
        dark
      >
        <template dark v-slot:thumb-label="{ value }">
          {{ worldData[value].date }}
        </template>
      </v-range-slider> </v-card-actions
    ><v-card-actions>
      <v-select
        id="type-select"
        prepend-icon="mdi-human-male-male"
        v-model="typeSelection"
        :items="items"
        v-on:input="changeType"
        dark
        solo
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import { CaseCountRaw, DataTypes } from "@/types";

interface DropdownOption {
  text: string;
  value: DataTypes;
}

interface ComponentData {
  range: Array<number>;
  max: number;
  type: DataTypes;
  items: Array<DropdownOption>;
  typeSelection: DropdownOption;
}

export default Vue.extend({
  data: (): ComponentData => ({
    range: [0, 0],
    max: 0,
    type: DataTypes.CONFIRMED,
    items: [
      { text: "Confirmed cases", value: DataTypes.CONFIRMED },
      { text: "Deaths", value: DataTypes.DEATHS },
      { text: "Recoveries", value: DataTypes.RECOVERIES },
      { text: "Active cases", value: DataTypes.ACTIVE }
    ],
    typeSelection: {
      text: "Confirmed cases",
      value: DataTypes.CONFIRMED
    }
  }),
  props: {
    worldData: Array,
    width: String
  },
  mounted() {
    this.max = this.worldData.length - 1;
    this.range = [0, this.max];
  },
  methods: {
    debouncedEmitChangeDates: _.debounce(function(this: any) {
      const [from, to] = this.range;
      const data = this.worldData as Array<CaseCountRaw>;
      this.$root.$emit("changeDates", {
        range: this.range,
        from: data[from].date,
        to: data[to].date
      });
    }, 1000),
    updateDates(range: Array<number>) {
      this.range = range;
      this.$root.$emit("changeDateRange", range);
      this.debouncedEmitChangeDates();
    },
    changeType(type: DataTypes) {
      this.type = type;
      this.$root.$emit("changeType", type);
    }
  },
  computed: {
    from(): string {
      const data = this.worldData as Array<CaseCountRaw>;
      const [from] = this.range;
      return data[from].date;
    },
    to(): string {
      const data = this.worldData as Array<CaseCountRaw>;
      const [, to] = this.range;
      return data[to].date;
    }
  }
});
</script>
