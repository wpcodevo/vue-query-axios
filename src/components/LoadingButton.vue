<template>
  <button
    type="submit"
    class="w-full py-3 font-semibold bg-ct-yellow-600 rounded-lg outline-none border-none flex justify-center"
    :disabled="loading"
    :style="[loading ? { backgroundColor: '#ccc' } : {}]"
  >
    <div v-if="loading" class="flex items-center gap-3">
      <Spinner />
      <span class="text-ct-blue-600">Loading...</span>
    </div>
    <span v-else class="text-ct-blue-600"><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue';
defineProps<{
  loading: boolean;
}>();
</script>
