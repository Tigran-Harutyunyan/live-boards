<script setup lang="ts">
import Cursors from "./Cursors.vue";
import Drafts from "./Drafts.vue";
import { computed } from "vue";
import { useRoomStore } from "@/store/useRoomStore";
import { storeToRefs } from "pinia";
const { others } = storeToRefs(useRoomStore());

const othersMapped = computed(() => {
  if (Array.isArray(others.value)) {
    return others.value.map((other) => {
      return {
        ...other,
        pencilDraft: other.presence.pencilDraft,
        penColor: other.presence.penColor,
      };
    });
  }
  return [];
});
</script>

<template>
  <Drafts :others="othersMapped" />
  <Cursors :others="others" />
</template>
