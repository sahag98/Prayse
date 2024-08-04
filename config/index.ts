const config = {
  prayseMessage: process.env.EXPO_PUBLIC_PRAYSE_MESSAGE,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,

  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON,

  sanityToken: process.env.EXPO_PUBLIC_SANITY_TOKEN,

  androidPackageName: process.env.EXPO_PUBLIC_ANDROID_PACKAGE_NAME,
  iosItemId: process.env.EXPO_PUBLIC_IOS_ITEM_ID,

  notificationApi: process.env.EXPO_PUBLIC_NOTIFICATION_API,
  postHog: process.env.EXPO_PUBLIC_POSTHOG_KEY,
};

export default config;
