import React from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

import { REMINDER_SCREEN } from "../routes";

export function useRouterNotifications() {
  const router = useRouter();

  React.useEffect(() => {
    let isMounted = true;

    function processUrl(url: string) {
      console.log("Processing URL", url);

      // To support legacy `screen` notification data
      if (url === "Reminder") {
        return REMINDER_SCREEN;
      }

      // In case you need to modify the URL to make it relative.
      return url;
    }

    // Handle URL from expo push notifications
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted) {
        return;
      }
      try {
        const content = response?.notification?.request?.content;

        if (!content) {
          return;
        }

        const url = content.data.url || content.data.screen;

        if (url) {
          router.replace(processUrl(url));
        }
      } catch (error) {
        console.error("Error processing last notification", error);
      }
    });

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        try {
          const content = response?.notification?.request?.content;
          if (!content) {
            return;
          }

          const url = content.data.url || content.data.screen;
          if (url) {
            router.replace(processUrl(url));
          }
        } catch (error) {
          console.error("Error processing received notification", error);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
