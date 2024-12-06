<script setup lang="ts">
import Hint from "@/components/Hint.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
}

defineProps<UserAvatarProps>();
</script>

<template>
  <Hint :label="name || 'Teammate'" side="bottom" :sideOffset="18">
    <Avatar class="h-8 w-8 border-2" :style="{ borderColor }">
      <AvatarImage :src="src || ''" />
      <AvatarFallback class="text-xs font-semibold">
        {{ fallback }}
      </AvatarFallback>
    </Avatar>
  </Hint>
</template>
