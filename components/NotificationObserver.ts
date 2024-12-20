import { useNavigation } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import {
  PRAYER_GROUP_SCREEN,
  QUESTION_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
export function useNotificationObserver() {
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const data = notification.request.content.data;

      const url = data?.url || data?.screen;

      if (url) {
        console.log("url exists!!", url);

        const navigateWithDelay = (screen: string, params?: any) => {
          setTimeout(() => {
            //@ts-ignore
            navigation.navigate(screen, params);
          }, 0); // 2 seconds delay
        };

        if (
          ["PrayerGroup", PRAYER_GROUP_SCREEN].includes(url) &&
          data.group_id
        ) {
          navigateWithDelay(PRAYER_GROUP_SCREEN, {
            group_id: data.group_id,
          });
        } else if (["VerseOfTheDay", VERSE_OF_THE_DAY_SCREEN].includes(url)) {
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