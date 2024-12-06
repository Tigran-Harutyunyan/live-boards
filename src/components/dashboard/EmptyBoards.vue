<script setup lang="ts">
import { useClerk } from "vue-clerk";
import { Button } from "@/components/ui/button";
import { useCreateBoard } from "@/api/useCreateBoard";
import imgNote from "@/assets/images/note.svg";

const { organization, user } = useClerk();
const { mutate, isLoading } = useCreateBoard();

const createBoard = () => {
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
  <div class="h-full flex flex-col items-center justify-center">
    <img :src="imgNote" height="110" width="110" alt="Empty" />
    <h2 class="text-2xl font-semibold mt-6">Create your first board!</h2>
    <p class="text-muted-foreground textg-sm mt-2">
      Start by creating a board for your organization
    </p>
    <div class="mt-6">
      <Button :disabled="isLoading" @click="createBoard()" size="lg">
        Create board
      </Button>
    </div>
  </div>
</template>
