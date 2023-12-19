import { PreorderApp } from "./PreorderApp";

PreorderApp.initialize({
  targetElAddressInput: document.getElementById(
    "hero-address-entry"
  ) as HTMLDivElement,
  googlePublicApiKey: "AIzaSyB0o_nPI-xjHYKg7KB0bl87Yhnf2ng9Nsg",
  targetPanel: "#popup-form",
  targetAddressPanel: "#address-popup",
  targetAvailableState: "#preorder-base",
  targetNotAvailableState: "#not-available",
  targetStateContainer: "#popup-form .form-box_holder",
  targetAvailableText: `#preorder-availability`,
  targetDisplayAddress: `#service-address`,

  querySelectorClickToOpenForm: '[data-preorder="open"]',

  // stripe

  stripePaymentLink: "https://buy.stripe.com/test_9AQ4ip3u22r5aLm5kk",
  googleSheetConfig: {
    sheetId: "11gEG0LH5svkrjEjVDl63Cm3eFsmkFiR15kP2ODpVzqg",
    sheetPage: "Deregulated Zip Codes",
  },

  // hubspot
  hsFormSuccess: {
    target: "#hubspot-preorder-form",
    // region: "na1",
    // portalId: "43873875",
    // formId: "a41c83a1-a371-4080-be84-5699814bc294",
    region: "eu1",
    portalId: "26542071",
    formId: "3cda8361-19a7-4336-b522-edc27e1d66fc",
  },
  hsFormNewsletter: {
    target: "#hubspot-email-form",
    // region: "na1",
    // portalId: "43873875",
    // formId: "bdfdc2d3-1e91-44e7-a477-02a68a93d0f9",

    region: "eu1",
    portalId: "26542071",
    formId: "e9e30637-a84c-45ea-a7d1-b2a34ee40059",
    onFormSubmit: (r) => {
      // window.location.href = "https://9gag.com";
    },
  },
});
