//@ts-nocheck
export async function fetchLikes(prayerId, supabase) {
  //prayer_id for production
  //prayertest_id for testing
  let likesArray;
  try {
    // setIsLoadingLikes(true);
    const { data, error: likesError } = await supabase
      .from("message_likes")
      .select()
      .eq("prayer_id", prayerId);

    // console.log("likes: ", likes);
    // setLikes(likes);
    likesArray = data;
    // setLikes(data);
    if (likesError) {
      console.log("likesError: ", likesError);
    }
  } catch (error) {
    console.log("Error fetching likes" + error);
  }
  // setIsLoadingLikes(false);
  return likesArray;
}

export async function fetchPraises(prayerId, supabase) {
  let praisesArray;
  try {
    const { data, error: praisesError } = await supabase
      .from("message_praises")
      .select()
      .eq("prayer_id", prayerId);
    praisesArray = data;
    if (praisesError) {
      console.log("praiseError: ", praisesError);
    }
  } catch (error) {
    console.log("Error fetching praises", error);
  }

  return praisesArray;
}
