<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen pt-20">
    <div
      class="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center"
    >
      <div>
        <p class="text-5xl font-semibold">Profile Page</p>
        <div class="mt-8">
          <p class="mb-4">ID: {{ user?.id }}</p>
          <p class="mb-4">Name: {{ user?.name }}</p>
          <p class="mb-4">Email: {{ user?.email }}</p>
          <p class="mb-4">Role: {{ user?.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore();
const user = authStore.authUser;
</script>
