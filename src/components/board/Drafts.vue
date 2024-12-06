<script setup lang="ts">
import { colorToCss } from "@/lib/utils";
import type { User } from "@liveblocks/client";
import { Color } from "@/types/canvas";
import Path from "./Path.vue";

defineProps<{
  others: (User & {
    pencilDraft: [x: number, y: number, pressure: number][] | null;
    penColor: Color | null;
  })[];
}>();
</script>

<template>
  <template v-for="(other, index) in others">
    <Path
      v-if="other.pencilDraft"
      :key="index"
      :x="0"
      :y="0"
      :points="other.pencilDraft"
      :fill="other.penColor ? colorToCss(other.penColor) : '#000'"
    />
  </template>
</template>
