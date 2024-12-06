<script setup lang="ts">
import { RectangleLayer } from "@/types/canvas";
import { colorToCss } from "@/lib/utils";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  selectionColor?: string;
}

const props = defineProps<RectangleProps>();

type EmitType = {
  (event: "pointerDown", value: { e: PointerEvent; id: string }): void;
};

const emit = defineEmits<EmitType>();

const { x, y, width, height, fill } = props.layer;
</script>

<template>
  <rect
    class="drop-shadow-md"
    :style="{
      transform: `translate(${x}px, ${y}px)`,
    }"
    :x="0"
    :y="0"
    :width="width"
    :height="height"
    :strokeWidth="1"
    :fill="fill ? colorToCss(fill) : '#000'"
    :stroke="selectionColor || 'transparent'"
    @pointerdown="(e) => emit('pointerDown', { e, id })"
  />
</template>
