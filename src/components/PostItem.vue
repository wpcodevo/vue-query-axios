<template>
  <div class="rounded-md shadow-md bg-white">
    <div class="mx-2 mt-2 overflow-hidden rounded-md">
      <img
        :src="`${VUE_APP_API_URL}/api/static/posts/${post.image}`"
        alt=""
        class="object-fill w-full h-full"
      />
    </div>
    <div class="p-4">
      <h5 class="font-semibold text-xl text-[#4d4d4d] mb-4">
        {{
          post.title.length > 25
            ? post.title.substring(0, 25) + '...'
            : post.title
        }}
      </h5>
      <div class="flex items-center mt-4">
        <p class="p-1 rounded-sm mr-4 bg-[#dad8d8]">{{ post.category }}</p>
        <p class="text-[#ffa238]">
          {{ format(parseISO(post.created_at), 'PPP') }}
        </p>
      </div>
    </div>
    <div class="flex justify-between items-center px-4 pb-4">
      <div class="flex items-center">
        <div class="w-12 h-12 rounded-full overflow-hidden">
          <img
            :src="`${VUE_APP_API_URL}/api/static/users/${post.user.photo}`"
            alt=""
            class="object-cover w-full h-full"
          />
        </div>
        <p class="ml-4 text-sm font-semibold">{{ post.user.name }}</p>
      </div>
      <div class="relative">
        <div
          class="text-3xl text-[#4d4d4d] cursor-pointer p-3"
          @click="showSettings"
        >
          <i class="bx bx-dots-horizontal-rounded"></i>
        </div>
        <ul
          class="absolute bottom-5 -right-1 z-50 py-2 rounded-sm bg-white shadow-lg transition ease-out duration-300"
          v-if="openSettings"
        >
          <li
            class="w-24 h-7 py-3 px-2 hover:bg-[#f5f5f5] flex items-center gap-2 cursor-pointer transition ease-in duration-300"
            @click="toggleModal"
          >
            <i class="bx bx-edit-alt"></i> <span>Edit</span>
          </li>
          <li
            class="w-24 h-7 py-3 px-2 hover:bg-[#f5f5f5] flex items-center gap-2 cursor-pointer transition ease-in duration-300"
            @click="onDelete"
          >
            <i class="bx bx-trash"></i> <span>Delete</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <teleport to="body">
    <EditPost v-if="openModal" :toggleModal="toggleModal" :post="post" />
  </teleport>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { IPostResponse } from '@/api/types';
import { format, parseISO } from 'date-fns';
import EditPost from '@/components/EditPost.vue';
import { useMutation, useQueryClient } from 'vue-query';
import { deletePostFn } from '@/api/postApi';
import { createToast } from 'mosha-vue-toastify';

const VUE_APP_API_URL = 'http://localhost:8000';
const props = defineProps<{
  post: IPostResponse;
}>();

const { post } = toRefs(props);

const queryClient = useQueryClient();
const { isLoading, mutate: deletePost } = useMutation(
  (id: string) => deletePostFn(id),
  {
    onSuccess: (data) => {
      createToast('Post deleted successfully', {
        position: 'top-right',
      });
      queryClient.invalidateQueries('posts');
    },
    onError: (error: any) => {
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

function onDelete() {
  if (window.confirm('Are you sure you want to delete this post?')) {
    deletePost(post.value.id);
  }
}

const openSettings = ref(false);
const openModal = ref(false);

function showSettings() {
  openSettings.value = true;
}

function toggleModal() {
  openModal.value = !openModal.value;
  openSettings.value = false;
}
</script>
