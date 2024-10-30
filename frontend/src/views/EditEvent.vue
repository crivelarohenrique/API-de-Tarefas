<template>
  <div class="main">
    <h1>Editar tarefa</h1>
    <div class="main-edit-event">
      <EventForm
        v-if="eventData"
        :event="eventData" 
        :onSubmit="handleSubmit"
      />
    </div>
</div>
</template>

<script lang="ts">
import EventForm from '@/components/Common/EventForm.vue';
import { eventApi } from '@/services/event.service';
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'EditEvent',
  components: { EventForm },
  setup() {
    const router = useRouter();
    const urlObject = useRoute()
    const eventId = urlObject.params.id as string;
    const eventData = ref({});

    const fetchEvent = async () => {
      eventData.value = await eventApi.findOne(eventId); 
    };

    const handleSubmit = async (eventData: EventData) => {
      try {
        await eventApi.update(eventId, eventData.name, eventData.description, eventData.hour, eventData.date); 
        router.push('/agenda');
      } catch (error) {
        console.error('Erro ao editar evento:', error);
      }
    };

    onMounted(fetchEvent);

    return { eventData, handleSubmit };
  },
});
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    align-items: center;
    margin-top: 4%;
  }
  .main-edit-event {
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>
