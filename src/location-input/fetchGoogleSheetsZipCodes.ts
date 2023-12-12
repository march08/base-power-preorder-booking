export type SheetResult = {
  majorDimension: string;
  range: string;
  values: [string, string, string][];
};

export type SheetDataConfig = {
  sheetId: string;
  sheetPage: string;
  googlePublicApiKey: string;
};

const PAGE_SIZE = 500;

const fetchSheetData = async (sheetConfig: SheetDataConfig, page = 1) => {
  const { sheetId, sheetPage, googlePublicApiKey } = sheetConfig;
  const values = await fetch(
    encodeURI(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetPage}!C${
        8 + PAGE_SIZE * (page - 1)
      }:E${8 + PAGE_SIZE * page}?key=${googlePublicApiKey}`
    )
  )
    .then((res) => res.json())
    .then((res) => (res as SheetResult).values);

  if (values.length === PAGE_SIZE) {
    return [...values, ...(await fetchSheetData(sheetConfig, page + 1))];
  }

  return values;
};

/**
 *
 * data in format { [state::zip]: availability }
 */
export type SheetZips = Record<string, string>;

export const fetchGoogleSheetsZipCodes = async (
  sheetDataConfig: SheetDataConfig
) => {
  const data = await fetchSheetData(sheetDataConfig);

  const mapped: SheetZips = data.reduce((res, row) => {
    const key = `${row[1]}::${row[0]}`;
    return {
      ...res,
      [key]: row[2],
    };
  }, {});

  return mapped;
};
