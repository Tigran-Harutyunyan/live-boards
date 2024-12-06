<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

const { label, side, align, sideOffset, alignOffset } =
  defineProps<HintProps>();
</script>

<template>
  <TooltipProvider>
    <Tooltip :delayDuration="100">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        class="text-white bg-black border-black"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <p class="font-semibold capitalize">
          {{ label }}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
