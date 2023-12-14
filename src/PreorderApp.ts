import type { HubspotFormConfig } from "./Config.types";
import { initializeHubspotForms } from "./initializeForms";
import LocationInput from "./location-input/LocationInput.svelte";
import {
  SheetDataConfig,
  SheetZips,
  fetchGoogleSheetsZipCodes,
} from "./location-input/fetchGoogleSheetsZipCodes";
import {
  displayBlock,
  displayNone,
  hideElement,
  showElemenet,
} from "./visibilityUtils";

const loadZips = (
  googlePublicApiKey: string,
  config: Pick<SheetDataConfig, "sheetId" | "sheetPage">
) =>
  fetchGoogleSheetsZipCodes({
    googlePublicApiKey,
    ...config,
  }).then((res) => {
    window.preorderZipCodes = res;
  });

/**
 * close button
 */
document.querySelectorAll(".close-button").forEach((el) => {
  el.addEventListener("click", () => {
    hideElement(document.querySelector("#popup-form"));
  });
});

export const PreorderApp = {
  initialize: (props: {
    targetElsAddressInput: HTMLDivElement[];
    googlePublicApiKey: string;
    targetPanel: string;
    targetAddressPanel: string;
    targetAvailableState: string;
    targetNotAvailableState: string;
    targetStateContainer: string;
    targetAvailableText: string;
    targetDisplayAddress: string;
    querySelectorClickToOpenForm: string;
    googleSheetConfig: Pick<SheetDataConfig, "sheetId" | "sheetPage">;
    stripePaymentLink: string;
    hsFormSuccess: HubspotFormConfig;
    hsFormNewsletter: HubspotFormConfig;
  }) => {
    const {
      targetElsAddressInput,
      googlePublicApiKey,
      targetPanel,
      targetAddressPanel,
      targetAvailableState,
      targetNotAvailableState,
      targetStateContainer,
      targetAvailableText,
      targetDisplayAddress,
      googleSheetConfig,
      stripePaymentLink,
      hsFormSuccess,
      hsFormNewsletter,
      querySelectorClickToOpenForm,
    } = props;

    loadZips(googlePublicApiKey, googleSheetConfig);

    initializeHubspotForms({
      stripePaymentLink,
      hsFormSuccess,
      hsFormNewsletter,
    });

    const panelEl = document.querySelector(targetPanel) as HTMLDivElement;
    const stateContainerEl = document.querySelector(
      targetStateContainer
    ) as HTMLDivElement;

    const addressPanelEl = document.querySelector(
      targetAddressPanel
    ) as HTMLDivElement;
    const targetAvailableStateEl = document.querySelector(
      targetAvailableState
    ) as HTMLDivElement;
    const targetNotAvailableStateEl = document.querySelector(
      targetNotAvailableState
    ) as HTMLDivElement;

    // open form button actions
    document.querySelectorAll(querySelectorClickToOpenForm).forEach((el) => {
      console.log("EE", el);
      el.addEventListener("click", () => {
        showElemenet(panelEl);
        displayBlock(addressPanelEl);
        displayNone(stateContainerEl);
      });
    });

    targetElsAddressInput.forEach((target) => {
      const locationInput = new LocationInput({
        target: target,
        props: {
          googlePublicApiKey,
          targetAvailableText,
          targetDisplayAddress,
          addressPanelEl,
          targetAvailableStateEl,
          stateContainerEl,
          panelEl,
          targetNotAvailableStateEl,
        },
      });
    });
  },
};
