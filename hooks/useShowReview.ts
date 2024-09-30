import * as StoreReview from "expo-store-review";

export async function CheckReview() {
  const isAvailable = await StoreReview.isAvailableAsync();

  console.log("isAvailable", isAvailable);
  if (isAvailable) {
    StoreReview.requestReview();
  }
}
