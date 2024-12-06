import { api } from "@convex/api";
import { type BoardListProps } from "@/components/dashboard/BoardList.vue";
import { useConvexQuery } from "@convex-vue/core";

export const useGetBoards = ({ orgId, query }: BoardListProps) => {
    if (!orgId) return { data: null, isLoading: false };
    // const { userId } = useAuth(); userId: userId.value, 
    const { data, isLoading } = useConvexQuery(api.boards.get, { orgId, ...query });
    return { data, isLoading };
};
