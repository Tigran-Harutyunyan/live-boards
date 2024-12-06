<script setup lang="ts">
import { TextLayer } from "@/types/canvas";
import EditableText from "./EditableText.vue";

interface NoteProps {
  id: string;
  layer: TextLayer;
  selectionColor?: string;
}

const props = defineProps<NoteProps>();

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

const { x, y, width, height, fill, value } = props.layer;
</script>

<template>
  <foreignObject
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    @pointerdown="(e: PointerEvent) => emit('pointerDown', { e, id })"
    :style="{
      outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
    }"
  >
    <EditableText
      :x="x"
      :y="y"
      :id="id"
      :value="value || 'Text'"
      :fill="fill"
      :width="width"
      :height="height"
    />
  </foreignObject>
</template>
