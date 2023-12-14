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
    onFormReady: (form: [HTMLFormElement]) => {
      window.hsFormPreorder = form[0];
      modifyFormOnLoad(form[0]);
    },
    onFormSubmit: (form: HTMLFormElement) => {
      const submittedEmail = (
        form[0].querySelector('input[name="email"]') as HTMLInputElement
      ).value;

      hsFormSuccess.onFormSubmit?.(form[0]);

      /**
       * redirect to the payment page
       */
      window.location.href = `${stripePaymentLink}?prefilled_email=${submittedEmail}`;
    },
  });

  // newsletter hs

  window.hbspt.forms.create({
    ...hsFormNewsletter,
    onFormReady: (form: [HTMLFormElement]) => {
      window.hsFormNewsletter = form[0];
      modifyFormOnLoad(form[0]);
    },
  });
};
