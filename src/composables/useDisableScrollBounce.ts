import { onMounted, onUnmounted } from 'vue';
export const useDisableScrollBounce = () => {
    const className = "overflow-hidden";
    const propName = "overscroll-none";

    onMounted(() => {
        document.body.classList.add(className, propName);
    })

    onUnmounted(() => {
        document.body.classList.remove(className, propName);
    })
};