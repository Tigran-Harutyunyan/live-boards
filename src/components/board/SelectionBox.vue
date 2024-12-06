<script setup lang="ts">
import { watch, ref } from "vue";
import { LayerType, Side, XYWH, Layer } from "@/types/canvas";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";

const HANDLE_WIDTH = 8;

type EmitType = {
  (
    event: "resizeHandlePointerDown",
    value: {
      corner: Side;
      initialBounds: XYWH;
    }
  ): void;
  (event: "finished"): void;
};

const emit = defineEmits<EmitType>();

interface SelectionBoxProps {
  isResizing: boolean;
}

const props = defineProps<SelectionBoxProps>();
const isShowingHandles = ref();
const bounds = ref();
const soleLayerId = ref();

const { getLayerById } = useRoomStore();
const { myPresence } = storeToRefs(useRoomStore());

const boundingBox = (layers: Layer[]): XYWH | null => {
  if (!layers) return null;

  const first = layers[0];

  if (!first?.width && !first?.height) {
    return null;
  }

  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

const getSoleLayerId = () => {
  if (myPresence?.value.selection) {
    return Array.isArray(myPresence?.value.selection) &&
      myPresence?.value?.selection?.length === 1
      ? myPresence?.value?.selection[0]
      : null;
  }
};

const getLayers = async (selection) => {
  if (!selection) return;
  return await Promise.all(
    selection.map(async (layerId: string) => {
      return await getLayerById(layerId);
    })
  );
};

const updateData = async () => {
  const selectedLayers = await getLayers(myPresence?.value?.selection);

  if (!selectedLayers) return;

  bounds.value = boundingBox(selectedLayers);

  soleLayerId.value = getSoleLayerId();

  const layer = await getLayerById(soleLayerId.value as string);

  isShowingHandles.value = soleLayerId.value && layer?.type !== LayerType.Path;
};

watch(
  () => myPresence.value?.selection,
  () => {
    updateData();
  },
  {
    immediate: true,
  }
);

watch(
  () => props.isResizing,
  () => {
    updateData();
    emit("finished");
  }
);
</script>

<template>
  <template v-if="bounds">
    <rect
      class="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
      :style="{
        transform: `translate(${bounds.x}px, ${bounds.y}px)`,
      }"
      :x="0"
      :y="0"
      :width="bounds.width"
      :height="bounds.height"
    />

    <template v-if="isShowingHandles">
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'nwse-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
            translate(
              ${bounds.x - HANDLE_WIDTH / 2}px,
              ${bounds.y - HANDLE_WIDTH / 2}px
            )
        `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Top + Side.Left,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
              translate(
                ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px
              )
            `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Top,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
              translate(
                ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
                ${bounds.y - HANDLE_WIDTH / 2}px
              )
            `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Top + Side.Right,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
            translate(
              ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
              ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px
              )
          `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Right,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
            translate(
               ${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, 
               ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
              )
          `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Bottom + Side.Right,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
            translate(
               ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,
               ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
              )
          `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Bottom,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
            translate(
              ${bounds.x - HANDLE_WIDTH / 2}px,
              ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px
            )
          `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Bottom + Side.Left,
              initialBounds: bounds,
            });
          }
        "
      />
      <rect
        class="fill-white stroke-1 stroke-blue-500"
        :x="0"
        :y="0"
        :style="{
          cursor: 'ns-resize',
          width: `${HANDLE_WIDTH}px`,
          height: `${HANDLE_WIDTH}px`,
          transform: `
            translate(
               ${bounds.x - HANDLE_WIDTH / 2}px,
               ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px
              )
          `,
        }"
        @pointerdown="
          (e) => {
            e.stopPropagation();
            emit('resizeHandlePointerDown', {
              corner: Side.Left,
              initialBounds: bounds,
            });
          }
        "
      />
    </template>
  </template>
</template>
