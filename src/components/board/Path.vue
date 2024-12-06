<script setup lang="ts">
import getStroke from "perfect-freehand";

import { getSvgPathFromStroke } from "@/lib/utils";

interface PathProps {
  x: number;
  y: number;
  id?: string;
  points: number[][];
  fill: string;
  stroke?: string;
}

defineProps<PathProps>();

type EmitType = {
  (event: "undo"): void;
  (event: "redo"): void;
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
  <path
    class="drop-shadow-md"
    :d="
      getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )
    "
    @pointerdown="(e: PointerEvent) => emit('pointerDown', { e, id })"
    :style="{
      transform: `translate(${x}px, ${y}px)`,
    }"
    :x="0"
    :y="0"
    :fill="fill"
    :stroke="stroke"
    :strokeWidth="1"
  />
</template>
