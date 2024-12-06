<script setup lang="ts">
import { Star } from "lucide-vue-next";

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  disabled: boolean;
}
const { title, authorLabel, createdAtLabel, isFavorite, disabled } =
  defineProps<FooterProps>();

const emit = defineEmits(["click"]);
</script>

<template>
  <div class="relative bg-white p-3">
    <p class="text-[13px] truncate max-w-[calc(100%-20px)]">
      {{ title }}
    </p>
    <p
      class="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate"
    >
      {{ authorLabel }}, {{ createdAtLabel }}
    </p>
    <button
      :disabled="disabled"
      @click.stop.prevent="emit('click')"
      class="opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600"
      :class="{ 'cursor-not-allowed opacity-75': disabled }"
    >
      <Star
        class="h-4 w-4"
        :class="{ 'fill-blue-600 text-blue-600': isFavorite }"
      />
    </button>
  </div>
</template>
