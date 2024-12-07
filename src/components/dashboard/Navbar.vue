<script setup lang="ts">
import { UserButton, OrganizationSwitcher, useClerk } from "vue-clerk";
import SearchInput from "@/components/dashboard/SearchInput.vue";
import InviteButton from "@/components/dashboard/InviteButton.vue";
import { Switch } from "@/components/ui/switch";
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { organization } = useClerk();
const isFavorite = ref(false);

const appearance = {
  elements: {
    rootBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: "376px",
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

const onUpdate = (isOn: boolean) => {
  const newQuery = isOn ? { favorites: true } : {};
  router.push({ path: "/", query: newQuery });
};

watch(
  () => route.query,
  (newVal) => {
    isFavorite.value = "favorites" in newVal;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="flex items-center gap-x-4 p-5">
    <div class="hidden lg:flex lg:flex-1">
      <SearchInput />
    </div>
    <div class="block lg:hidden flex-1">
      <div class="flex items-center">
        <OrganizationSwitcher hidePersonal :appearance="appearance" />
        <Switch
          :checked="isFavorite"
          @update:checked="onUpdate"
          class="ml-3 mr-2"
        />Favorites
      </div>
    </div>

    <InviteButton v-if="organization" />
    <UserButton />
  </div>
</template>
