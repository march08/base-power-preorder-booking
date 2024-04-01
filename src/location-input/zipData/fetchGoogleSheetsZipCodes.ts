import type {
  SheetDataConfig,
  StoredZipData,
  StoredZipDataItem,
} from "./types";

export type SheetResult = {
  majorDimension: string;
  range: string;
  values: [string, string, string][];
};

const PAGE_SIZE = 500;

type Row = [string, string, string, string | null | undefined];
type FetchedData = Row[];

const fetchSheetData = async (
  sheetConfig: SheetDataConfig,
  page = 1
): Promise<FetchedData> => {
  const { sheetId, sheetPage, googlePublicApiKey } = sheetConfig;
  const values = (await fetch(
    encodeURI(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetPage}!C${
        8 + PAGE_SIZE * (page - 1)
      }:F${8 + PAGE_SIZE * page}?key=${googlePublicApiKey}`
    )
  )
    .then((res) => res.json())
    .then((res) => (res as SheetResult).values)) as FetchedData;

  if (values.length >= PAGE_SIZE) {
    return [...values, ...(await fetchSheetData(sheetConfig, page + 1))];
  }

  return values as unknown as Row[];
};

export const fetchZipCodes = async (
  sheetDataConfig: SheetDataConfig
): Promise<StoredZipData> => {
  const data = await fetchSheetData(sheetDataConfig);

  const mapped = data.map((item) => {
    const stateShort = item[1];
    const zip = item[0];
    const availability = item[2];
    const servingNow = item[3];
    return {
      stateShort,
      zip,
      availability,
      servingNow,
    };
  });

  return mapped;
};
