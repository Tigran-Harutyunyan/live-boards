
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';

export const useCreateBoard = () => {

    const { isLoading, mutate } = useConvexMutation(
        api.board.create,
        {
            onSuccess(id) {
                toast.success("Board created");
            },
            onError() {
                toast.error("Failed to create board");
            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};
