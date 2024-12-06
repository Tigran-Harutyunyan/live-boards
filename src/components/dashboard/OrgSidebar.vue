<script setup lang="ts">
import { ref, watch } from "vue";
import { OrganizationSwitcher } from "vue-clerk";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Star } from "lucide-vue-next";
import { useRoute } from "vue-router";

const queryParams = useRoute();
const route = useRoute();
const isFavorites = ref();

const appearance = {
  elements: {
    rootBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    organizationSwitcherTrigger: {
      padding: "6px",
      width: "100%",
      borderRadius: "8px",
      border: "1px solid #E5E7EB",
      justifyContent: "space-between",
      backgroundColor: "white",
    },
  },
};

watch(
  () => route.path,
  () => {
    isFavorites.value = queryParams?.query.favorites;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="hidden lg:flex flex-col space-y-6 w-[206px] px-5 pt-5 h-screen">
    <RouterLink to="/">
      <div class="flex items-center gap-x-2">
        <img src="/logo.svg" alt="Logo" height="60" width="60" />
        <span class="font-semibold text-2xl font-poppins"> Board </span>
      </div>
    </RouterLink>
    <OrganizationSwitcher hidePersonal :appearance="appearance" />
    <div class="space-y-1 w-full">
      <Button
        :variant="isFavorites ? 'ghost' : 'secondary'"
        as-child
        size="lg"
        class="font-normal justify-start px-2 w-full"
      >
        <RouterLink to="/">
          <LayoutDashboard class="h-4 w-4 mr-2" />
          Team boards
        </RouterLink>
      </Button>
      <Button
        :variant="isFavorites ? 'secondary' : 'ghost'"
        as-child
        size="lg"
        class="font-normal justify-start px-2 w-full"
      >
        <RouterLink to="/?favorites=true">
          <Star class="h-4 w-4 mr-2" />
          Favorite boards
        </RouterLink>
      </Button>
    </div>
  </div>
</template>
