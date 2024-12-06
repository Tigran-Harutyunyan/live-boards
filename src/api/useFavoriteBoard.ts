
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';

export const useFavoriteBoard = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.board.favorite,
        {
            onSuccess() {
                toast.success("Board is set as favorite");
            },
            onError() {
                toast.error("Failed to favorite");
            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};
