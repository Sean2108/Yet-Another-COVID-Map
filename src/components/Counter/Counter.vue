<template>
  <v-card
    v-if="data"
    dark
    raised
    :width="width"
  >
    <v-card-title class="justify-center">
      <div class="title font-weight-light">Total {{ header }}</div>
    </v-card-title>
    <v-card-subtitle class="display-2 text-center red--text font-weight-medium">
      {{ data[type] }}
    </v-card-subtitle>
  </v-card>
</template>

<script src="./Counter.ts" />
