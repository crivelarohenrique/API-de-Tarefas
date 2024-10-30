<template>
  <button
    :type="type"
    :class="buttonClass"
    @click="handleClick"
  >
  <slot>{{ text }}</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'BaseButton',
  props: {
    text: {
      type: String,
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
    buttonClass: {
      type: String,
      default: 'base-button', 
    },
    onClick: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: () => {null},
    },
    padding: {
      type: String,
      default: '20px'
    }
  },
  setup(props) {
    const handleClick = (event: MouseEvent) => {
      event.preventDefault()
      props.onClick(event);
    };

    return {
      handleClick,
    };
  },
});
</script>

<style scoped>
.base-button {
  background-color: #40c5ee;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: "Roboto", serif;
}

.base-button:hover {
  background-color: #1a93f5;
}
</style>
