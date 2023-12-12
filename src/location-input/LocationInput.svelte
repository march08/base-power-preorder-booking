<script lang="ts">
  import { onMount } from "svelte";
  import GooglePlaceAutocomplete from "./googlePlace/GooglePlaceAutocomplete.svelte";
  import { parsePlaceResult } from "./googlePlace/utils";
  import { modifyFormOnLoad, setHiddenHubspotInputs } from "./hsFormUtils";
  import {
    SheetDataConfig,
    SheetZips,
    fetchGoogleSheetsZipCodes,
  } from "./fetchGoogleSheetsZipCodes";

  export let stripePaymentLink: string;
  export let targetPanel: string;
  export let targetAddressPanel: string;
  export let targetAvailableState: string;
  export let targetAvailableText: string;
  export let targetNotAvailableState: string;
  export let targetDisplayAddress: string;

  export let googleSheetConfig: SheetDataConfig;

  type HsFormConfig = {
    target: string;
    region: string;
    portalId: string;
    formId: string;
    onFormSubmit: any;
  };

  export let hsFormSuccess: HsFormConfig;
  export let hsFormNewsletter: HsFormConfig;

  let zipCodes: SheetZips;
  $: zipCodes = {};

  $: inputErrorMessage = "";

  let hsAvailableFormEl: HTMLFormElement;
  $: hsAvailableFormEl = undefined;
  let hsNotAvailableFormEl: HTMLFormElement;
  $: hsNotAvailableFormEl = undefined;

  const panelElement = document.querySelector(targetPanel) as HTMLDivElement;
  const addressPanel = document.querySelector(
    targetAddressPanel
  ) as HTMLDivElement;
  const targetAvailableStateEl = document.querySelector(
    targetAvailableState
  ) as HTMLDivElement;
  const targetNotAvailableStateEl = document.querySelector(
    targetNotAvailableState
  ) as HTMLDivElement;

  /**
   * load supported zips
   */
  onMount(async () => {
    const windowWithHubspot = window as unknown as Window & { hbspt: any };

    // initialize success hs
    windowWithHubspot.hbspt.forms.create({
      ...hsFormSuccess,
      onFormReady: (form: HTMLFormElement) => {
        hsAvailableFormEl = form;
        modifyFormOnLoad(form);
      },
      onFormSubmit: (form: HTMLFormElement) => {
        const submittedEmail = (
          form.querySelector('input[name="email"]') as HTMLInputElement
        ).value;

        hsFormSuccess.onFormSubmit?.(form);

        /**
         * redirect to the payment page
         */
        window.location.href = `${stripePaymentLink}?prefilled_email=${submittedEmail}`;
      },
    });

    // newsletter hs

    windowWithHubspot.hbspt.forms.create({
      ...hsFormNewsletter,
      onFormReady: (form: HTMLFormElement) => {
        hsNotAvailableFormEl = form;
        modifyFormOnLoad(form);
      },
    });

    zipCodes = await fetchGoogleSheetsZipCodes(googleSheetConfig);
  });
</script>

<div>
  <GooglePlaceAutocomplete
    class="location-search-input"
    apiKey={googleSheetConfig.googlePublicApiKey}
    onSelect={(value) => {
      const parsed = parsePlaceResult(value);

      if (!parsed.postalCode) {
        inputErrorMessage = "Please select an address with ZIP code.";
        return;
      }

      const lookupCode = `${parsed.stateShort}::${parsed.postalCode}`;

      const targetDisplayAddressEl =
        document.querySelectorAll(targetDisplayAddress);

      targetDisplayAddressEl.forEach((el) => {
        el.innerHTML = parsed.formattedAddress;
      });

      // make panel visible
      panelElement.style.transform = "translateX(0)";
      addressPanel.style.display = "none";

      if (zipCodes[lookupCode]) {
        document.querySelectorAll(targetAvailableText).forEach((el) => {
          el.innerHTML = zipCodes[lookupCode];
        });
        targetAvailableStateEl.style.display = "block";
        targetNotAvailableStateEl.style.display = "none";
        setHiddenHubspotInputs(hsAvailableFormEl, parsed);
      } else {
        targetAvailableStateEl.style.display = "none";
        targetNotAvailableStateEl.style.display = "block";
        setHiddenHubspotInputs(hsNotAvailableFormEl, parsed);
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
