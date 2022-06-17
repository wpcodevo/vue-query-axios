<template>
  <section class="py-8 bg-ct-blue-600 min-h-screen grid place-items-center">
    <div class="w-full">
      <h1
        class="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4"
      >
        Welcome to CodevoWeb!
      </h1>
      <h2 class="text-lg text-center mb-4 text-ct-dark-200">
        Sign Up To Get Started!
      </h2>
      <form
        @submit="onSubmit"
        class="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
      >
        <div class="">
          <label for="name" class="block text-ct-blue-600 mb-3"
            >Full Name</label
          >
          <input
            v-model="name"
            type="text"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="name"
          />
          <span class="text-red-500 text-xs pt-1 block">{{ errors.name }}</span>
        </div>
        <div class="">
          <label for="email" class="block text-ct-blue-600 mb-3"
            >Email Address</label
          >
          <input
            v-model="email"
            type="email"
            placeholder=" "
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
        <div class="">
          <label for="passwordConfirm" class="block text-ct-blue-600 mb-3"
            >Confirm Password</label
          >
          <input
            v-model="passwordConfirm"
            type="password"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="passwordConfirm"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.passwordConfirm
          }}</span>
        </div>
        <span class="block"
          >Already have an account?
          <router-link :to="{ name: 'login' }" class="text-ct-blue-600"
            >Login Here</router-link
          ></span
        >
        <LoadingButton :loading="isLoading" :textColor="'text-ct-blue-600'"
          >Sign Up</LoadingButton
        >
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Form, useField, useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import * as zod from 'zod';
import { useMutation } from 'vue-query';
import { signUpUserFn } from '@/api/authApi';
import type { ISignUpInput } from '@/api/types';
import { createToast } from 'mosha-vue-toastify';
import router from '@/router';
import LoadingButton from '../components/LoadingButton.vue';

const registerSchema = toFormValidator(
  zod
    .object({
      name: zod.string().min(1, 'Full name is required'),
      email: zod
        .string()
        .min(1, 'Email address is required')
        .email('Email Address is invalid'),
      password: zod
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
      passwordConfirm: zod.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: 'Passwords do not match',
    })
);

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: registerSchema,
});

const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: password } = useField('password');
const { value: passwordConfirm } = useField('passwordConfirm');

const { isLoading, mutate } = useMutation(
  (credentials: ISignUpInput) => signUpUserFn(credentials),
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
      router.push({ name: 'verifyemail' });
      createToast(data.message, {
        position: 'top-right',
      });
    },
  }
);

const onSubmit = handleSubmit((values) => {
  mutate({
    name: values.name,
    email: values.email,
    password: values.password,
    passwordConfirm: values.passwordConfirm,
  });
  resetForm();
});
</script>
