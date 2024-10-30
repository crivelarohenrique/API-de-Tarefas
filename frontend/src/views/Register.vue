<template>
  <AuthForm
    title="Cadastrar"
    :isRegister="true"
    buttonText="Cadastrar"
    footerText="Já possui uma conta?"
    footerLink="/"
    footerLinkText="Entrar"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthForm from '../components/Common/AuthForm.vue';

export default defineComponent({
  name: 'UserRegister',
  components: {
    AuthForm,
  },
});
</script>
