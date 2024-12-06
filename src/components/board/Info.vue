<script setup lang="ts">
import { Menu } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Actions from "@/components/Actions.vue";
import LogoIcon from "@/assets/images/logo.svg";
import Hint from "@/components/Hint.vue";
import TabSeparator from "@/components/board/TabSeparator.vue";

import { useGetBoardById } from "@/api/useGetBoardById";
import { useRenameModal } from "@/store/useRenameModal";

interface InfoProps {
  boardId: string;
}

const props = defineProps<InfoProps>();

const { onOpen } = useRenameModal();

const { data } = useGetBoardById(props.boardId);
</script>

<template>
  <div
    class="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md"
  >
    <Hint label="Go to boards" side="bottom" :sideOffset="10">
      <Button as-child variant="board" class="px-2">
        <RouterLink to="/">
          <img :src="LogoIcon" alt="Board logo" :height="40" :width="40" />
          <span :class="cn('font-semibold text-xl ml-2 text-black')">
            Board
          </span>
        </RouterLink>
      </Button>
    </Hint>
    <TabSeparator />
    <Hint label="Edit title" side="bottom" :sideOffset="10">
      <Button
        variant="board"
        class="text-base font-normal px-2"
        @click="onOpen(data?._id, data?.title)"
      >
        {{ data.title }}
      </Button>
    </Hint>
    <TabSeparator />
    <Actions
      :id="data?._id"
      :title="data?.title"
      side="bottom"
      :sideOffset="10"
    >
      <div>
        <Hint label="Main menu" side="bottom" :sideOffset="100">
          <Button size="icon" variant="board">
            <Menu />
          </Button>
        </Hint>
      </div>
    </Actions>
  </div>
</template>
