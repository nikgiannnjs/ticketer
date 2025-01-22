export const localTimeZone = async (createdAt: Date): Promise<string> => {
  const convertedCreatedAt = createdAt.toISOString();

  return convertedCreatedAt;
};
