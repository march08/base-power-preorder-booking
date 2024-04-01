export type StoredZipDataItem = {
  stateShort: string;
  zip: string;
  availability: string;
  servingNow: string | null | undefined;
};

export type StoredZipData = StoredZipDataItem[];

export type SheetDataConfig = {
  sheetId: string;
  sheetPage: string;
  googlePublicApiKey: string;
};
