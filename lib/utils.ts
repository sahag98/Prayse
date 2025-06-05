import { useSupabase } from "@context/useSupabase";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//@ts-ignore

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const tokenProvider = async (supabase: any) => {
  const { data } = await supabase.functions.invoke("stream-token");

  return data.token;
};
