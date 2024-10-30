<template>
  <form class="form-event">
    <BaseInput class="create-input name-input" v-model="localName" label="Nome" type="text" placeholder="Digite o nome da tarefa"
      required @input="errors.name = undefined" :error="errors.name?._errors[0]" padding="0 10px"/>
    <BaseInput class="create-input description-input" v-model="localDescription" label="Descrição" type="text" padding="0 0 120px 10px"
      placeholder="Digite a descrição da tarefa" required @input="errors.description = undefined" :error="errors.description?._errors[0]"/>
    <BaseInput class="create-input hour-input" v-model="localHour" label="Hora" type="text" placeholder="00:00" padding="2px 10px"
      maxlength="5" required @input="formatHour($event); errors.hour = undefined" :error="errors.hour?._errors[0]"  />
    <BaseInput class="create-input date-input" v-model="localDate" label="Data" type="date" placeholder="Digite a data da tarefa"
      required :error="errors.date?._errors[0]" @input="errors.date = undefined" padding="2px 10px" />
    <div class="wrapper-button">
      <BaseButton @click="handleCancel" class="form-button" text="Cancelar" type="button" />
      <BaseButton @click="handleSubmit" class="form-button" text="Salvar" type="button"  />
    </div>
  </form>
</template>

<script lang="ts">
import BaseButton from '@/components/Common/BaseButton.vue';
import BaseInput from '@/components/Common/BaseInput.vue';
import { eventSchema } from '@/schemas/zod';
import dayjs from 'dayjs';
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EventForm',
  components: { BaseInput, BaseButton },
  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const errors = ref({});
    const localDate = ref(dayjs(props.event.date).format('YYYY-MM-DD') || '')

    const localName = ref(props.event.name || '');
    const localDescription = ref(props.event.description || '');
    const localHour = ref(props.event.hour || '');

    watch(() => props.event, (newEvent) => {
      localName.value = newEvent.name || '';
      localDescription.value = newEvent.description || '';
      localHour.value = newEvent.hour || '';
      localDate.value = dayjs(newEvent.date).format('YYYY-MM-DD');
    });

    const formatHour = (event: Event) => {
      const target = event.target as HTMLInputElement
      let value = target.value.replace(/\D/g, '');

      if (value.length > 4) {
        value = value.slice(0, 4);
      }

      if (value.length >= 3) {
        value = `${value.slice(0, 2)}:${value.slice(2)}`;
      }

      let hours = value.slice(0, 2);
      let minutes = value.slice(3, 5);

      if (parseInt(hours) > 23) {
        hours = '23';
        minutes = '59';
      } else if (hours.length === 2 && hours[0] === '0' && hours[1] > '2') {
        hours = `0${hours[1]}`;
      } else if (parseInt(minutes) > 59) {
        minutes = '59';
      }

      localHour.value = `${hours}${minutes.length > 0 ? ':' : ''}${minutes}`;
    };


    const handleCancel = () => {
      router.push('/agenda')
    };

    const handleSubmit = () => {
      const result = eventSchema.safeParse({
        name: localName.value,
        description: localDescription.value,
        hour: localHour.value,
        date: localDate.value
      });

      if (result.success) {
        errors.value = {};
        props.onSubmit(result.data);
      } else {
        errors.value = result.error.format();
      }
    };

    return {
      localName,
      localDescription,
      localHour,
      localDate,
      handleCancel,
      handleSubmit,
      errors,
      formatHour
    };
  },
});
</script>

<style scoped>
.form-event {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 60%;
  margin: 0;
  padding: 2%;
  box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.2);
}

.form-button {
  width: 100px; 
  height: 40px; 
  font-size: 20px;
}

.create-input {
  width: 60%;
  text-align: start;
}

.wrapper-button {
  width: 100%;
  display: flex;
  gap: 2%;
  justify-content: end;
}

p {
  font-size: 16px;
  margin: 0;
  margin-bottom: 2%;
  color: red;
}

.hour-input {
  width: 10%;
}

.date-input {
  width: 10%;
}


@media (max-width: 648px) {
  .form-event {
    width: 80%;
  }

  .create-input {
    width: 40%;
    font-size: 12px;
  }

  .name-input {
    width: 80%;
  }
  
  .description-input {
    width: 90%;
  }

  .hour-input {
    width: 15%;
  }

  .date-input {
    width: 50%;
  }

  .form-button {
    width: 60px; 
    height: 30px; 
    font-size: 12px;
  }
}
</style>
