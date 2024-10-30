<template>
  <div class="main-container">
    <h1 id="main-title">Organize com o Agender</h1>
    <p id="main-text">Precisa de ajuda para gerenciar seus compromissos? Com o Agender, você ficará sempre no controle
      das suas atividades!</p>
    <div class="container">
      <h1>{{ title }}</h1>
      <form class="form-user" @submit.prevent="handleSubmit" @keydown.enter="handleSubmit">
        <BaseInput class="input-form" v-if="isRegister" v-model="name" label="Nome:" id="name" :error="nameError"
          padding="1%" @input="clearError('name')" />
        <BaseInput class="input-form" v-model="email" label="Email:" type="email" id="email" padding="1%"
          :error="emailError" @input="clearError('email')" />
        <BaseInput class="input-form" v-model="password" label="Senha:" type="password" id="password" padding="1%"
          :error="passwordError || (error && 'Senha ou email incorretos')" @input="clearError('password')" />
        <BaseInput class="input-form" v-if="isRegister" v-model="confirmPassword" label="Confirmar Senha:"
          type="password" id="confirmPassword" padding="1%" :error="confirmPasswordError"
          @input="clearError('confirmPassword')" />
        <BaseButton type="button" @click="handleSubmit" :text="buttonText" />
      </form>
      <p>
        {{ footerText }} <router-link :to="footerLink">{{ footerLinkText }}</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { userApi } from '@/services/auth.service';
import store from '@/store';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/Common/BaseInput.vue';
import { z } from 'zod';
import BaseButton from './BaseButton.vue';
import { loginSchema, registerSchema } from '@/schemas/zod';

export default defineComponent({
  name: 'AuthForm',
  components: {
    BaseInput, BaseButton
  },
  props: {
    title: { type: String, required: true },
    isRegister: { type: Boolean, required: true },
    buttonText: { type: String, required: true },
    footerText: { type: String, required: true },
    footerLink: { type: String, required: true },
    footerLinkText: { type: String, required: true },
  },
  setup(props) {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const success = ref('');
    const nameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const confirmPasswordError = ref('');

    const clearError = (field: string) => {
      if (field === 'name') nameError.value = '';
      else if (field === 'email') emailError.value = '';
      else if (field === 'password') passwordError.value = '';
      else if (field === 'confirmPassword') confirmPasswordError.value = '';
      error.value = '';
    };

    const handleSubmit = async () => {
      clearError('name');
      clearError('email');
      clearError('password');
      clearError('confirmPassword');

      try {
        const data = {
          name: props.isRegister ? name.value : undefined,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
        };

        if (props.isRegister) {
          registerSchema.parse(data);
        } else {
          loginSchema.parse(data);
        }

        if (props.isRegister) {
          await userApi.register(name.value, email.value, password.value);
          router.push('/login');
        } else {
          const response = await userApi.login(email.value, password.value);
          const { token, userId } = response;
          store.dispatch('login', { token, userId });
          success.value = `Usuário logado com sucesso`;
          router.push('/agenda');
        }
      } catch (err) {
        handleError(err);
      }
    };

    const handleError = (err: unknown) => {
      const errorMessages: { [key: number]: string } = {
        400: 'Usuário com este email já registrado',
        401: 'Senha ou email incorretos',
        403: 'Senha ou email incorretos',
      };

      if (typeof err === 'object' && err !== null && 'response' in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = (err as any).response;

        if (response && errorMessages[response.status]) {
          error.value = errorMessages[response.status];
        }
      } else if (err instanceof z.ZodError) {
        err.errors.forEach(error => {
          switch (error.path[0]) {
            case "name":
              nameError.value = error.message;
              break;
            case "email":
              emailError.value = error.message;
              break;
            case "password":
              passwordError.value = error.message;
              break;
            case "confirmPassword":
              confirmPasswordError.value = error.message;
              break;
          }
        });
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      handleSubmit,
      error,
      success,
      nameError,
      emailError,
      passwordError,
      confirmPasswordError,
      clearError,
    };
  },
});
</script>

<style scoped>
#main-title {
  text-align: start;
  margin-left: 4%;
  font-size: 48px;
}

#main-text {
  text-align: start;
  width: 30%;
  margin-left: 6%;
  font-size: 28px;
}

.input-form {
  text-align: start;
}

.container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
  margin: auto;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

button {
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #4cae4c;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}

p {
  text-align: center;
  margin-top: 10px;
  font-size: 25px;
}

a {
  color: #0066ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 648px) {
  #main-title {
    font-size: 24px;
  }

  #main-text {
    font-size: 12px;
  }

  .container {
    width: 250px;
  }

  button {
    font-size: 12px;
  }

  p {
    font-size: 12px;
  }
}

</style>
