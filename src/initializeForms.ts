import type { HubspotFormConfig } from "./Config.types";
import { modifyFormOnLoad } from "./location-input/hsFormUtils";
import { fadeOut } from "./visibilityUtils";

type CbFormArg = { 0: HTMLFormElement; length: 1 } | HTMLFormElement;

const getFormFromCb = (cbArg: CbFormArg): HTMLFormElement => {
  if ("0" in cbArg && "length" in cbArg && cbArg.length === 1) {
    return cbArg["0"] as HTMLFormElement;
  }

  return cbArg as HTMLFormElement;
};

let submittedSuccessEmail: string = undefined;

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
    onFormReady: (args: CbFormArg) => {
      const form = getFormFromCb(args);
      window.hsFormPreorder = form;
      modifyFormOnLoad(form);
    },
    onFormSubmit: (args: CbFormArg) => {
      const form = getFormFromCb(args);
      const submittedEmail = (
        form.querySelector('input[name="email"]') as HTMLInputElement
      ).value;

      submittedSuccessEmail = submittedEmail;

      hsFormSuccess.onFormSubmit?.(form);
    },
    onFormSubmitted: () => {
      /**
       * redirect to the payment page
       */
      window.location.href = `${stripePaymentLink}?prefilled_email=${submittedSuccessEmail}`;
    },
  });

  // newsletter hs

  window.hbspt.forms.create({
    ...hsFormNewsletter,
    onFormReady: (args: CbFormArg) => {
      const form = getFormFromCb(args);
      window.hsFormNewsletter = form;
      modifyFormOnLoad(form);
    },
    onFormSubmitted: () => {
      /**
       * redirect to the payment page
       */
      document.body.parentElement.style.background = "#333";
      fadeOut(document.body as any);
      setTimeout(() => {
        window.location.href = "/newsletter-confirmation";
      }, 500);
    },
  });
};
