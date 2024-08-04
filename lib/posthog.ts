import PostHog from "posthog-react-native";

import config from "@config";

export const posthog = new PostHog(config.postHog!);
