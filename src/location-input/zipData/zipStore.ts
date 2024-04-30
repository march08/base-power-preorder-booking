import { writable } from "svelte/store";
import type { SheetDataConfig, StoredZipData } from "./types";
import { fetchZipCodes } from "./fetchZipCodes";

const initialState: StoredZipData = [];
export const getZipStore = (sheetConfig: SheetDataConfig) => {
  const store = writable<StoredZipData>(initialState);

  const load = async () => {
    try {
      const res = await fetchZipCodes(sheetConfig);
      console.log("response: ", res);
      store.set(res);
    } catch (e) {
      console.log("Cannot load zips", e);
    }
  };
  return { store, load };
};
