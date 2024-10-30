<template>
  <div class="input-container">
    <BaseLabel :text="label" :id="id" />
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :style="{ width: width, padding: padding }"
      :class="{ 'input-error': error }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseLabel from '@/components/Common/BaseLabel.vue';

export default defineComponent({
  name: 'BaseInput',
  components: { BaseLabel },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substr(2, 9)}`
    },
    width: {
      type: String,
      default: '100%'
    },
    padding: {
      type: String,
      default: '0 0 40px 10px'
    }
  },
  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit('update:modelValue', target.value)
    }
  }
});
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

input {
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
  line-height: 2;
  
}

input::placeholder {
  color: #aaa; 
}

input:focus {
  border-color: cornflowerblue;
}

.input-error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.875rem;
}
</style>
