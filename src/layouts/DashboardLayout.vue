<script setup lang="ts">
import OrgSidebar from "@/components/dashboard/OrgSidebar.vue";
import Navbar from "@/components/dashboard/Navbar.vue";
import { storeToRefs } from "pinia";
import { useUser } from "@/store/useUser";
const { isSignedIn } = storeToRefs(useUser());
</script>
<template>
  <main class="h-screen" v-if="isSignedIn">
    <div class="h-full">
      <div class="flex gap-x-3 h-full">
        <OrgSidebar />
        <div class="h-full flex-1">
          <Navbar />
          <slot />
        </div>
      </div>
    </div>
  </main>
</template>
