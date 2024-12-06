<script setup lang="ts">
import { useGetBoards } from "@/api/useGetBoards";
import EmptyBoards from "@/components/dashboard/EmptyBoards.vue";
import EmptyFavorites from "@/components/dashboard/EmptyFavorites.vue";
import EmptySearch from "@/components/dashboard/EmptySearch.vue";
import BoardCardSkeleton from "@/components/dashboard/board-card/BoardCardSkeleton.vue";
import NewBoardButton from "@/components/dashboard/NewBoardButton.vue";
import BoardCard from "@/components/dashboard/board-card/BoardCard.vue";
import Loader from "@/components/Loader.vue";

export interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

const props = defineProps<BoardListProps>();

const { data, isLoading } = useGetBoards({
  query: props.query,
  orgId: props.orgId,
});
</script>

<template>
  <Loader v-if="isLoading" />
  <template v-else>
    <div v-if="data === undefined">
      <h2 class="text-3xl">
        {{ query.favorites ? "Favorite boards" : "Team boards" }}
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"
      >
        <NewBoardButton :orgId="orgId" disabled />
        <BoardCardSkeleton />
        <BoardCardSkeleton />
        <BoardCardSkeleton />
        <BoardCardSkeleton />
      </div>
    </div>

    <EmptySearch v-if="!data?.length && query.search" />

    <EmptyFavorites v-if="!data?.length && query.favorites" />

    <EmptyBoards v-if="!data?.length" />

    <div v-if="data && data.length">
      <h2 class="text-3xl">
        {{ query.favorites ? "Favorite boards" : "Team boards" }}
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10"
      >
        <NewBoardButton :orgId="orgId" />
        <BoardCard
          v-for="board in data"
          :key="board._id"
          :id="board._id"
          :title="board.title"
          :imageUrl="board.imageUrl"
          :authorId="board.authorId"
          :authorName="board.authorName"
          :createdAt="board._creationTime"
          :orgId="board.orgId"
          :isFavorite="board.isFavorite"
        />
      </div>
    </div>
  </template>
</template>
