<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-vue-next";
import { useAuth } from "vue-clerk";

import Actions from "@/components/Actions.vue";
import Footer from "@/components/dashboard/board-card/Footer.vue";
import Overlay from "@/components/dashboard/board-card/Overlay.vue";

import { useFavoriteBoard } from "@/api/useFavoriteBoard";
import { useUnfavoriteBoard } from "@/api/useUnfavoriteBoard";

interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

const props = defineProps<BoardCardProps>();
const { userId } = useAuth();

const authorLabel = userId.value === props.authorId ? "You" : props.authorName;
const createdAtLabel = formatDistanceToNow(props.createdAt, {
  addSuffix: true,
});

const { mutate: onFavorite, isLoading: pendingFavorite } = useFavoriteBoard();
const { mutate: onUnfavorite, isLoading: pendingUnfavorite } =
  useUnfavoriteBoard();

const toggleFavorite = () => {
  if (props.isFavorite) {
    onUnfavorite({
      id: props.id,
    });
  } else {
    onFavorite({
      id: props.id,
      orgId: props.orgId,
    });
  }
};
</script>

<template>
  <RouterLink :to="`/board/${id}`">
    <div
      class="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden"
    >
      <div class="relative flex-1 bg-amber-50">
        <img
          :src="imageUrl"
          :alt="title"
          fill
          class="object-fit absolute h-full w-full inset-0 text-transparent"
        />
        <Overlay />
        <Actions :id="id" :title="title" side="top" :sideOffset="60">
          <div>
            <button
              class="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none"
            >
              <MoreHorizontal
                class="text-white opacity-75 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </Actions>
      </div>
      <Footer
        :isFavorite="isFavorite"
        :title="title"
        :authorLabel="authorLabel"
        :createdAtLabel="createdAtLabel"
        :disabled="pendingFavorite || pendingUnfavorite"
        @click="toggleFavorite"
      />
    </div>
  </RouterLink>
</template>
