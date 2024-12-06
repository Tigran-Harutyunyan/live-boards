<script setup lang="ts">
import { NoteLayer } from "@/types/canvas";
import { colorToCss } from "@/lib/utils";
import { toRefs } from "vue";

import EditableText from "./EditableText.vue";

interface NoteProps {
  id: string;
  layer: NoteLayer;
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

const { x, y, width, height, fill, value } = toRefs(props.layer);
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
      backgroundColor: fill ? colorToCss(fill) : '#000',
    }"
    class="shadow-md drop-shadow-xl"
  >
    <EditableText
      :x="x"
      :y="y"
      :id="id"
      :value="value || ''"
      :fill="fill"
      :width="width"
      :height="height"
      is-note
    />
  </foreignObject>
</template>
