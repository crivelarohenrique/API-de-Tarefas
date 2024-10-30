<template>
  <div class="main">
    <h1>Criar tarefa</h1>
    <div class="main-create-event">
      <EventForm :event="{}" :onSubmit="handleSubmit" />
    </div>
  </div>
</template>

<script lang="ts">

import EventForm from '@/components/Common/EventForm.vue';
import { eventApi } from '@/services/event.service';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CreateEvent',
  components: { EventForm },
  setup() {
    const router = useRouter();

    const handleCancel = () => {
      router.push('/agenda');
    };

    const handleSubmit = async (eventData: EventData) => {
      try {
        await eventApi.create(eventData.name, eventData.description, eventData.hour, eventData.date);
        router.push('/agenda');
      } catch (error) {
        console.error('Erro ao criar evento:', error);
      }
    };

    return { handleCancel, handleSubmit };
  },
});
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-top: 4%;
  align-items: center;

}

.main-create-event {
  display: flex;
  width: 100%;
  justify-content: center;
}

h1 {
  width: 100%;
  text-align: center;
}
</style>
