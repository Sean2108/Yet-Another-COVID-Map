<template>
  <v-list :style="getStyle" class="overflow-y-auto" two-line dense tile>
    <v-tooltip bottom dark v-for="newsItem in news" :key="newsItem.title">
      <template v-slot:activator="{ on }">
        <v-card v-on="on" class="news-card" :href="newsItem.url">
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="newsItem.thumbnailUrl" alt="" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ newsItem.title }}</v-list-item-title>
              <v-list-item-subtitle>{{
                newsItem.description
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </template>
      <span>{{ newsItem.title }}</span>
    </v-tooltip>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    news: Array,
    height: String
  },
  computed: {
    getStyle() {
      return this.height ? `max-height:${this.height}vh` : "";
    }
  }
});
</script>

<style scoped>
.news-card {
  margin-bottom: 0.3vw;
}
</style>
