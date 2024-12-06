
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

export const useCreateBoard = () => {
    const router = useRouter();

    const { isLoading, mutate } = useConvexMutation(
        api.board.create,
        {
            onSuccess(id) {
                toast.success("Board created");
                router.push(`/board/${id}`);
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
