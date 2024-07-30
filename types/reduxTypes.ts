export type Prayer = {
  category: string;
  date: string;
  folder: string;
  folderId: string;
  id: string;
  prayer: string;
};

export type AnsweredPrayer = {
  answeredDate: string;
  id: string;
  prayer: Prayer;
};

export type ActualTheme = {
  Accent: string;
  AccentTxt: string;
  Bg: string;
  MainTxt: string;
  Primary: string;
  PrimaryTxt: string;
  Secondary: string;
  SecondaryTxt: string;
  id: string;
};
