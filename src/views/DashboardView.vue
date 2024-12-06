<script setup lang="ts">
import { useRoute } from "vue-router";
import { useOrganization } from "vue-clerk";
import EmptyOrg from "@/components/dashboard/EmptyOrg.vue";
import BoardList from "@/components/dashboard/BoardList.vue";
import RenameModal from "@/components/modals/RenameModal.vue";

const { organization } = useOrganization();
const route = useRoute();

const query = route.query;
delete query?.__clerk_handshake;
</script>

<template>
  <div class="flex-1 h-[calc(100%-80px)] p-6">
    <BoardList
      v-if="organization?.id"
      :orgId="organization?.id"
      :query="query"
      :key="organization?.id + JSON.stringify(query)"
    />
    <EmptyOrg v-else="!organization?.id" />
    <RenameModal />
  </div>
</template>
