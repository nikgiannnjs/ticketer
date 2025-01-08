export const emailValidation = async (email: string): Promise<boolean> => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validation = regex.test(email);

    return validation;
}