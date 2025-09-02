import { router } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import {
  PRAYER_GROUP_SCREEN,
  QUESTION_SCREEN,
  REMINDER_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
export function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const data = notification.request.content.data;

      console.log("data: ", notification.request.content);

      const url = data?.url || data?.screen;

      if (url) {
        console.log("url exists!!", url);

        const navigateWithDelay = (screen: string, params?: any) => {
          console.log("screen: ", screen);
          if (params) {
            router.push({ pathname: screen, params });
          } else {
            router.push(screen);
          }
        };

        if (
          ["PrayerGroup", PRAYER_GROUP_SCREEN].includes(url) &&
          data.group_id
        ) {
          navigateWithDelay(PRAYER_GROUP_SCREEN, {
            group_id: data.group_id,
          });
        } else if (["VerseOfTheDay", VERSE_OF_THE_DAY_SCREEN].includes(url)) {
          console.log("verse of they day!!!");
          navigateWithDelay(VERSE_OF_THE_DAY_SCREEN);
        } else if (
          ["Question", QUESTION_SCREEN].includes(url) &&
          data.title &&
          data.question_id
        ) {
          navigateWithDelay(QUESTION_SCREEN, {
            title: data.title,
            question_id: data.question_id,
          });
        } else if (["Prayer Reminder", REMINDER_SCREEN].includes(url)) {
          // navigateWithDelay(REMINDER_SCREEN)
          router.push(`${REMINDER_SCREEN}/${data.reminder_id}`);
        } else if (["prayer-video-call"].includes(url) && data.group_id) {
          console.log("HEREEEE");
          router.push(`prayer-video-call/${data.group_id}`);
        } else {
          navigateWithDelay(url);
        }
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
