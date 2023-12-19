<script lang="ts">
  import GooglePlaceAutocomplete from "./googlePlace/GooglePlaceAutocomplete.svelte";
  import { ParsedPlaceResult, parsePlaceResult } from "./googlePlace/utils";
  import { setHiddenHubspotInputs } from "./hsFormUtils";
  import {
    displayBlock,
    displayNone,
    fadeIn,
    showElemenet,
  } from "../visibilityUtils";

  export let targetAvailableText: string;
  export let targetDisplayAddress: string;

  export let googlePublicApiKey: string;

  export let panelEl: HTMLDivElement;
  export let stateContainerEl: HTMLDivElement;
  export let addressPanelEl: HTMLDivElement;
  export let targetAvailableStateEl: HTMLDivElement;
  export let targetNotAvailableStateEl: HTMLDivElement;
  export let onAddressSelect: (data: ParsedPlaceResult) => void | undefined;

  $: inputErrorMessage = "";
  let selectedAddress: ReturnType<typeof parsePlaceResult> | undefined;
  $: selectedAddress = undefined;

  const handleSubmit = () => {
    if (!selectedAddress) {
      inputErrorMessage = "Please select an address with ZIP code.";
      return;
    }
    if (!selectedAddress.postalCode) {
      inputErrorMessage = "Please select an address with ZIP code.";
      return;
    }

    fadeIn(panelEl);
    displayBlock(stateContainerEl);
    displayNone(addressPanelEl);

    const lookupCode = `${selectedAddress.stateShort}::${selectedAddress.postalCode}`;

    const targetDisplayAddressEl = document.querySelector(targetDisplayAddress);
    targetDisplayAddressEl.innerHTML = selectedAddress.formattedAddress;

    if (window.preorderZipCodes[lookupCode]) {
      document.querySelector(targetAvailableText).innerHTML =
        window.preorderZipCodes[lookupCode];
      displayBlock(targetAvailableStateEl);
      displayNone(targetNotAvailableStateEl);
      setHiddenHubspotInputs(window.hsFormPreorder, selectedAddress);
    } else {
      displayBlock(targetNotAvailableStateEl);
      displayNone(targetAvailableStateEl);
      setHiddenHubspotInputs(window.hsFormNewsletter, selectedAddress);
    }
  };
</script>

<div>
  <div class="input-address-container">
    <GooglePlaceAutocomplete
      class="location-search-input"
      apiKey={googlePublicApiKey}
      placeholder="Enter your address"
      onSelect={(value) => {
        const parsed = parsePlaceResult(value);
        onAddressSelect?.(parsed);
        window.blur();
        inputErrorMessage = "";

        selectedAddress = parsed;
      }}
      options={{
        componentRestrictions: { country: "us" },
      }}
    />
    <button
      on:click={handleSubmit}
      class="submitAddressButton button secondary w-button"
    >
      Check Availability
    </button>
  </div>
  {#if inputErrorMessage}
    <p class="preorder-address-error-message">
      {inputErrorMessage}
    </p>
  {/if}
</div>

<svelte:head>
  <script
    charset="utf-8"
    type="text/javascript"
    src="//js-eu1.hsforms.net/forms/embed/v2.js"
  ></script>
</svelte:head>

<style lang="scss" global>
  .submitAddressButton {
    flex-shrink: 0;
  }
  .input-address-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media screen and (max-width: 768px) {
      flex-direction: column;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .preorder-address-error-message {
    color: #c95151;
    font-size: 14px;
    margin-top: 6px;
  }
  .location-search-input {
    border: none;
    background: #fafefff7;
    border-radius: 12px;
    height: 44px;
    border: none !important;
    outline: none !important;
    width: 100%;
    padding: 0 16px;
    line-height: 44px;
  }

  .hs-form__virality-link {
    display: none !important;
  }

  #popup-form {
    transition: 0.2s all;
  }
</style>
