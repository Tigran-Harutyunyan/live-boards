import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
export const useBoardId = () => {
    const route = useRoute();
    const boardId = ref();

    watch(
        () => route.path,
        () => {
            boardId.value = route.params.boardId;
        },
        {
            immediate: true,
        }
    );

    return {
        boardId
    };
};