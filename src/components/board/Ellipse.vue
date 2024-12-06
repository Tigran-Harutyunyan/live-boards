<script setup lang="ts">
import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  selectionColor?: string;
}

defineProps<EllipseProps>();

type EmitType = {
  (
    event: "pointerDown",
    value: {
      e: PointerEvent;
      id: string;
    }
  ): void;
};

const emit = defineEmits<EmitType>();
</script>

<template>
  <ellipse
    class="drop-shadow-md"
    @pointerdown="(e: PointerEvent) => emit('pointerDown', { e, id })"
    :style="{
      transform: `translate(
          ${layer.x}px,
          ${layer.y}px
        )`,
    }"
    :cx="layer.width / 2"
    :cy="layer.height / 2"
    :rx="layer.width / 2"
    :ry="layer.height / 2"
    :fill="layer.fill ? colorToCss(layer.fill) : '#000'"
    :stroke="selectionColor || 'transparent'"
    :strokeWidth="1"
  />
</template>
