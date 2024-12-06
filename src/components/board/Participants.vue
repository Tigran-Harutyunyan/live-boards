<script setup lang="ts">
import { connectionIdToColor } from "@/lib/utils";
import UserAvatar from "./UserAvatar.vue";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const MAX_SHOWN_USERS = 2;

const { currentUser, others } = storeToRefs(useRoomStore());

const hasMoreUsers = computed(() => {
  return others.value?.length ? others.value.length > MAX_SHOWN_USERS : false;
});
</script>

<template>
  <div
    class="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md"
  >
    <div class="flex gap-x-2">
      <template v-if="others && Array.isArray(others)">
        <UserAvatar
          v-for="{ connectionId, presence } in others.slice(0, MAX_SHOWN_USERS)"
          :borderColor="connectionIdToColor(connectionId)"
          :key="connectionId"
          :src="presence?.avatar"
          :name="presence?.name"
          :fallback="presence?.name?.[0] || 'T'"
        />
      </template>

      <UserAvatar
        v-if="currentUser"
        :borderColor="connectionIdToColor(currentUser.connectionId)"
        :src="currentUser?.presence?.avatar || ''"
        :name="`${currentUser?.presence?.name} (You)`"
        :fallback="currentUser?.presence?.name?.[0]"
      />

      <UserAvatar
        v-if="hasMoreUsers"
        :name="`${Array.isArray(others) ? others?.length - MAX_SHOWN_USERS : ''} more`"
        :fallback="`+${Array.isArray(others) ? others?.length - MAX_SHOWN_USERS : ''}`"
      />
    </div>
  </div>
</template>
