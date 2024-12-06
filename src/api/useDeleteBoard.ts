
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

export const useDeleteBoard = () => {
    const router = useRouter();

    const { isLoading, mutate } = useConvexMutation(
        api.board.remove,
        {
            onSuccess() {
                toast.success("Board deleted");
                router.push('/')

            },
            onError() {
                toast.success("Failed to delete");
            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};
