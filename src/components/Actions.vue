<script setup lang="ts">
import { toast } from "vue-sonner";
import { Link2, Pencil, Trash2 } from "lucide-vue-next";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { ref } from "vue";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDeleteBoard } from "@/api/useDeleteBoard";
import { useRenameModal } from "@/store/useRenameModal";

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

interface ActionsProps {
  side?: "top" | "right" | "bottom" | "left" | undefined;
  sideOffset?: number | undefined;
  id: string;
  title: string;
}

const props = defineProps<ActionsProps>();

const { mutate: deleteBoard } = useDeleteBoard();

const { onOpen } = useRenameModal();

const copyLink = () => {
  navigator.clipboard
    .writeText(`${window.location.origin}/board/${props.id}`)
    .then(() => toast.success("Link copied"))
    .catch(() => toast.error("Failed to copy link"));
};

const showConfirm = async () => {
  const ok = await confirm.value?.openModal(
    "Are you sure?",
    "This action is irreversible."
  );

  if (!ok) return;

  deleteBoard({
    id: props.id,
  });
};
</script>

<template>
  <ConfirmDialog ref="confirm" />
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      :side="props.side"
      :sideOffset="props.sideOffset"
      class="w-60"
    >
      <DropdownMenuItem @click="copyLink()" class="p-3 cursor-pointer">
        <Link2 class="h-4 w-4 mr-2" />
        Copy board link
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="() => onOpen(id, title)"
        class="p-3 cursor-pointer"
      >
        <Pencil class="h-4 w-4 mr-2" />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem @click="showConfirm()" class="p-3 cursor-pointer">
        <Trash2 class="h-4 w-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
