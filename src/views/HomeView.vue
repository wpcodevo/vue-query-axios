<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen py-12">
    <LoadingProgress v-if="isLoading" />
    <div v-else>
      <Message v-if="posts && posts.length === 0" />
      <div
        v-if="posts && posts.length > 0"
        class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 px-6"
      >
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getAllPostsFn } from '@/api/postApi';
import Header from '@/components/Header.vue';
import PostItem from '@/components/PostItem.vue';
import LoadingProgress from '@/components/LoadingProgress.vue';
import Message from '@/components/Message.vue';
import { useQuery } from 'vue-query';

const { data: posts, isLoading } = useQuery(['posts'], () => getAllPostsFn(), {
  select: (data) => data.data.posts,
});
</script>
