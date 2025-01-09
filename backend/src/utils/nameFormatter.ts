export const nameFormatter = async (
  firstName: string,
  lastName: string,
): Promise<string> => {
  const formatFirstName: string =
    firstName.charAt(0).toLocaleUpperCase() + firstName.slice(1);
  const formatLastName: string =
    lastName.charAt(0).toLocaleUpperCase() + lastName.slice(1);

  const name: string = formatFirstName + " " + formatLastName;

  return name;
};
