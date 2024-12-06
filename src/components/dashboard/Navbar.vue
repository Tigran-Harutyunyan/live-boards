<script setup lang="ts">
import { UserButton, OrganizationSwitcher, useClerk } from "vue-clerk";
import SearchInput from "@/components/dashboard/SearchInput.vue";
import InviteButton from "@/components/dashboard/InviteButton.vue";

const { organization } = useClerk();

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
</script>

<template>
  <div class="flex items-center gap-x-4 p-5">
    <div class="hidden lg:flex lg:flex-1">
      <SearchInput />
    </div>
    <div class="block lg:hidden flex-1">
      <OrganizationSwitcher hidePersonal :appearance="appearance" />
    </div>

    <InviteButton v-if="organization" />
    <UserButton />
  </div>
</template>
