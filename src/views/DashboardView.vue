<script setup lang="ts">
import Dashboard from "@/components/dashboard/Dashboard.vue";
import { storeToRefs } from "pinia";
import { useUser } from "@/store/useUser";
const { isSignedIn } = storeToRefs(useUser());
</script>
<template>
  <Dashboard v-if="isSignedIn" />
</template>
