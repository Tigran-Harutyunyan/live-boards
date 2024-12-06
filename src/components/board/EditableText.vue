<script setup lang="ts">
import { ref, computed } from "vue";
import { cn, getContrastingTextColor, colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";

const { liveLayers } = storeToRefs(useRoomStore());

interface EditableTextProps {
  id: string;
  value: string;
  width: number;
  height: number;
  fill?: Color;
  isNote?: boolean;
}

const props = defineProps<EditableTextProps>();

const message = ref(props.value || "Text");

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = props.isNote ? 0.15 : 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return (
    Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize) + "px"
  );
};

const onInput = (e) => {
  liveLayers.value.get(props.id)?.set("value", e.target.innerText);
};

const textColor = computed(() =>
  props.fill
    ? props.isNote
      ? getContrastingTextColor(props.fill)
      : colorToCss(props.fill)
    : "#000"
);

const fontSize = computed(() => calculateFontSize(props.width, props.height));
</script>

<template>
  <div
    contenteditable
    :class="
      cn(
        'h-full w-full flex items-center justify-center text-center outline-none kalam-regular',
        !props.isNote && 'drop-shadow-md'
      )
    "
    :style="{
      fontSize: fontSize,
      color: textColor,
    }"
    @input="onInput"
  >
    {{ message }}
  </div>
</template>
