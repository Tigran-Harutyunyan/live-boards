<script setup lang="ts">
import Board from "@/components/board/Board.vue";
import { storeToRefs } from "pinia";
import { useUser } from "@/store/useUser";
const { isSignedIn } = storeToRefs(useUser());
</script>

<template>
  <Board v-if="isSignedIn" />
</template>
