<script setup lang="ts">
import { toast } from "vue-sonner";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRenameModal } from "@/store/useRenameModal";
import { useRenameBoard } from "@/api/useRenameBoard";

const { onClose } = useRenameModal();
const { isOpen, boardId, boardTitle } = storeToRefs(useRenameModal());

const { mutate, isLoading: pending } = useRenameBoard();

const title = ref(boardTitle.value);

const onSubmit = async () => {
  if (!title.value) {
    toast.warning("Title is not specified");
  }
  await mutate({
    id: boardId.value,
    title: title.value,
  });

  onClose();
};

watch(
  () => boardTitle.value,
  (newVal) => {
    title.value = newVal;
  }
);
</script>

<template>
  <Dialog :open="isOpen" @update:open="onClose()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Edit board title </DialogTitle>
      </DialogHeader>
      <DialogDescription> Enter a new title for this board </DialogDescription>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <Input
          :disabled="pending"
          required
          :maxLength="60"
          v-model="title"
          placeholder="Board title"
        />
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button :disabled="pending || !title.length" type="submit">
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
