import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexQuery } from "@convex-vue/core";

export const useGetBoardById = (id: Id<"board">) => {
    if (!id) return { data: null, isLoading: false };

    const { data, isLoading } = useConvexQuery(api.board.get, { id });
    return { data, isLoading };
};
