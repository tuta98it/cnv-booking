export enum BadyCrib {
  NO = 0,
  YES = 1,
};

export const BadyCribText = {
  [BadyCrib.YES] : "Có",
  [BadyCrib.NO] : "Không",
};


export enum BadyCribTFStr {
  NO = "false",
  YES = "true",
};

export const BadyCribEnumText: Record<BadyCribTFStr, string> = {
  [BadyCribTFStr.YES]: "Có",
  [BadyCribTFStr.NO]: "Không",
};
