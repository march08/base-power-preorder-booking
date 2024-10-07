/// <reference types="svelte" />

import type { SheetZips } from "./location-input/zipData/fetchZipCodes";

declare global {
  interface Window {
    preorderZipCodes: SheetZips;
    hbspt: any;
    clarity: any;
    hsFormPreorder: HTMLFormElement;
    hsFormNewsletter: HTMLFormElement;
  }
}
