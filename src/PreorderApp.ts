import type { HubspotFormConfig } from "./Config.types";
import { initializeHubspotForms } from "./initializeForms";
import LocationInput from "./location-input/LocationInput.svelte";
import {
  SheetDataConfig,
  fetchGoogleSheetsZipCodes,
} from "./location-input/fetchGoogleSheetsZipCodes";
import { displayBlock, displayNone } from "./visibilityUtils";

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

export const PreorderApp = {
  initialize: (props: {
    targetElAddressInput: HTMLDivElement;
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
      targetElAddressInput = document.getElementById("hero-address-entry"),
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
      el.addEventListener("click", () => {
        targetElAddressInput.scrollIntoView({
          behavior: "smooth",
        });

        const y =
          targetElAddressInput.getBoundingClientRect().top +
          window.scrollY -
          300;

        window.scrollTo({ top: y, behavior: "smooth" });

        setTimeout(() => {
          targetElAddressInput.querySelector("input").focus();
        }, 1000);
      });
    });

    /**
     * close button
     */
    document.querySelectorAll(".close-button").forEach((el) => {
      el.addEventListener("click", () => {
        displayNone(panelEl);
      });
    });

    const locationInput = new LocationInput({
      target: targetElAddressInput,
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
  },
};
