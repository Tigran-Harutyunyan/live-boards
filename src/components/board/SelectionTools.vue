<script setup lang="ts">
import { BringToFront, SendToBack, Trash2 } from "lucide-vue-next";
import { computed, watch, ref } from "vue";
import { LayerType, Camera, XYWH, Layer, Color } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import Hint from "@/components/Hint.vue";
import ColorPicker from "./ColorPicker.vue";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";

interface SelectionToolsProps {
  camera: Camera;
}

type EmitType = {
  (event: "setLastUsedColor", color: Color): void;
  (event: "deleteLayers"): void;
};

const emit = defineEmits<EmitType>();

const props = defineProps<SelectionToolsProps>();

const { liveLayers, liveLayerIds, myPresence } = storeToRefs(useRoomStore());
const { getLayerById } = useRoomStore();

const selection = computed(() => myPresence?.value.selection);

const isShowingHandles = ref();
const bounds = ref();
const showMoveTools = ref(true);

const x = computed(
  () => bounds.value.width / 2 + bounds.value.x + props.camera.x
);

const y = computed(() => bounds.value.y + props.camera.y);

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

const soleLayerId = computed(() => {
  if (myPresence?.value?.selection) {
    return Array.isArray(myPresence?.value?.selection) &&
      myPresence?.value?.selection?.length === 1
      ? myPresence?.value?.selection[0]
      : null;
  }
});

const moveToFront = () => {
  const indices: number[] = [];

  const arr = liveLayerIds.value.toImmutable();
  const selection = myPresence?.value?.selection;

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(selection) && selection?.includes(arr[i])) {
      indices.push(i);
    }
  }

  for (let i = indices.length - 1; i >= 0; i--) {
    liveLayerIds.value.move(
      indices[i],
      arr.length - 1 - (indices.length - 1 - i)
    );
  }
};

const moveToBack = () => {
  const indices: number[] = [];

  const arr = liveLayerIds.value.toImmutable();
  const selection = myPresence.value?.selection;

  for (let i = 0; i < arr.length; i++) {
    if (selection && Array.isArray(selection) && selection?.includes(arr[i])) {
      indices.push(i);
    }
  }

  for (let i = 0; i < indices.length; i++) {
    liveLayerIds.value.move(indices[i], i);
  }
};

const setFill = (fill: Color) => {
  emit("setLastUsedColor", fill);

  if (Array.isArray(selection.value)) {
    selection.value?.forEach((id) => {
      liveLayers.value.get(id)?.set("fill", fill);
    });
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

watch(
  () => myPresence.value?.selection,
  async (newVal) => {
    const selectedLayers = await getLayers(newVal);
    bounds.value = boundingBox(selectedLayers);
    const layer = await getLayerById(soleLayerId.value);
    isShowingHandles.value =
      soleLayerId.value && layer?.type !== LayerType.Path;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div
    v-if="bounds"
    class="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
    :style="{
      transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`,
    }"
  >
    <ColorPicker @change="setFill" />
    <div v-if="showMoveTools" class="flex flex-col gap-y-0.5">
      <Hint label="Bring to front">
        <Button @click="moveToFront()" variant="board" size="icon">
          <BringToFront />
        </Button>
      </Hint>
      <Hint label="Send to back" side="bottom">
        <Button @click="moveToBack()" variant="board" size="icon">
          <SendToBack />
        </Button>
      </Hint>
    </div>
    <div class="flex items-center pl-2 ml-2 border-l border-neutral-200">
      <Hint label="Delete">
        <Button variant="board" size="icon" @click="emit('deleteLayers')">
          <Trash2 />
        </Button>
      </Hint>
    </div>
  </div>
</template>
