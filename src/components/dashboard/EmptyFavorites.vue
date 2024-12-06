<script setup lang="ts">
import imgFavor from "@/assets/images/empty-favorites.svg";
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <img :src="imgFavor" height="140" width="140" alt="Empty" />
    <h2 class="text-2xl font-semibold mt-6">No favorite boards!</h2>
    <p class="text-muted-foreground textg-sm mt-2">Try favoriting a board</p>
  </div>
</template>
