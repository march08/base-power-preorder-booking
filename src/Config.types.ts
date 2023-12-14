export type HubspotFormConfig = {
  target: string;
  region: string;
  portalId: string;
  formId: string;
  onFormSubmit?: any;
};

export type InitConfig = {
  mainTitle: string;
  bookADemoHref: string;
  footerText?: string;
  hubspotFormConfig?: HubspotFormConfig;
  thankYouTitle?: string;
};

export type SubmitFormDescription = { label: string; value: string }[];
