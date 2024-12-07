<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useOrganization } from "vue-clerk";
import EmptyOrg from "@/components/dashboard/EmptyOrg.vue";
import BoardList from "@/components/dashboard/BoardList.vue";
import RenameModal from "@/components/modals/RenameModal.vue";

const { organization } = useOrganization();
const route = useRoute();

const checkedQuery = computed(() => {
  let newQuery = { ...route.query };
  const acceptedQueryParams = ["search", "favorites"];

  Object.keys(newQuery).forEach((param) => {
    if (!acceptedQueryParams.includes(param)) {
      delete newQuery[param];
    }
  });

  return newQuery;
});
</script>

<template>
  <div class="flex-1 h-[calc(100%-80px)] p-6">
    <BoardList
      v-if="organization?.id"
      :orgId="organization?.id"
      :query="checkedQuery"
      :key="organization?.id + JSON.stringify(checkedQuery)"
    />
    <EmptyOrg v-else="!organization?.id" />
    <RenameModal />
  </div>
</template>
