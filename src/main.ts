import LocationInput from "./location-input/LocationInput.svelte";

const locationInput = new LocationInput({
  target: document.getElementById("preorder-form"),
  props: {
    googleSheetConfig: {
      googlePublicApiKey: "AIzaSyB0o_nPI-xjHYKg7KB0bl87Yhnf2ng9Nsg",
      sheetId: "11gEG0LH5svkrjEjVDl63Cm3eFsmkFiR15kP2ODpVzqg",
      sheetPage: "Deregulated Zip Codes",
    },
    stripePaymentLink: "https://buy.stripe.com/test_9AQ4ip3u22r5aLm5kk",
    targetPanel: "#signup-panel",
    targetAddressPanel: "#preorder-address-panel",
    targetAvailableState: "#available-address-panel",
    targetNotAvailableState: "#invalid-address-panel",
    targetAvailableText: `[data-preorder-form="availability"]`,
    targetDisplayAddress: `[data-target-display-address="display-selected-address"]`,
    hsFormSuccess: {
      target: "#signup-hubspot-form",
      // region: "eu1",
      // portalId: "26542071",
      // formId: "3cda8361-19a7-4336-b522-edc27e1d66fc",

      region: "na1",
      portalId: "43873875",
      formId: "a41c83a1-a371-4080-be84-5699814bc294",
      onFormSubmit: (r) => {
        console.log("r", r);
      },
    },
    hsFormNewsletter: {
      target: "#newsletter-form",
      // region: "eu1",
      // portalId: "26542071",
      // formId: "e9e30637-a84c-45ea-a7d1-b2a34ee40059",
      region: "na1",
      portalId: "43873875",
      formId: "bdfdc2d3-1e91-44e7-a477-02a68a93d0f9",
      onFormSubmit: (r) => {
        console.log("r", r);
      },
    },
  },
});

export default locationInput;
