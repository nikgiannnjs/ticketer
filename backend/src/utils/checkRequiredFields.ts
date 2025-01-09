export const checkRequiredFields = async (
  data: { [key: string]: any },
  requiredFields: string[],
): Promise<string[]> => {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      missingFields.push(field);
    }
  });

  return missingFields;
};
