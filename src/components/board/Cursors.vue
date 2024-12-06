<script setup lang="ts">
import Cursor from "./Cursor.vue";
import type { User } from "@liveblocks/client";

defineProps<{
  others: User[];
}>();
</script>

<template>
  <!-- Iterate through others and show their cursors -->
  <template v-for="{ connectionId, presence } in others">
    <Cursor
      v-if="presence.cursor"
      :connectionId="connectionId"
      :x="presence.cursor.x"
      :y="presence.cursor.y"
    />
  </template>
</template>
