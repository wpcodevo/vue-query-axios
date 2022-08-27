<template>
  <section>
    <div
      class="fixed inset-0 bg-[rgba(0,0,0,.3)] z-[1000]"
      @click="toggleModal"
    ></div>
    <div
      class="max-w-lg w-full rounded-md fixed top-[15%] left-1/2 -translate-x-1/2 bg-white z-[1001] p-6"
    >
      <h2 class="text-2xl font-semibold mb-4">Edit Post</h2>
      <form class="w-full" @submit="onSubmit">
        <div class="mb-2">
          <label class="block text-gray-700 text-lg mb-2" for="title">
            Title
          </label>
          <input
            :class="`appearance-none border border-ct-dark-200 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none ${
              errors.title ? 'border-red-500' : ''
            }`"
            id="title"
            type="text"
            placeholder=" "
            v-model="title"
          />
          <p
            :class="`text-red-500 text-xs italic mb-2 ${
              errors.title ? 'visible' : 'invisible'
            }`"
          >
            {{ errors.title }}
          </p>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-lg mb-2" for="title">
            Category
          </label>
          <input
            :class="`appearance-none border border-ct-dark-200 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none ${
              errors.category ? 'border-red-500' : ''
            }`"
            id="category"
            type="text"
            placeholder=" "
            v-model="category"
          />
          <p
            :class="`text-red-500 text-xs italic mb-2 ${
              errors.category ? 'visible' : 'invisible'
            }`"
          >
            {{ errors.category }}
          </p>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-lg mb-2" for="title">
            Content
          </label>
          <textarea
            :class="`appearance-none border border-ct-dark-200 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none ${
              errors.content ? 'border-red-500' : ''
            }`"
            id="content"
            rows="4"
            placeholder=" "
            v-model="content"
          />
          <p
            :class="`text-red-500 text-xs italic mb-2 ${
              errors.content ? 'visible' : 'invisible'
            }`"
          >
            {{ errors.content }}
          </p>
        </div>
        <div class="mb-2">
          <span class="sr-only">Choose profile photo</span>
          <Field name="image" v-slot="{ errorMessage }">
            <input
              @change="onFileChange"
              @blur="onFileChange"
              type="file"
              class="block text-sm mb-2 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <p
              :class="`text-red-500 text-xs italic mb-2 ${
                errorMessage ? 'visible' : 'invisible'
              }`"
            >
              {{ errorMessage }}
            </p>
          </Field>
        </div>
        <LoadingButton :loading="isLoading" :btnColor="'bg-ct-blue-600'"
          >Edit Post</LoadingButton
        >
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useField, useForm, Field } from 'vee-validate';
import * as zod from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { useMutation, useQueryClient } from 'vue-query';
import { updatePostFn } from '@/api/postApi';
import { createToast } from 'mosha-vue-toastify';
import type { IPostResponse } from '@/api/types';
import { pickBy } from 'lodash';
import { toRefs } from 'vue';
import LoadingButton from './LoadingButton.vue';

const props = defineProps<{
  toggleModal: () => void;
  post: IPostResponse;
}>();

const { post, toggleModal } = toRefs(props);

const editPostSchema = toFormValidator(
  zod
    .object({
      title: zod.string(),
      category: zod.string(),
      content: zod.string(),
      image: zod.instanceof(File),
    })
    .partial()
);

const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: editPostSchema,
});

const { value: title } = useField<string>('title');
const { value: category } = useField<string>('category');
const { value: content } = useField<string>('content');
const { setValue } = useField<File>('image');

const onFileChange = (event: any) => {
  let files: FileList = event.target.files;
  const file = files[0];
  if (file) {
    setValue(file);
  }
};

const queryClient = useQueryClient();
const { mutate: updatePost, isLoading } = useMutation(
  ({ id, formData }: { id: string; formData: FormData }) =>
    updatePostFn({ id, formData }),
  {
    onSuccess: (data) => {
      queryClient.invalidateQueries('posts');
      createToast('Post updated successfully', {
        position: 'top-right',
      });
      toggleModal.value();
    },
    onError: (error: any) => {
      toggleModal.value();
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
  }
);

const onSubmit = handleSubmit((values) => {
  const formData = new FormData();
  const filteredFormData = pickBy(
    values,
    (value) => value !== '' && value !== undefined
  );
  const { image, ...otherFormData } = filteredFormData;
  if (image) {
    formData.append('image', image);
  }
  formData.append('data', JSON.stringify(otherFormData));
  updatePost({ id: post.value.id, formData });
});

onMounted(() => {
  setFieldValue('title', post.value.title);
  setFieldValue('category', post.value.category);
  setFieldValue('content', post.value.content);
});
</script>
