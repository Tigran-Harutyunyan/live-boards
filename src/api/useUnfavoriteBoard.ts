
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';

export const useUnfavoriteBoard = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.board.unfavorite,
        {
            onSuccess() {
                toast.success("Board is removed from favorites");
            },
            onError() {
                toast.error("Failed to unfavorite");
            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};
