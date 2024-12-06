<script setup lang="ts">
import ColorButton from "./ColorButton.vue";
import { Color } from "@/types/canvas";

type EmitType = {
  (event: "change", color: Color): void;
};

const emit = defineEmits<EmitType>();
</script>

<template>
  <div
    class="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200"
  >
    <ColorButton
      :color="{ r: 243, g: 82, b: 35 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 255, g: 249, b: 177 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 68, g: 202, b: 99 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 39, g: 142, b: 237 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 155, g: 105, b: 245 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 252, g: 142, b: 42 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 0, g: 0, b: 0 }"
      @select="(color) => emit('change', color)"
    />
    <ColorButton
      :color="{ r: 255, g: 255, b: 255 }"
      @select="(color) => emit('change', color)"
    />
  </div>
</template>
