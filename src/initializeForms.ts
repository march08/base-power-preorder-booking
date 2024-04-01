import type { HubspotFormConfig } from "./Config.types";
import { modifyFormOnLoad } from "./location-input/hubspot/hsFormUtils";
import { hsFormStateBooking, hsFormStateNewsletter } from "./windowVars";

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
}: {
  hsFormSuccess: HubspotFormConfig;
  hsFormNewsletter: HubspotFormConfig;
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
    onFormSubmitted: (form, args) => {
      hsFormSuccess.onFormSubmitted?.(form, {
        ...args,
        submissionValues: {
          ...args.submissionValues,
          ...hsFormStateBooking.get(),
        },
      });
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
    onFormSubmitted: (form, args) => {
      /**
       * redirect to the payment page
       */

      hsFormSuccess.onFormSubmitted?.(form, {
        ...args,
        submissionValues: {
          ...args.submissionValues,
          ...hsFormStateNewsletter.get(),
        },
      });
    },
  });
};
