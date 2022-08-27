<template>
  <header class="bg-white h-20">
    <nav class="h-full flex justify-between container items-center">
      <div>
        <router-link to="/" class="text-xl text-ct-dark-600 font-semibold"
          >CodevoWeb</router-link
        >
      </div>
      <ul class="flex items-center gap-4">
        <li><router-link to="/" class="text-ct-dark-600">Home</router-link></li>
        <li v-if="!user">
          <router-link to="/register" class="text-ct-dark-600"
            >SignUp</router-link
          >
        </li>
        <li v-if="!user">
          <router-link to="/login" class="text-ct-dark-600">Login</router-link>
        </li>
        <li v-if="user">
          <router-link to="/profile" class="text-ct-dark-600"
            >Profile</router-link
          >
        </li>
        <li v-if="user" class="cursor-pointer" @click="toggleModal">
          Create Post
        </li>
        <li v-if="user" class="cursor-pointer" @click="handleLogout">Logout</li>
      </ul>
    </nav>
  </header>
  <teleport to="body">
    <CreatePost v-if="openModal" :toggleModal="toggleModal" />
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { logoutUserFn } from '@/api/authApi';
import { useMutation } from 'vue-query';
import { useAuthStore } from '@/stores/authStore';
import { createToast } from 'mosha-vue-toastify';
import CreatePost from '@/components/CreatePost.vue';

const authStore = useAuthStore();

const user = authStore.authUser;

const { mutate: logoutUser } = useMutation(() => logoutUserFn(), {
  onSuccess: () => {
    authStore.setAuthUser(null);
    document.location.href = '/login';
  },
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
});

const handleLogout = () => {
  logoutUser();
};

const openModal = ref(false);

function toggleModal() {
  openModal.value = !openModal.value;
}
</script>
