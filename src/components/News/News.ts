import Vue from "vue";

export default Vue.extend({
  props: {
    news: Array,
    height: String
  },
  computed: {
    getStyle() {
      return this.height ? `max-height:${this.height}px` : "";
    }
  },
});
