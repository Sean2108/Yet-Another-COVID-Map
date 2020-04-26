<template>
  <v-card v-if="items.length" dark raised :width="width">
    <v-card-title class="justify-center">
      <v-icon class="hidden-sm-and-down" large left>
        mdi-table-furniture
      </v-icon>
      <span
        :class="{
          title: $vuetify.breakpoint.mdAndUp,
          'subtitle-1': $vuetify.breakpoint.smAndDown,
          'font-weight-light': true
        }"
        >Country Data</span
      >
    </v-card-title>
    <v-card-subtitle class="py-0">
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            dark
          />
        </v-col>
        <v-col cols="4"
          ><v-switch
            reverse
            dark
            v-model="showPercentages"
            label="Percentages"
            @change="updateShowPercentages"
        /></v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        id="countryTable"
        :headers="headers"
        :items="items"
        class="elevation-1 transparent"
        dark
        :items-per-page="5"
        sort-by="confirmed"
        :sort-desc="true"
        no-data-text="Data unavailable"
        :footer-props="{ 'items-per-page-options': [5] }"
        :search="search"
        :mobile-breakpoint="0"
        must-sort
        :custom-sort="customSort"
        @click:row="emitRowClick"
      >
        <template v-slot:item.confirmed="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.confirmedRatio, 'confirmed')"
                dark
                v-on="on"
                >{{
                  showPercentages
                    ? `${Math.round(item.confirmedRatio * 1000) / 1000}%`
                    : item.confirmed
                }}</v-chip
              >
            </template>
            <span>{{
              getTooltip(item.confirmedRatio, item.country, "confirmed")
            }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.deaths="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.deathsRatio, 'deaths')"
                dark
                v-on="on"
                >{{
                  showPercentages
                    ? `${Math.round(item.deathsRatio * 100) / 100}%`
                    : item.deaths
                }}</v-chip
              >
            </template>
            <span>{{
              getTooltip(item.deathsRatio, item.country, "deaths")
            }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.recovered="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.recoveredRatio, 'recovered')"
                dark
                v-on="on"
                >{{
                  showPercentages
                    ? `${Math.round(item.recoveredRatio * 100) / 100}%`
                    : item.recovered
                }}</v-chip
              >
            </template>
            <span>{{
              getTooltip(item.recoveredRatio, item.country, "recovered")
            }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script src="./Table.ts" />

<style>
#countryTable tbody tr:hover {
  cursor: pointer;
}
</style>
