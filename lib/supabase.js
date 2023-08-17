// import "react-native-url-polyfill/auto";
// import * as SecureStore from "expo-secure-store";
// import { createClient } from "@supabase/supabase-js";
// import { SUPABASE_URL, SUPABASE_ANON } from "@env";
// const ExpoSecureStoreAdapter = {
//   getItem: (key) => {
//     return SecureStore.getItemAsync(key);
//   },
//   setItem: (key, value) => {
//     SecureStore.setItemAsync(key, value);
//   },
//   removeItem: (key) => {
//     SecureStore.deleteItemAsync(key);
//   },
// };

// const supabaseUrl = SUPABASE_URL;
// const supabaseAnonKey = SUPABASE_ANON;

// console.log(supabaseUrl);

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: ExpoSecureStoreAdapter,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });
