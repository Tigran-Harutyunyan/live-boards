<script setup lang="ts">
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";

import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import { useDisableScrollBounce } from "@/composables/useDisableScrollBounce";

import Info from "@/components/board/Info.vue";
import Path from "@/components/board/Path.vue";
import Toolbar from "@/components/board/Toolbar.vue";
import Participants from "@/components/board/Participants.vue";
import CursorsPresence from "@/components/board/CursorsPresence.vue";
import LayerPreview from "@/components/board/LayerPreview.vue";
import SelectionBox from "@/components/board/SelectionBox.vue";
import SelectionTools from "@/components/board/SelectionTools.vue";

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

defineProps<CanvasProps>();

const selections = computed(() => {
  if (Array.isArray(others?.value)) {
    return others?.value?.map((other) => [
      other.connectionId,
      other.presence.selection,
    ]);
  }
  return [];
});

const canvasState = ref<CanvasState>({
  mode: CanvasMode.None,
});

const {
  root,
  room,
  others,
  layerIds,
  liveLayers,
  updateCount,
  liveLayerIds,
  canRedo,
  canUndo,
  myPresence,
} = storeToRefs(useRoomStore());

const { getStorage, updateCounter } = useRoomStore();

useDisableScrollBounce();

const camera = ref<Camera>({ x: 0, y: 0 });

const pencilDraft = computed(() => myPresence.value?.pencilDraft);

const lastUsedColor = ref<Color>({
  r: 0,
  g: 0,
  b: 0,
});

const isResizing = ref(false);

const continueDrawing = (point: Point, e: PointerEvent) => {
  const { pencilDraft } = myPresence.value;

  if (
    canvasState.value.mode !== CanvasMode.Pencil ||
    e.buttons !== 1 ||
    pencilDraft == null
  ) {
    return;
  }

  room.value?.updatePresence({
    cursor: point,
    pencilDraft:
      pencilDraft.length === 1 &&
      pencilDraft[0][0] === point.x &&
      pencilDraft[0][1] === point.y
        ? pencilDraft
        : [...pencilDraft, [point.x, point.y, e.pressure]],
  });
};

const resizeSelectedLayer = (point: Point) => {
  if (canvasState.value.mode !== CanvasMode.Resizing) {
    return;
  }

  if (
    canvasState.value.initialBounds === undefined ||
    canvasState.value.corner === undefined
  )
    return;

  const bounds = resizeBounds(
    canvasState.value.initialBounds,
    canvasState.value.corner,
    point
  );

  const layer = liveLayers.value.get(myPresence.value?.selection[0]);

  if (layer) {
    layer.update(bounds);
  }

  isResizing.value = true;
  updateCounter();
};

const translateSelectedLayers = (point: Point) => {
  if (canvasState.value.mode !== CanvasMode.Translating) {
    return;
  }

  const offset = {
    x: point.x - canvasState.value?.current.x,
    y: point.y - canvasState.value?.current.y,
  };

  if (!myPresence || !myPresence?.value?.selection) return;

  const liveLayers = root.value.get("layers");

  for (const id of myPresence?.value?.selection) {
    const layer = liveLayers.get(id);

    if (layer) {
      layer.update({
        x: layer.get("x") + offset.x,
        y: layer.get("y") + offset.y,
      });
    }
  }

  canvasState.value = { mode: CanvasMode.Translating, current: point };
  isResizing.value = true;
  updateCounter();
};

const unselectLayers = () => {
  if (
    myPresence.value?.selection &&
    Array.isArray(myPresence.value?.selection) &&
    myPresence.value?.selection?.length > 0
  ) {
    room.value?.updatePresence({ selection: [] }, { addToHistory: true });
  }
};

const updateSelectionNet = (current: Point, origin: Point) => {
  const layers = liveLayers.value.toImmutable();
  canvasState.value = {
    mode: CanvasMode.SelectionNet,
    origin,
    current,
  };

  const ids = findIntersectingLayersWithRectangle(
    layerIds.value,
    layers,
    origin,
    current
  );
  room.value?.updatePresence({ selection: ids });
};

const startMultiSelection = (current: Point, origin: Point) => {
  if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
    canvasState.value = {
      mode: CanvasMode.SelectionNet,
      origin,
      current,
    };
  }
};

const onResizeHandlePointerDown = ({
  corner,
  initialBounds,
}: {
  corner: Side;
  initialBounds: XYWH;
}) => {
  room.value?.history.pause();
  canvasState.value = {
    mode: CanvasMode.Resizing,
    initialBounds,
    corner,
  };
};

const onPointerMove = (e: PointerEvent) => {
  e.preventDefault();

  const current = pointerEventToCanvasPoint(e, camera.value);

  if (canvasState.value.mode === CanvasMode.Pressing) {
    startMultiSelection(current, canvasState.value.origin);
  } else if (canvasState.value.mode === CanvasMode.SelectionNet) {
    updateSelectionNet(current, canvasState.value.origin);
  } else if (canvasState.value.mode === CanvasMode.Translating) {
    translateSelectedLayers(current);
  } else if (canvasState.value.mode === CanvasMode.Resizing) {
    resizeSelectedLayer(current);
  } else if (canvasState.value.mode === CanvasMode.Pencil) {
    continueDrawing(current, e);
  }

  room.value?.updatePresence({ cursor: current });
};

const onPointerDown = (e: PointerEvent) => {
  const point = pointerEventToCanvasPoint(e, camera.value);

  if (canvasState.value.mode === CanvasMode.Inserting) {
    return;
  }

  if (canvasState.value.mode === CanvasMode.Pencil) {
    startDrawing(point, e.pressure);
    return;
  }

  canvasState.value = { origin: point, mode: CanvasMode.Pressing };
};

const onWheel = (e: WheelEvent) => {
  camera.value = {
    x: camera.value.x - e.deltaX,
    y: camera.value.y - e.deltaY,
  };
};

const onPointerUp = (e: PointerEvent) => {
  const point = pointerEventToCanvasPoint(e, camera.value);

  if (
    canvasState.value.mode === CanvasMode.None ||
    canvasState.value.mode === CanvasMode.Pressing
  ) {
    unselectLayers();

    canvasState.value = {
      mode: CanvasMode.None,
    };
  } else if (canvasState.value.mode === CanvasMode.Pencil) {
    insertPath();
  } else if (canvasState.value.mode === CanvasMode.Inserting) {
    insertLayer(canvasState.value?.layerType, point);
  } else {
    canvasState.value = {
      mode: CanvasMode.None,
    };
  }

  room.value?.history.resume();
};

const onPointerLeave = () => {
  room.value?.updatePresence({
    cursor: null,
  });
};

const layerIdsToColorSelection = computed(() => {
  const layerIdsToColorSelection: Record<string, string> = {};

  for (const user of selections.value) {
    const [connectionId, selection] = user;

    for (const layerId of selection) {
      if (layerId) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }
  }

  return layerIdsToColorSelection;
});

const insertLayer = async (
  layerType:
    | LayerType.Ellipse
    | LayerType.Rectangle
    | LayerType.Text
    | LayerType.Note,
  position: Point
) => {
  if (liveLayers.value?.size >= MAX_LAYERS) {
    return;
  }
  room.value?.history.pause();

  const layerId = nanoid();
  const layer = new LiveObject({
    type: layerType,
    x: position.x,
    y: position.y,
    height: 100,
    width: 100,
    fill: lastUsedColor.value,
  });

  liveLayerIds.value.push(layerId);
  liveLayers.value?.set(layerId, layer);

  room.value?.history.resume();
  room.value?.updatePresence({ selection: [layerId] }, { addToHistory: true });
  canvasState.value = { mode: CanvasMode.None };
  getStorage();
};

const startDrawing = (point: Point, pressure: number) => {
  room.value?.updatePresence({
    pencilDraft: [[point.x, point.y, pressure]],
    penColor: lastUsedColor.value,
  });
};

const insertPath = () => {
  const { pencilDraft } = myPresence.value;

  if (
    pencilDraft == null ||
    pencilDraft?.length < 2 ||
    liveLayers.value.size >= MAX_LAYERS
  ) {
    room.value?.updatePresence({ pencilDraft: null });
    return;
  }

  const id = nanoid();
  liveLayers.value.set(
    id,
    new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor.value))
  );

  liveLayerIds.value.push(id);

  room.value?.updatePresence({ pencilDraft: null });
  canvasState.value = { mode: CanvasMode.Pencil };
  getStorage();
};

const onLayerPointerDown = (data: { e: PointerEvent; layerId: string }) => {
  const { e, layerId } = data;
  if (
    canvasState.value.mode === CanvasMode.Pencil ||
    canvasState.value.mode === CanvasMode.Inserting
  ) {
    return;
  }

  room.value?.history.pause();

  e.stopPropagation();

  const point = pointerEventToCanvasPoint(e, camera.value);

  if (!myPresence.value?.selection?.includes(layerId)) {
    room.value?.updatePresence(
      { selection: [layerId] },
      { addToHistory: true }
    );
  }
  canvasState.value = { mode: CanvasMode.Translating, current: point };
};

const deleteLayers = () => {
  if (!myPresence.value?.selection) return;

  room.value?.history.pause();

  const liveLayerIds = root.value.get("layerIds");

  for (const id of myPresence.value?.selection) {
    liveLayers.value.delete(id);
    const index = liveLayerIds.indexOf(id);

    if (index !== -1) {
      liveLayerIds.delete(index);
    }
  }

  room.value?.updatePresence({ selection: [] }, { addToHistory: true });
  room.value?.history.resume();
  updateCounter();
};

const onHistoryOperation = (mode: "undo" | "redo") => {
  if (mode === "undo") {
    room.value?.history.undo();
  } else {
    room.value?.history.redo();
  }
  updateCounter();
  isResizing.value = true;
};

const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "z": {
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey) {
          onHistoryOperation("redo");
        } else {
          onHistoryOperation("undo");
        }
        break;
      }
    }
  }
};

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
  <main class="h-full w-full relative bg-neutral-100 touch-none">
    <Info :board-id="boardId" />

    <Participants />

    <Toolbar
      :canvasState="canvasState"
      :can-redo="canRedo"
      :can-undo="canUndo"
      @set-canvas-state="(e) => (canvasState = e)"
      @undo="onHistoryOperation('undo')"
      @redo="onHistoryOperation('redo')"
    />

    <SelectionTools
      :room="room"
      :camera="camera"
      :key="Number(isResizing) + updateCount"
      @set-last-used-color="
        (color: Color) => {
          lastUsedColor = color;
          room?.updatePresence({});
          updateCounter();
        }
      "
      @delete-layers="deleteLayers()"
    />
    <svg
      class="h-[100vh] w-[100vw]"
      @wheel="onWheel"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    >
      <g
        :style="{
          transform: `translate(${camera.x}px, ${camera.y}px)`,
        }"
      >
        <LayerPreview
          v-for="layerId in layerIds"
          :key="layerId + updateCount"
          :id="layerId"
          :selectionColor="layerIdsToColorSelection[layerId]"
          @layer-pointer-down="onLayerPointerDown"
        />

        <SelectionBox
          :is-resizing="isResizing"
          :key="updateCount"
          @resize-handle-pointer-down="onResizeHandlePointerDown"
          @finished="isResizing = false"
        />

        <rect
          v-if="
            canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null
          "
          class="fill-blue-500/5 stroke-blue-500 stroke-1"
          :x="Math.min(canvasState.origin.x, canvasState.current.x)"
          :y="Math.min(canvasState.origin.y, canvasState.current.y)"
          :width="Math.abs(canvasState.origin.x - canvasState.current.x)"
          :height="Math.abs(canvasState.origin.y - canvasState.current.y)"
        />

        <CursorsPresence />
        <Path
          v-if="pencilDraft != null && pencilDraft?.length > 0"
          :points="pencilDraft"
          :fill="colorToCss(lastUsedColor)"
          :x="0"
          :y="0"
        />
      </g>
    </svg>
  </main>
</template>
