<script setup lang="ts">
import { onUnmounted } from "vue";
import RenameModal from "@/components/modals/RenameModal.vue";
import Loader from "@/components/Loader.vue";
import Canvas from "@/components/Canvas.vue";
import {
  createClient,
  LiveMap,
  LiveList,
  LiveObject,
} from "@liveblocks/client";
import { Layer } from "@/types/canvas";
import { useRoomStore } from "@/store/useRoomStore";
import { useBoardId } from "@/composables/useBoardId";
import { useGetBoardById } from "@/api/useGetBoardById";
import { useClerk } from "vue-clerk";

const { user } = useClerk();

const { boardId } = useBoardId();

if (!boardId.value) throw new Error("Room ID is not provided");

const { data: board, isLoading } = useGetBoardById(boardId.value);

const { initRoom, unsubscribeAll } = useRoomStore();

const initialPresence = {
  cursor: null,
  selection: [],
  pencilDraft: null,
  penColor: null,
  name: user?.fullName,
  avatar: user?.imageUrl,
};

const initialStorage = {
  layers: new LiveMap<string, LiveObject<Layer>>(),
  layerIds: new LiveList([]),
};

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEYS,
});

const { room, leave } = client.enterRoom(boardId.value, {
  initialPresence,
  initialStorage,
});

if (room) {
  initRoom(room);
}

onUnmounted(() => {
  unsubscribeAll();
  leave();
});
</script>

<template>
  <Loader v-if="isLoading" />
  <Canvas v-if="!isLoading && board && room" :boardId="boardId" />
  <RenameModal />
</template>
