export const dateTimeFormatCheck = async (
  dateTime: string
): Promise<boolean> => {
  const DateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;

  if (!DateTimeRegex.test(dateTime)) {
    return false;
  }

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
};
