<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUser } from "@/store/useUser";
const { isSignedIn } = storeToRefs(useUser());
</script>

<template>
  <slot v-if="isSignedIn" />
</template>
