import { writable } from "svelte/store";

const settingsStruct = {
  gamePath: undefined,
};

const storeStruct = {
  isLoaded: false,
  ...settingsStruct,
};

const storeFactory = () => {
  const { subscribe, set, update } = writable(storeStruct);

  return {
    subscribe,
    setGamePath(gamePath) {
      update(state => {
        /*const isSave = await ipcRenderer.invoke("writeSettings").then(
          () => true,
          () => false
        );*/

        return { ...state, gamePath };
      });
    },
  };
};

export const settingsStore = storeFactory();
