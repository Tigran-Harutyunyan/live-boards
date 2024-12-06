<script setup lang="ts">
import { Plus } from "lucide-vue-next";
import { useClerk } from "vue-clerk";
import { useCreateBoard } from "@/api/useCreateBoard";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

defineProps<NewBoardButtonProps>();

const { organization, user } = useClerk();

const { mutate, isLoading: pending } = useCreateBoard();

const handleCreateBoard = () => {
  if (!organization) return;

  mutate({
    orgId: organization.id,
    title: "Untitled",
    authorId: user?.id,
    authorName: user?.fullName,
  });
};
</script>

<template>
  <button
    :disabled="pending || disabled"
    @click="handleCreateBoard"
    class="col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6"
    :class="{
      'opacity-75 hover:bg-blue-600 cursor-not-allowed': pending || disabled,
    }"
  >
    <div />
    <Plus class="h-12 w-12 text-white stroke-1" />
    <p class="text-sm text-white font-light">New board</p>
  </button>
</template>
