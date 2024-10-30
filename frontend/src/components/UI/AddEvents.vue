<template>
  <div class="main-events">
    <BaseButton class="add-event" @click="handleClickAdd">
      <h1>Adicionar tarefa</h1>
      <Icon class="icon-style" icon="ic:baseline-plus" />
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import BaseButton from '../Common/BaseButton.vue';

export default defineComponent({
  name: 'UserEvents',
  components: { Icon, BaseButton },
  setup() {
    const router = useRouter();
    const handleClickAdd = () => {
      router.push('/event/create')
    }

    return {
      handleClickAdd
    }
  }
})
</script>

<style scoped>

.add-event {
  display: flex;
  justify-content: center;
  align-items: center; 
  margin-top: 10%;
  width: 300px;
  border-radius: 40px;
  height: 60px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.icon-style {
  font-size: 40px;
  color: white;
  margin-left: 5%;
}

h1 {
  font-size: 24px;
}

@media (max-width: 648px) {
  .add-event {
    width: 120px;
    height: 40px;
  }

  h1 {
    font-size: 10px;
  }

  .icon-style {
    font-size: 18px;
  }
}

</style>
