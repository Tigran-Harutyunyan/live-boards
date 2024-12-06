<script setup lang="ts">
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-vue-next";

import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

import ToolButton from "./ToolButton.vue";

interface ToolbarProps {
  canvasState: CanvasState;
  canUndo: boolean;
  canRedo: boolean;
}

type EmitType = {
  (event: "undo"): void;
  (event: "redo"): void;
  (event: "setCanvasState", newState: CanvasState): void;
};

const emit = defineEmits<EmitType>();

defineProps<ToolbarProps>();
</script>

<template>
  <div
    class="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4"
  >
    <div
      class="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md"
    >
      <ToolButton
        label="Select"
        @click="
          emit('setCanvasState', {
            mode: CanvasMode.None,
          })
        "
        :isActive="
          canvasState.mode === CanvasMode.None ||
          canvasState.mode === CanvasMode.Translating ||
          canvasState.mode === CanvasMode.SelectionNet ||
          canvasState.mode === CanvasMode.Pressing ||
          canvasState.mode === CanvasMode.Resizing
        "
      >
        <MousePointer2 />
      </ToolButton>

      <ToolButton
        label="Text"
        @click="
          emit('setCanvasState', {
            mode: CanvasMode.Inserting,
            layerType: LayerType.Text,
          })
        "
        :isActive="
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.Text
        "
      >
        <Type />
      </ToolButton>
      <ToolButton
        label="Sticky note"
        @click="
          emit('setCanvasState', {
            mode: CanvasMode.Inserting,
            layerType: LayerType.Note,
          })
        "
        :isActive="
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.Note
        "
      >
        <StickyNote />
      </ToolButton>

      <ToolButton
        label="Rectangle"
        @click="
          emit('setCanvasState', {
            mode: CanvasMode.Inserting,
            layerType: LayerType.Rectangle,
          })
        "
        :isActive="
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.Rectangle
        "
      >
        <Square />
      </ToolButton>
      <ToolButton
        label="Ellipse"
        @click="
          emit('setCanvasState', {
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse,
          })
        "
        :isActive="
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.Ellipse
        "
      >
        <Circle />
      </ToolButton>
      <ToolButton
        label="Pen"
        @click="
          emit('setCanvasState', {
            mode: CanvasMode.Pencil,
          })
        "
        :isActive="canvasState.mode === CanvasMode.Pencil"
      >
        <Pencil />
      </ToolButton>
    </div>
    <div class="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
      <ToolButton label="Undo" @click="emit('undo')" :isDisabled="!canUndo">
        <Undo2 />
      </ToolButton>
      <ToolButton label="Redo" @click="emit('redo')" :isDisabled="!canRedo">
        <Redo2 />
      </ToolButton>
    </div>
  </div>
</template>
