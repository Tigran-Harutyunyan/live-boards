<script setup lang="ts">
import { colorToCss } from "@/lib/utils";
import { LayerType } from "@/types/canvas";
import Text from "@/components/board/Text.vue";
import Ellipse from "@/components/board/Ellipse.vue";
import Rectangle from "@/components/board/Rectangle.vue";
import Note from "@/components/board/Note.vue";
import Path from "@/components/board/Path.vue";
import { onMounted, ref } from "vue";
import { useRoomStore } from "@/store/useRoomStore";

interface LayerPreviewProps {
  id: string;
  selectionColor?: string;
}

type EmitType = {
  (
    event: "layerPointerDown",
    value: {
      e: PointerEvent;
      layerId: string;
    }
  ): void;
};
const props = defineProps<LayerPreviewProps>();
const emit = defineEmits<EmitType>();

const layer = ref();

const { getLayerById } = useRoomStore();

const onLayerPointerDown = (data: { e: PointerEvent; id: string }) => {
  const { e, id } = data;
  emit("layerPointerDown", {
    e,
    layerId: id,
  });
};

onMounted(async () => {
  const response = await getLayerById(props.id);
  if (response) {
    layer.value = response;
  }

  if (!props.id) {
    debugger;
  }
});
</script>

<template>
  <template v-if="layer && 'type' in layer">
    <Path
      v-if="layer.type === LayerType.Path"
      :key="id"
      :id="id"
      :points="layer.points"
      :x="layer.x"
      :y="layer.y"
      :fill="layer.fill ? colorToCss(layer.fill) : '#000'"
      :stroke="selectionColor"
      @pointerDown="onLayerPointerDown"
    />

    <Note
      v-else-if="layer.type === LayerType.Note"
      :id="id"
      :layer="layer"
      :selection-color="selectionColor"
      @pointerDown="onLayerPointerDown"
    />

    <Text
      v-else-if="layer.type === LayerType.Text"
      :id="id"
      :layer="layer"
      :selection-color="selectionColor"
      @pointerDown="onLayerPointerDown"
    />

    <Ellipse
      v-else-if="layer.type === LayerType.Ellipse"
      :id="id"
      :layer="layer"
      :selection-color="selectionColor"
      @pointerDown="onLayerPointerDown"
    />

    <Rectangle
      v-else-if="layer.type === LayerType.Rectangle"
      :id="id"
      :layer="layer"
      :selection-color="selectionColor"
      @pointerDown="onLayerPointerDown"
    />
  </template>
</template>
