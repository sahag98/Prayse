export const getMainBackgroundColorStyle = (theme: any) => {
  return theme.Bg ? { backgroundColor: theme.Bg } : {};
};

export const getPrimaryBackgroundColorStyle = (theme: any) => {
  return theme.Primary ? { backgroundColor: theme.Primary } : {};
};

export const getSecondaryBackgroundColorStyle = (theme: any) => {
  return theme.Secondary ? { backgroundColor: theme.Secondary } : {};
};

export const getMainTextColorStyle = (theme: any) => {
  return theme.MainTxt ? { color: theme.MainTxt } : {};
};

export const getPrimaryTextColorStyle = (theme: any) => {
  return theme.PrimaryTxt ? { color: theme.PrimaryTxt } : {};
};

export const getSecondaryTextColorStyle = (theme: any) => {
  return theme.SecondaryTxt ? { color: theme.SecondaryTxt } : {};
};
