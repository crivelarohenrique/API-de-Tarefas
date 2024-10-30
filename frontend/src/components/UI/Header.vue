<template lang="">
     <div v-if="isLoggedIn" class="header-container">
      <div>
        <h1 class="title-task" @click="handleDashboard" style="cursor: pointer">Minhas Tarefas</h1>
        <h1 class="username">{{ userData && userData.name }}</h1>
      </div>
      <div class="date">
        <h1 class="current-date">{{ currentDate }}</h1>
        <h2 class="today">(hoje)</h2>
      </div>
      <BaseButton @click="handleLogout" id="btn-logout" text="Deslogar" type="button" />
    </div>
</template>

<script lang="ts">
import { userApi } from '@/services/auth.service';
import store from '@/store';
import moment from 'moment';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '../Common/BaseButton.vue';

export default {
  name: 'AppHeader',
  components: { BaseButton },
  setup() {
    const router = useRouter()
    const userData = ref('')
    moment.locale('pt-br')
    const currentDate = moment().format('DD/MM/YYYY')


    const fetchUserData = async () => {
      const userId = store.state.userId;
      if (userId) {
        try {
          const response = await userApi.getUserById(userId)
          userData.value = response;
        } catch (error) {
          console.error('Erro ao recuperar dados do usuário', error)
        }
      }
    };
    onMounted(fetchUserData)

    const handleDashboard = () => {
      router.push('/')
    };

    const handleLogout = () => {
      store.dispatch('logout');
      router.push('/')
    };

    const isLoggedIn = computed(() => !!store.state.userId);

    return {
      handleLogout,
      userData,
      currentDate,
      isLoggedIn,
      handleDashboard
    }
  },

}
</script>
<style scoped>
.header-container {
  display: flex;
  width: 98%;
  justify-content: space-around;
  margin-bottom: 2%;
  align-items: center;
}
.username {
  font-size: 32px;
}

#btn-logout {
  width: 200px; 
  height: 50px; 
  font-size: 20px; 
  font-weight: bold;
}

.date {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-task {
  font-size: 40px;
}

@media (max-width: 648px) {
  .username {
    font-size: 18px;
  }

  .title-task {
    font-size: 18px;
  }

  .current-date {
    font-size: 18px;
  }

  #btn-logout {
    width: 100px;
    height: 30px;
    font-size: 16px;
  }

  .today {
    font-size: 16px;
  }
}
</style>