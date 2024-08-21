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
  // const updatedLikes = [...likes, { prayer_id: id, user_id: userId }];
  // setLikes(updatedLikes);
  // if (isLikedByMe) {
  //   scale.value = withSequence(
  //     withSpring(1.2, { damping: 2, stiffness: 80 }),
  //     withSpring(1, { damping: 2, stiffness: 80 })
  //   );
  //   await supabase
  //     .from("message_likes")
  //     .delete()
  //     .eq("prayer_id", id)
  //     .eq("user_id", currentUser.id);

  //   channel.send({
  //     type: "broadcast",
  //     event: "message",
  //     payload: {
  //       type: "like",
  //       prayer_id: id,
  //       user_id: currentUser.id,
  //     },
  //   });
  //   setReactionModalVisibile(false);
  //   return;
  // }

  channel.send({
    type: "broadcast",
    event: "message",
    payload: {
      type: "like",
      prayer_id: id,
      user_id: userId,
    },
  });

  // scale.value = withSequence(
  //   withSpring(1.2, { damping: 2, stiffness: 80 }),
  //   withSpring(1, { damping: 2, stiffness: 80 })
  // );
  const { error } = await supabase.from("message_likes").insert({
    prayer_id: id,
    user_id: userId,
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
  const updatedPraises = [...praises, { prayer_id: id, user_id: userId }];
  setPraises(updatedPraises);
  // if (isLikedByMe) {
  //   scale.value = withSequence(
  //     withSpring(1.2, { damping: 2, stiffness: 80 }),
  //     withSpring(1, { damping: 2, stiffness: 80 })
  //   );
  //   await supabase
  //     .from("message_likes")
  //     .delete()
  //     .eq("prayer_id", id)
  //     .eq("user_id", currentUser.id);

  //   channel.send({
  //     type: "broadcast",
  //     event: "message",
  //     payload: {
  //       type: "like",
  //       prayer_id: id,
  //       user_id: currentUser.id,
  //     },
  //   });
  //   setReactionModalVisibile(false);
  //   return;
  // }

  channel.send({
    type: "broadcast",
    event: "message",
    payload: {
      type: "praise",
      prayer_id: id,
      user_id: userId,
    },
  });

  // scale.value = withSequence(
  //   withSpring(1.2, { damping: 2, stiffness: 80 }),
  //   withSpring(1, { damping: 2, stiffness: 80 })
  // );
  const { error } = await supabase.from("message_praises").insert({
    prayer_id: id,
    user_id: userId,
  });

  // notifyLike(expoToken, message);
  // setReactionModalVisibile(false);
  if (error) {
    console.log("insert like err: ", error);
  }
}
