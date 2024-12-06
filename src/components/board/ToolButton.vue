<script setup lang="ts">
import Hint from "@/components/Hint.vue";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  label: string;
  isActive?: boolean;
  isDisabled?: boolean;
}

type EmitType = {
  (event: "click"): void;
};

const emit = defineEmits<EmitType>();

defineProps<ToolButtonProps>();
</script>

<template>
  <Hint :label="label" side="right" :sideOffset="14">
    <Button
      :disabled="isDisabled"
      @click="emit('click')"
      size="icon"
      :variant="isActive ? 'boardActive' : 'board'"
    >
      <slot />
    </Button>
  </Hint>
</template>
