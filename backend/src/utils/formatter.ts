export const formatter = async (wordToFormat: string): Promise<string> => {
  const formatFirstName: string =
    wordToFormat.charAt(0).toLocaleUpperCase() + wordToFormat.slice(1);

  return wordToFormat;
};
