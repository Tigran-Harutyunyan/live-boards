import { defineStore } from "pinia";
import { ref } from 'vue';

export const useRenameModal = defineStore("rename-modal", () => {
    const isOpen = ref(false);
    const boardId = ref();
    const boardTitle = ref();

    function onOpen(id: string, title: string) {
        if (!id) throw new Error("Board id is not specified");
        boardId.value = id;
        boardTitle.value = title;
        isOpen.value = true;
    }

    function onClose() {
        isOpen.value = false;
        boardId.value = '';
        boardTitle.value = '';
    }

    return {
        boardId,
        isOpen,
        boardTitle,
        onOpen,
        onClose,
    };
});