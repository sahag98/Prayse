type content = {
  description?: string;
  img?: string;
  blurhash?: string;
};

export type UpdateItemType = {
  title: string;
  data: content[];
};
