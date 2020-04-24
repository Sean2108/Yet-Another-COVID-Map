<template>
  <v-data-table
    :headers="headers"
    :items="items"
    class="elevation-1"
    dark
    :items-per-page="5"
    sort-by="confirmed"
    :sort-desc="true"
    no-data-text="Data unavailable"
    :footer-props="{'items-per-page-options': [5]}"
  >
    <template v-slot:item.deaths="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-chip :color="getColour(item.country, 'deaths')" dark v-on="on">{{
            item.deaths
          }}</v-chip>
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
</template>

<script src="./Table.ts" />
