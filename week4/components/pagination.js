export default {
  props: ["pages"],
  template: "#pagination",
  methods: {
    emitPage(page) {
      this.$emit("emitPages", page);
    },
  },
};
