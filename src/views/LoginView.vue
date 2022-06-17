<template>
  <section class="bg-ct-blue-600 min-h-screen grid place-items-center">
    <div class="w-full">
      <h1
        class="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4"
      >
        Welcome Back
      </h1>
      <h2 class="text-lg text-center mb-4 text-ct-dark-200">
        Login to have access
      </h2>
      <form
        @submit="onSubmit"
        class="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
      >
        <div class="">
          <label for="email" class="block text-ct-blue-600 mb-3"
            >Email Address</label
          >
          <input
            type="email"
            placeholder=" "
            v-model="email"
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="email"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.email
          }}</span>
        </div>
        <div class="">
          <label for="password" class="block text-ct-blue-600 mb-3"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="password"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.password
          }}</span>
        </div>
        <div class="text-right">
          <a href="" class="">Forgot Password?</a>
        </div>
        <LoadingButton :loading="isLoading" :textColor="'text-ct-blue-600'"
          >Login</LoadingButton
        >
        <span class="block"
          >Need an account?
          <router-link :to="{ name: 'register' }" class="text-ct-blue-600"
            >Sign Up Here</router-link
          ></span
        >
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUpdate } from 'vue';
import { Form, useField, useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from 'vue-query';
import { getMeFn, loginUserFn } from '@/api/authApi';
import type { ILoginInput } from '@/api/types';
import { createToast } from 'mosha-vue-toastify';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import LoadingButton from '@/components/LoadingButton.vue';

const authStore = useAuthStore();

const loginSchema = toFormValidator(
  zod.object({
    email: zod
      .string()
      .min(1, 'Email address is required')
      .email('Email Address is invalid'),
    password: zod
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
  })
);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField('email');
const { value: password } = useField('password');

const authResult = useQuery('authUser', () => getMeFn(), {
  enabled: false,
  retry: 1,
});

const queryClient = useQueryClient();

const { isLoading, mutate } = useMutation(
  (credentials: ILoginInput) => loginUserFn(credentials),
  {
    onError: (error) => {
      if (Array.isArray((error as any).response.data.error)) {
        (error as any).response.data.error.forEach((el: any) =>
          createToast(el.message, {
            position: 'top-right',
            type: 'warning',
          })
        );
      } else {
        createToast((error as any).response.data.message, {
          position: 'top-right',
          type: 'danger',
        });
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries('authUser');
      createToast('Successfully logged in', {
        position: 'top-right',
      });
      router.push({ name: 'home' });
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate({
    email: values.email,
    password: values.password,
  });
  resetForm();
});

onBeforeUpdate(() => {
  if (authResult.isSuccess.value) {
    const authUser = Object.assign({}, authResult.data.value?.data.user);
    authStore.setAuthUser(authUser);
  }
});
</script>
