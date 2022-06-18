<template>
  <div class="h-screen w-screen fixed">
    <div class="absolute top-64 left-1/2 -translate-x-1/2">
      <Spinner :width="8" :height="8" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue';
</script>
