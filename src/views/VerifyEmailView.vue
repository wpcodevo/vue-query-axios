<template>
  <section class="py-8 bg-ct-blue-600 min-h-screen grid place-items-center">
    <div class="w-full">
      <h1
        class="text-5xl xl:text-7xl text-center font-[600] text-ct-yellow-600 mb-8"
      >
        Verify Email Address
      </h1>

      <form
        @submit="onSubmit"
        class="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
      >
        <div class="">
          <label for="verificationCode" class="block text-ct-blue-600 mb-3"
            >Verification Code</label
          >
          <input
            v-model="verificationCodeInput"
            type="text"
            placeholder=" "
            class="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
            id="verificationCode"
          />
          <span class="text-red-500 text-xs pt-1 block">{{
            errors.verificationCode
          }}</span>
        </div>

        <LoadingButton :loading="isLoading">Verify Email</LoadingButton>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { toFormValidator } from '@vee-validate/zod';
import * as zod from 'zod';
import { useForm, useField } from 'vee-validate';
import { useRoute } from 'vue-router';
import { useMutation } from 'vue-query';
import { verifyEmailFn } from '@/api/authApi';
import router from '@/router';
import { createToast } from 'mosha-vue-toastify';
import LoadingButton from '@/components/LoadingButton.vue';

const route = useRoute();
const { verificationCode } = route.params;

const verifyEmailSchema = toFormValidator(
  zod.object({
    verificationCode: zod.string().min(1, 'Verification code required'),
  })
);

const { resetForm, setFieldValue, handleSubmit, errors } = useForm({
  validationSchema: verifyEmailSchema,
});

const { value: verificationCodeInput } = useField('verificationCode');

const { mutate: verifyEmail, isLoading } = useMutation(
  (code: string) => verifyEmailFn(code),
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
      createToast(data.message, {
        position: 'top-right',
      });
      router.push({ name: 'login' });
    },
  }
);

const onSubmit = handleSubmit((values) => {
  verifyEmail(values.verificationCode);
  resetForm();
});

onMounted(() => {
  if (verificationCode) {
    setFieldValue('verificationCode', verificationCode);
  }
});
</script>
