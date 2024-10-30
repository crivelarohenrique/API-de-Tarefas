<template>
  <div class="event-list">
    <h2>Lista de Tarefas</h2>
    <ul>
      <li v-for="event in events" :key="event.id">
        <div>
          <h3>{{ event.name }}</h3>
          <p><strong>Descrição:</strong> {{ event.description }}</p>
          <p><strong>Hora:</strong> {{ event.hour }}</p>
          <p><strong>Data:</strong> {{ formatDate(event.date) }}</p>
        </div>
        <div class="wrapper-icons">
          <Icon @click=handleEditEvent(event.id) id="edit-icon" icon="oi-pencil"/>
          <Icon @click="handleRemoveEvent(event.id)" id="remove-icon" icon="oi-trash"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { eventApi } from '@/services/event.service'; 
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EventList',
  components: { Icon },
  setup() {
    const events = ref<Event[]>([]);
    const router = useRouter()

    const fetchEvents = async () => {
      try {
        events.value = await eventApi.findAll(); 
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      }
    };

    const handleRemoveEvent = async (id: string) => {
      try {
        await eventApi.delete(id);
        events.value = events.value.filter(event => event.id !== id)
      } catch (error) {
        console.error('Erro ao buscar id do evento:', error)
      }
    }

    const handleEditEvent = (id: string) => {
      router.push(`/event/edit/${id}`)
    }

    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    onMounted(fetchEvents);

    return { events, formatDate, handleRemoveEvent, handleEditEvent };
  },
});
</script>

<style scoped>
.event-list {
  width: 60%;
  margin: 20px auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

h3 {
  text-align: start;
}

p {
  text-align: start;
  font-size: 20px;
  margin-left: 2%; 
}

li {
  border: 1px solid #ccc;
  padding: 10px;
  position: relative;
  border-radius: 30px;
}

li:hover {
  background-color: #b4f2fa;
}

#edit-icon {
  width: 24px; 
  height: 24px; 
  color: #1a93f5;
  cursor: pointer;
}

#remove-icon {
  width: 24px;
  height: 24px; 
  color: #c1121f;
  cursor: pointer;
}

.wrapper-icons {
  display: flex;
  gap: 10px;
  position: absolute;
  right: 1%;
  top: 4%;
}

.wrapper-icons .icon:hover{
  cursor: pointer;
  scale: 1.5;
}

@media (max-width: 648px) {
  p {
    font-size: 16px;
  }

  #edit-icon {
    width: 16px;
    height: 16px;
  }

  #remove-icon {
    width: 16px;
    height: 16px;
  }

  .wrapper-icons {
    right: 4%;
  }
}

</style>
