<template>
  <div>oi index</div>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "~/components/Logo.vue";
export default Vue.extend({
  components: {
    Logo
  },

  data() {
    const message: string = "This is a message";
    return {
      message
    };
  }
});
</script>
