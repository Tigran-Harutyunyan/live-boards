<script setup lang="ts">
import imgSearch from "@/assets/images/empty-search.svg";
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center">
    <img :src="imgSearch" height="140" width="140" alt="Empty" />
    <h2 class="text-2xl font-semibold mt-6">No results found!</h2>
    <p class="text-muted-foreground textg-sm mt-2">
      Try searching for something else
    </p>
  </div>
</template>
