import type { HubspotFormConfig } from "./Config.types";
import { modifyFormOnLoad } from "./location-input/hsFormUtils";

export const initializeHubspotForms = ({
  hsFormSuccess,
  hsFormNewsletter,
  stripePaymentLink,
}: {
  hsFormSuccess: HubspotFormConfig;
  hsFormNewsletter: HubspotFormConfig;
  stripePaymentLink: string;
}) => {
  // initialize success hs
  window.hbspt.forms.create({
    ...hsFormSuccess,
    onFormReady: (prop: [HTMLFormElement] | HTMLFormElement) => {
      console.log("onFormReady 1", prop);
      const form = Array.isArray(prop) ? prop[0] : prop;
      window.hsFormPreorder = form;
      modifyFormOnLoad(form);
    },
    onFormSubmit: (prop: [HTMLFormElement] | HTMLFormElement) => {
      const form = Array.isArray(prop) ? prop[0] : prop;
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

  window.hbspt.forms.create({
    ...hsFormNewsletter,
    onFormReady: (prop: [HTMLFormElement] | HTMLFormElement) => {
      const form = Array.isArray(prop) ? prop[0] : prop;
      window.hsFormNewsletter = form;
      modifyFormOnLoad(form);
    },
  });
};
