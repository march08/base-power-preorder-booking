<script lang="ts">
  import GooglePlaceAutocomplete from "./googlePlace/GooglePlaceAutocomplete.svelte";
  import { parsePlaceResult } from "./googlePlace/utils";
  import { setHiddenHubspotInputs } from "./hsFormUtils";
  import { displayBlock, displayNone, showElemenet } from "../visibilityUtils";

  export let targetAvailableText: string;
  export let targetDisplayAddress: string;

  export let googlePublicApiKey: string;

  export let panelEl: HTMLDivElement;
  export let stateContainerEl: HTMLDivElement;
  export let addressPanelEl: HTMLDivElement;
  export let targetAvailableStateEl: HTMLDivElement;
  export let targetNotAvailableStateEl: HTMLDivElement;

  $: inputErrorMessage = "";

  // /**
  //  * load supported zips
  //  */
  // onMount(async () => {
  //   const f = document.getElementById("hero-address-entry");
  //   const t = f.firstChild.cloneNode(true);

  //   const fk = document.getElementById("address-form");
  //   fk.appendChild(t);
  // });
</script>

<div>
  <GooglePlaceAutocomplete
    class="location-search-input"
    apiKey={googlePublicApiKey}
    placeholder="Enter your address"
    onSelect={(value) => {
      const parsed = parsePlaceResult(value);

      if (!parsed.postalCode) {
        inputErrorMessage = "Please select an address with ZIP code.";
        return;
      }

      displayBlock(panelEl);
      displayBlock(stateContainerEl);
      displayNone(addressPanelEl);

      const lookupCode = `${parsed.stateShort}::${parsed.postalCode}`;

      const targetDisplayAddressEl =
        document.querySelector(targetDisplayAddress);
      targetDisplayAddressEl.innerHTML = parsed.formattedAddress;

      if (window.preorderZipCodes[lookupCode]) {
        document.querySelectorAll(targetAvailableText).forEach((el) => {
          el.innerHTML = window.preorderZipCodes[lookupCode];
        });
        displayBlock(targetAvailableStateEl);
        displayNone(targetNotAvailableStateEl);
        setHiddenHubspotInputs(window.hsFormPreorder, parsed);
      } else {
        displayBlock(targetNotAvailableStateEl);
        displayNone(targetAvailableStateEl);
        setHiddenHubspotInputs(window.hsFormNewsletter, parsed);
      }
    }}
    options={{
      componentRestrictions: { country: "us" },
    }}
  />
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
  .preorder-address-error-message {
    color: #c95151;
    font-size: 14px;
    margin-top: 6px;
  }
  .location-search-input {
    border: none;
    background: rgba(250, 254, 255, 0.97);
    border-radius: 12px;
    height: 44px;
    border: none !important;
    outline: none !important;
    width: 100%;
    padding: 0 16px;
    line-height: 44px;
  }

  .pac-container {
    border-radius: 12px;
    transform: translateY(calc(-100% - 44px));
    .pac-item {
      padding: 0 16px;
      line-height: 44px;
    }
    .pac-item-query {
    }
    &:after {
      display: none !important;
    }
  }

  .pac-icon.pac-icon-marker {
    display: none;
  }

  .hs-form__virality-link {
    display: none !important;
  }
</style>
