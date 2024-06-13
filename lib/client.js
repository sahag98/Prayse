import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

import config from "../config";

export const client = createClient({
  projectId: "kujc6snh",
  dataset: "production",
  apiVersion: "2023-03-21",
  useCdn: true,
  token: config.sanityToken,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};
