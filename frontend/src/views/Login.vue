<template>
  <AuthForm
    title="Login"
    :isRegister="false"
    buttonText="Login"
    footerText="Não possui uma conta?"
    footerLink="/register"
    footerLinkText="Cadastrar"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthForm from '../components/Common/AuthForm.vue';

export default defineComponent({
  name: 'UserLogin',
  components: {
    AuthForm,
  },
});
</script>
