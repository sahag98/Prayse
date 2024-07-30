import { ActualTheme } from "../types/reduxTypes";

export const getMainBackgroundColorStyle = (theme: ActualTheme) => {
  return theme && theme.Bg ? { backgroundColor: theme.Bg } : {};
};

export const getPrimaryBackgroundColorStyle = (theme: ActualTheme) => {
  return theme && theme.Primary ? { backgroundColor: theme.Primary } : {};
};

export const getSecondaryBackgroundColorStyle = (theme: ActualTheme) => {
  return theme && theme.Secondary ? { backgroundColor: theme.Secondary } : {};
};

export const getMainTextColorStyle = (theme: ActualTheme) => {
  return theme && theme.MainTxt ? { color: theme.MainTxt } : {};
};

export const getPrimaryTextColorStyle = (theme: ActualTheme) => {
  return theme && theme.PrimaryTxt ? { color: theme.PrimaryTxt } : {};
};

export const getSecondaryTextColorStyle = (theme: ActualTheme) => {
  return theme && theme.SecondaryTxt ? { color: theme.SecondaryTxt } : {};
};
