export type StoredZipDataItem = {
  stateShort: string;
  zip: string;
  availability: string;
  servingNow: string | null | undefined;
};

export type StoredZipData = StoredZipDataItem[];

export type StoredZipDataItemKey = keyof StoredZipDataItem;

export const storedZipDataItemKeys: StoredZipDataItemKey[] = [
  "stateShort",
  "zip",
  "availability",
  "servingNow",
];

export type StoredZipCSVColumnName =
  | "state_id"
  | "zip"
  | "Availability"
  | "serving_now";

export const StoredZipCSVColumnNames: StoredZipCSVColumnName[] = [
  "state_id",
  "zip",
  "Availability",
  "serving_now",
];

export type SheetDataConfig = {
  zipsCsvUrl: string;
};
