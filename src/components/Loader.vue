<script setup lang="ts">
import LogoIcon from "@/components/icons/LogoIcon.vue";
</script>

<template>
  <div class="h-full w-full flex flex-col justify-center items-center">
    <component
      :is="LogoIcon"
      alt="Logo"
      :width="120"
      :height="120"
      class="animate-pulse duration-700"
    />
  </div>
</template>
