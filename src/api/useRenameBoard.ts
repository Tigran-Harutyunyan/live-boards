
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';

export const useRenameBoard = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.board.update,
        {
            onSuccess() {
                toast.success("Board renamed");
            },
            onError() {
                toast.error("Failed to rename board");
            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};
