<script setup lang="ts">
import { Color } from "@/types/canvas";
import { colorToCss } from "@/lib/utils";

type EmitType = {
  (event: "select", color: Color): void;
};

const emit = defineEmits<EmitType>();

interface ColorButtonProps {
  color: Color;
}

defineProps<ColorButtonProps>();
</script>

<template>
  <button
    class="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
    @click="emit('select', color)"
  >
    <div
      class="h-8 w-8 rounded-md border border-neutral-300"
      :style="{ background: colorToCss(color) }"
    />
  </button>
</template>
