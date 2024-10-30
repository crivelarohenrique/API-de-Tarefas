<template>
  <label v-if="text" :for="id">{{ text }}</label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseLabel',
  props: {
    text: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: () => `label-${Math.random().toString(36).slice(2, 9)}`,
    },
  },
});
</script>

<style scoped>
label {
  margin-bottom: 5px;
  color: #555;
  font-size: 24px;
}

@media (max-width: 648px) {
  label { 
    font-size: 12px;
  }
}
</style>
