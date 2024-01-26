import { useCallback, useEffect, useRef, useState } from "react";
import { useSupabase } from "../context/useSupabase";
import _ from "lodash";

export const useTypingIndicator = ({ roomId, userId }) => {
  const {
    currentUser,

    supabase,
  } = useSupabase();

  const [isTyping, setIsTyping] = useState(false);
  const [payload, setPayload] = useState(null);
  const channelRef = useRef(null);

  useEffect(() => {
    const newChannel = supabase.channel(`typing:${62}`);

    const onTyping = (payload) => {
      setPayload(payload);
      setIsTyping(true);
      hideTypingIndicator();
    };

    const hideTypingIndicator = () => {
      setTimeout(() => setIsTyping(false), 2000);
    };

    newChannel.on("broadcast", { event: "typing" }, onTyping);
    const subscription = newChannel.subscribe();

    channelRef.current = newChannel;

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, userId]);

  const throttledTypingEvent = _.throttle(() => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId },
    });
  }, 3000);

  const sendTypingEvent = useCallback(() => {
    throttledTypingEvent();
  }, [throttledTypingEvent]);

  return { payload, isTyping, sendTypingEvent };
};
