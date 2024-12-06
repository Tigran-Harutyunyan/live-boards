<script setup lang="ts">
import { MousePointer2 } from "lucide-vue-next";
import { connectionIdToColor } from "@/lib/utils";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";

interface CursorProps {
  connectionId: number;
  x: number;
  y: number;
}

const props = defineProps<CursorProps>();

const { room } = storeToRefs(useRoomStore());

const others = room.value?.getOthers();

const selected = others?.find(
  (user) => user.connectionId == props.connectionId
);

const name = selected?.presence.name || "Teammate";

const width =
  typeof name === "string" && name.length ? name.length * 10 + 24 : 10 + 24;
</script>

<template>
  <foreignObject
    :style="{
      transform: `translateX(${x}px) translateY(${y}px)`,
    }"
    :height="50"
    :width="width"
    class="relative drop-shadow-md"
  >
    <MousePointer2
      class="h-5 w-5"
      :style="{
        fill: connectionIdToColor(connectionId),
        color: connectionIdToColor(connectionId),
      }"
    />
    <div
      class="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
      :style="{ backgroundColor: connectionIdToColor(connectionId) }"
    >
      {{ name }}
    </div>
  </foreignObject>
</template>
