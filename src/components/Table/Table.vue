<template>
  <v-card
    v-if="items.length"
    class="hidden-lg-and-down"
    dark
    raised
    :width="width"
    style="top: 45vh"
  >
    <v-card-title class="justify-center">
      <div class="title font-weight-light">Statistics by Country</div>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1 transparent"
        dark
        :items-per-page="5"
        sort-by="confirmed"
        :sort-desc="true"
      >
        <template v-slot:item.deaths="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.country, 'deaths')"
                dark
                v-on="on"
                >{{ item.deaths }}</v-chip
              >
            </template>
            <span>{{ getTooltip(item.country, "deaths") }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.recovered="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.country, 'recovered')"
                dark
                v-on="on"
                >{{ item.recovered }}</v-chip
              >
            </template>
            <span>{{ getTooltip(item.country, "recovered") }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script src="./Table.ts" />

<style>
.v-data-footer__select {
  display: none;
}
transparent {
  opacity: 0;
}
</style>
