//@ts-nocheck

export async function toggleLike(
  id,
  expoToken,
  message,
  supabase,
  setLikes,
  likes,
  userId,
  channel,
) {
  const currentDate = new Date();
  const isoDateString = currentDate.toISOString();
  const isoStringWithOffset = isoDateString.replace("Z", "+00:00");
  const { data, error } = await supabase
    .from("message_likes")
    .insert({
      prayer_id: id,
      user_id: userId,
    })
    .select()
    .single();

  console.log("id insert: ", data.id);

  channel.send({
    type: "broadcast",
    event: "message",
    payload: {
      type: "like",
      id: data.id,
      createdAt: isoStringWithOffset,
      prayer_id: id,
      user_id: userId,
    },
  });

  console.log(message);

  // notifyLike(expoToken, message);
  // setReactionModalVisibile(false);
  if (error) {
    console.log("insert like err: ", error);
  }
}

const notifyLike = async (expoToken, item) => {
  const message = {
    to: expoToken,
    sound: "default",
    title: `${currGroup.name} 📢`,
    body: `${currentUser.full_name} has reacted on ${item} with a prayer 🙏`,
    data: {
      screen: PRAYER_GROUP_SCREEN,
      group_id: currGroup.id,
    },
  };
  await axios.post("https://exp.host/--/api/v2/push/send", message, {
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
  });
};
export async function togglePraise(
  id,
  expoToken,
  message,
  supabase,
  setPraises,
  praises,
  userId,
  channel,
) {
  const currentDate = new Date();
  const isoDateString = currentDate.toISOString();
  const isoStringWithOffset = isoDateString.replace("Z", "+00:00");

  const { data, error } = await supabase
    .from("message_praises")
    .insert({
      prayer_id: id,
      user_id: userId,
    })
    .select()
    .single();

  channel.send({
    type: "broadcast",
    event: "message",
    payload: {
      type: "praise",
      id: data.id,
      createdAt: isoStringWithOffset,
      prayer_id: id,
      user_id: userId,
    },
  });

  // notifyLike(expoToken, message);
  // setReactionModalVisibile(false);
  if (error) {
    console.log("insert like err: ", error);
  }
}
