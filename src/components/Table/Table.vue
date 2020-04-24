<template>
  <v-card dark raised :width="width">
    <v-card-title>
      Country Data
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        dark
      />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        dark
        :items-per-page="5"
        sort-by="confirmed"
        :sort-desc="true"
        no-data-text="Data unavailable"
        :footer-props="{ 'items-per-page-options': [5] }"
        :search="search"
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
.v-data-footer__pagination {
  margin: 0 0 0 0 !important;
}
transparent {
  opacity: 0;
}
</style>
