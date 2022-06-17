<template>
  <Header />
  <section class="bg-ct-blue-600 min-h-screen py-12">
    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
      <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { getAllPostsFn } from '@/api/postApi';
import Header from '@/components/Header.vue';
import PostItem from '@/components/PostItem.vue';
import CreatePost from '@/components/CreatePost.vue';
import { useQuery } from 'vue-query';

const { data: posts } = useQuery(['posts'], () => getAllPostsFn(), {
  select: (data) => data.data.posts,
});
</script>
