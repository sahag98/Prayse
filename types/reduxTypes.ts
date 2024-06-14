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
