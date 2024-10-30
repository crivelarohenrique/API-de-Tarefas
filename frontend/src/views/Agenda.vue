<template>
  <div class="main-agenda">
    <div class="events-container">
      <AddEvents />
      <Events />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, } from 'vue';
import AddEvents from '@/components/UI/AddEvents.vue';
import Events from '@/components/UI/Events.vue';

export default defineComponent({
  name: 'userAgenda',
  components: {
    AddEvents, Events
  },
})
</script>

<style>
.main-agenda {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
}

.events-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  min-height: 100vh;
  box-shadow: 0 4px 40px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: #fff;
}

.current-date {
  font-size: 32px;
  height: 10px;
}

.today {
  font-size: 16px;
}

.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#logout-btn:hover {
  background-color: #05a0c7;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
