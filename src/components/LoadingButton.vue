<template>
  <button
    type="submit"
    :class="`w-full py-3 font-semibold ${btnColor} rounded-lg outline-none border-none flex justify-center ${
      loading ? 'bg-[#ccc]' : ''
    }`"
    :disabled="loading"
  >
    <div v-if="loading" class="flex items-center gap-3">
      <Spinner />
      <span class="text-slate-500">Loading...</span>
    </div>
    <span v-else :class="`${textColor}`"><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import Spinner from '@/components/icons/Spinner.vue';
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  btnColor: {
    type: String,
    default: 'bg-ct-yellow-600',
  },
  textColor: {
    type: String,
    default: 'text-white',
  },
});
</script>
