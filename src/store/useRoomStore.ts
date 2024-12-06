import { defineStore } from "pinia";
import { ref } from 'vue';
import type { Room } from "@liveblocks/client";

export const useRoomStore = defineStore("use-room", () => {
    const room = ref<Room>();
    const root = ref();
    const layerIds = ref();
    const liveLayers = ref();
    const updateCount = ref(0);
    const currentUser = ref();
    const liveLayerIds = ref();
    const canRedo = ref(false);
    const canUndo = ref(false);
    const myPresence = ref(room.value?.getPresence()!);
    const others = ref(room.value?.getOthers() || []);
    let unsubscribeMyPresence = ref();
    let unsubscribeOthers = ref();
    let unsubscribeHistory = ref();

    const getLayerIds = () => {
        if (!root.value) return;
        liveLayerIds.value = root.value.get("layerIds");
        return liveLayerIds.value?._items.map((item) => item._data);
    }

    const getStorage = async () => {
        if (!root.value) return;

        liveLayers.value = root.value.get("layers");
        layerIds.value = getLayerIds();
        return { root: root.value };
    }

    const getLayers = async () => {
        if (!root.value) return;

        const rawData = root.value.get("layers")
        return rawData;
    }

    const getRoot = async () => {
        const { root: data } = await room.value?.getStorage();
        root.value = data;
    }

    const getLayerById = async (id: string) => {
        if (!id) return;
        if (!root.value) {
            await getRoot();
        };

        const rawData = root.value?.get("layers")?._map.get(id)?._map;
        return rawData ? Object.fromEntries(rawData) : {};
    }


    const updateCounter = () => {
        updateCount.value = updateCount.value === 0 ? 1 : 0
    }



    const initRoom = async (data: Room) => {
        if (!room) {
            throw new Error('Room is undefined')
        }
        room.value = data;

        unsubscribeMyPresence.value = room.value.subscribe(
            "my-presence",
            (newPresence) => {
                myPresence.value = newPresence;
                getStorage();
            }
        );

        unsubscribeOthers.value = room.value.subscribe("others", (newOthers) => {
            others.value = newOthers;
            getStorage();
            updateCounter();
            currentUser.value = room.value?.getSelf();
        });

        unsubscribeHistory.value = room.value.subscribe("history", ({ canUndo: cU, canRedo: cR }) => {
            canUndo.value = cU;
            canRedo.value = cR;
            getStorage();
        });

        await getRoot();

        getStorage();
    };

    const unsubscribeAll = () => {
        unsubscribeMyPresence.value?.();
        unsubscribeOthers.value?.();
        unsubscribeHistory.value?.();
        root.value = undefined;
        layerIds.value = undefined;
        liveLayers.value = undefined;
        currentUser.value = undefined;
        liveLayerIds.value = undefined;
        canUndo.value = false;
        canRedo.value = false;
        myPresence.value = {};
        others.value = [];
        room.value = undefined;
    };

    return {
        canRedo,
        canUndo,
        room,
        root,
        layerIds,
        liveLayers,
        updateCount,
        currentUser,
        liveLayerIds,
        myPresence,
        others,
        unsubscribeAll,
        initRoom,
        getLayerById,
        getLayers,
        updateCounter,
        getStorage,
    };
});