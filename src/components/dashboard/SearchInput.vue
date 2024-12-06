<script setup lang="ts">
import qs from "query-string";
import { useDebounceFn } from "@vueuse/core";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Search } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

const router = useRouter();
const route = useRoute();
const search = ref();

const debouncedFn = useDebounceFn((e: InputEvent) => {
  const debouncedValue = (e.target as HTMLInputElement).value;

  const url = qs.stringifyUrl(
    {
      url: "/",
      query: {
        search: debouncedValue,
      },
    },
    { skipEmptyString: true, skipNull: true }
  );

  router.push(url);
}, 500);

onMounted(() => {
  search.value = route.query?.search;
});
</script>

<template>
  <div class="w-full relative">
    <Search
      class="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
    />
    <Input
      class="w-full max-w-[516px] pl-9"
      placeholder="Search boards"
      v-model="search"
      @input="debouncedFn($event)"
    />
  </div>
</template>
